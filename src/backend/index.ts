import storage from './google-cloud/storage';
import prisma from './prisma/client';
import { SizeLimitter } from './stream/size-limitter';
import { pipeline } from './stream/promises';
import type { ReadStream } from 'fs';
import crypto from 'crypto';

export interface File {
  // compatible with graphql-upload/FileUpload
  mimetype: string;
  createReadStream(): ReadStream;
}

// entities

export interface Operator {
  id: string;
  role: Role;
}

export type Role = 'USER' | 'ADMIN';

export interface Template<Content = TemplateContent> {
  id: string;
  name: string;
  ownerId: string;
  accessibility: Accessibility;
  image: string;
  createdAt: Date;
  content: Content;
}

export type Accessibility = 'PUBLIC' | 'PRIVATE';

export interface TemplateContent {
  labels: TemplateLabel[];
}

export interface TemplateLabel {
  size: number;
  color: string;
  text: string;
  bold: boolean;
  vertical: boolean;
  x: number;
  y: number;
}

// use cases

export interface Context {
  operator(): Promise<Operator | null>;
  inputError(message: string): never;
  forbiddenError(message: string): never;
}

export async function deleteUser(id: string, ctx: Context): Promise<void> {
  const operator = await ctx.operator();
  if (!operator || operator.id != id) return ctx.forbiddenError('User mismatch');

  const takeSize = 50;
  let cursor = undefined;
  while (true) {
    const ts = await prisma.template.findMany({
      where: { ownerId: operator.id },
      take: takeSize,
      cursor,
    });

    await prisma.template.deleteMany({ where: { id: { in: ts.map(t => t.id) } } });
    for (const t of ts) await deleteTemplateImage(t.image);

    if (ts.length != takeSize) break;
  }

  await prisma.user.deleteMany({ where: { id } });
}

export async function getTemplate(id: string, ctx: Context): Promise<Template> {
  const t: Template<any> | null = await prisma.template.findUnique({ where: { id } });
  if (!t) return ctx.inputError(`Template ${id} not found`);
  return t;
}

export interface TemplatesFilter {
  name?: string | null;
  owned?: boolean | null;
  published?: boolean | null;
}

export async function getTemplates(
  num: number,
  cursor: string | null,
  filter: TemplatesFilter | null,
  ctx: Context
): Promise<Template[]> {
  if (num < 0) return [];
  if (50 < num) return ctx.inputError('Cannot get more than 50 templates at a time');

  const operator = await ctx.operator();

  const ts: Template<any>[] = await prisma.template.findMany({
    where: {
      AND: [
        operator
          ? { OR: [{ ownerId: operator.id }, { accessibility: 'PUBLIC' }] }
          : { accessibility: 'PUBLIC' },
        {
          ownerId: filter?.owned ? operator?.id : undefined,
          accessibility: filter?.published ? 'PUBLIC' : undefined,
          name: filter?.name ? { search: filter.name } : undefined,
        },
      ],
    },
    take: num,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  return ts;
}

function validateTemplateName(name: string, ctx: Context): void {
  if (name.length == 0 || 200 <= name.length) return ctx.inputError('0 < name.length <= 200');
}

export async function createTemplate(name: string, imageFile: File, ctx: Context): Promise<string> {
  validateTemplateName(name, ctx);

  const operator = await ctx.operator();
  if (!operator) return ctx.forbiddenError('Sign-in required');

  const image = await createTemplateImage(imageFile);

  try {
    const template = await prisma.template.create({
      data: {
        name,
        accessibility: 'PRIVATE',
        image,
        content: initialTemplateContent as any, // TemplateContent -> JsonValue
        owner: { connect: { id: operator.id } },
      },
    });
    return template.id;
  } catch (e) {
    await deleteTemplateImage(image);
    throw e;
  }
}

const initialTemplateContent: TemplateContent = {
  labels: [],
};

export interface TemplateChange {
  name?: string | null;
  image?: File | null;
  accessibility?: Accessibility | null;
  content?: TemplateContentChange | null;
}

export type TemplateContentChange = { [P in keyof TemplateContent]?: TemplateContent[P] | null };

export async function updateTemplate(
  id: string,
  { name, image: imageFile, accessibility, content }: TemplateChange,
  ctx: Context
): Promise<boolean> {
  if (name) validateTemplateName(name, ctx);

  const operator = await ctx.operator();
  if (!operator) return ctx.forbiddenError('Sign-in required');

  const t: Template<any> | null = await prisma.template.findUnique({ where: { id } });
  if (!t) return ctx.inputError(`Template ${id} not found`);
  if (t.ownerId != operator.id) return ctx.forbiddenError('User mismatch');
  if (accessibility && operator.role != 'ADMIN') {
    return ctx.forbiddenError('Only OWNER can change the template accessibility');
  }

  // Create a template image if updated
  const image = imageFile ? await createTemplateImage(imageFile) : undefined;

  await prisma.template.update({
    where: { id },
    data: {
      name: name ?? undefined,
      accessibility: accessibility ?? undefined,
      image,
      content: content
        ? (updateTemplateContent(t.content, content) as any) // TemplateContent -> JsonValue
        : undefined,
    },
  });

  // Delete the previous template image
  if (image) await deleteTemplateImage(t.image);

  return true;
}

function updateTemplateContent(base: TemplateContent, c: TemplateContentChange): TemplateContent {
  const r = { ...base };
  if (c.labels) r.labels = c.labels;
  return r;
}

export async function deleteTemplate(id: string, ctx: Context): Promise<boolean> {
  const operator = await ctx.operator();
  if (!operator) return ctx.forbiddenError('Sign-in required');

  const t = await prisma.template.findUnique({ where: { id } });
  if (!t) return false;
  if (t.ownerId != operator.id) return ctx.forbiddenError('User mismatch');

  await prisma.template.delete({ where: { id } });
  await deleteTemplateImage(t.image);

  return true;
}

const templateImagesBucket = storage.bucket(
  process.env.GOOGLE_CLOUD_STORAGE_TEMPLATE_IMAGES_BUCKET!
);

export const templateImageRestriction = {
  mimeTypes: 'image/jpeg image/png image/gif image/webp'.split(/ /),
  fileSize: 4 * 1000 * 1000,
};

async function createTemplateImage(file: File): Promise<string> {
  if (!templateImageRestriction.mimeTypes.find(mimeType => mimeType == file.mimetype)) {
    throw new Error(`Unsupported MIME Type: ${file.mimetype}`);
  }

  const id = crypto.randomBytes(16).toString('hex');
  const src = file.createReadStream();
  const dest = templateImagesBucket.file(id).createWriteStream({ contentType: file.mimetype });
  const sizeLimitter = new SizeLimitter(templateImageRestriction.fileSize, src, dest);
  await pipeline(src, sizeLimitter, dest);
  return id;
}

async function deleteTemplateImage(id: string): Promise<boolean> {
  try {
    await templateImagesBucket.file(id).delete({ ignoreNotFound: true });
    return true;
  } catch {
    return false;
  }
}

export function templateImagePublicUrl(id: string): string {
  return templateImagesBucket.file(id).publicUrl();
}
