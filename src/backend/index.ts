import storage from './google-cloud/storage';
import { SizeLimitter } from './stream/size-limitter';
import { pipeline } from 'stream/promises';
import type { ReadStream } from 'fs';
import crypto from 'crypto';

export interface File {
  // subset of graphql-upload/FileUpload
  mimetype: string;
  createReadStream(): ReadStream;
}

const templateImagesBucket = storage.bucket(
  process.env.GOOGLE_CLOUD_STORAGE_TEMPLATE_IMAGES_BUCKET!
);

export const templateImageRestriction = {
  mimeTypes: 'image/jpeg image/png image/gif image/webp'.split(/ /),
  fileSize: 4 * 1000 * 1000,
};

export async function createTemplateImage(file: File): Promise<string> {
  const id = crypto.randomBytes(16).toString('hex');
  await updateTemplateImage(id, file);
  return id;
}

export async function updateTemplateImage(id: string, file: File): Promise<void> {
  if (!templateImageRestriction.mimeTypes.find(mimeType => mimeType == file.mimetype)) {
    throw new Error(`Unsupported MIME Type: ${file.mimetype}`);
  }

  const src = file.createReadStream();
  const dest = templateImagesBucket.file(id).createWriteStream({ contentType: file.mimetype });
  const sizeLimitter = new SizeLimitter(templateImageRestriction.fileSize, src, dest);
  await pipeline(src, sizeLimitter, dest);
}

export async function deleteTemplateImage(id: string): Promise<void> {
  await templateImagesBucket.file(id).delete({ ignoreNotFound: true });
}

export function templateImagePublicUrl(id: string): string {
  return templateImagesBucket.file(id).publicUrl();
}
