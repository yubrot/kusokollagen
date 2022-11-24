import { useSession } from 'next-auth/react';
import { useCallback } from 'react';
import { useImageBitmap } from '../components/basics/hooks/image-bitmap';
import LoadingSpinner from '../components/basics/LoadingSpinner';
import type { Template } from '../components/template-editor/models/template';
import { getBlob } from '../components/template-editor/models/canvas-util';
import Component from '../components/TemplateEditor';
import { useDeleteTemplate, useTemplate, useUpdateTemplate } from './hooks/api';
import { useRouter } from 'next/router';

export interface Props {
  id: string;
}

export default function TemplateEditor({ id }: Props): React.ReactElement {
  const router = useRouter();
  const session = useSession();
  const template = useTemplate(id);
  const templateImage = useImageBitmap(template.data?.image ?? null);
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();

  const handleSave = useCallback(
    async (diff: Partial<Template>) => {
      const { image: imageBitmap, ...change } = diff;
      const image = imageBitmap ? await getBlob(imageBitmap, 'image/jpeg') : undefined;
      const ok = await updateTemplate(id, { image, ...change });
      if (!ok) throw 'Something went wrong';
    },
    [id, updateTemplate]
  );

  const handleDelete = useCallback(async () => {
    const ok = await deleteTemplate(id);
    if (!ok) throw 'Something went wrong';
    router.back();
  }, [deleteTemplate, id, router]);

  if (!template.data || !templateImage.data) {
    const e = template.error || templateImage.error;
    if (e) {
      return (
        <div className="max-w-2xl mx-auto my-12 card text-red-500">
          Failed to load template: {e instanceof Error ? e.message : e}
        </div>
      );
    }

    return (
      <div className="mx-auto my-12 w-24 h-24">
        <LoadingSpinner />
      </div>
    );
  }

  const { name, owned, accessibility, labels } = template.data;
  const image = templateImage.data;
  const canMakePublic = session?.data?.user.role == 'ADMIN';
  const onSave = owned ? handleSave : undefined;
  const onDelete = owned ? handleDelete : undefined;

  return (
    <Component
      source={{ name, accessibility, labels, image }}
      canMakePublic={canMakePublic}
      onSave={onSave}
      onDelete={onDelete}
    />
  );
}
