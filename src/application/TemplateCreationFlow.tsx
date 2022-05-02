import { useRouter } from 'next/router';
import { useCallback } from 'react';
import Component from '../components/TemplateCreationFlow';
import { useCreateTemplate, useTemplateImageRestriction } from './hooks/api';

export interface Props {}

export default function TemplateCreationFlow(_: Props): React.ReactElement {
  const router = useRouter();
  const templateImageRestriction = useTemplateImageRestriction();
  const createTemplate = useCreateTemplate();
  const createTemplateAndTransition = useCallback(
    async (name: string, image: Blob) => {
      const id = await createTemplate(name, image);
      router.push(`/t/${id}`);
    },
    [createTemplate, router]
  );

  return (
    <Component
      supportedImage={
        templateImageRestriction.data || {
          mimeTypes: [],
          fileSize: 0,
        }
      }
      createTemplate={createTemplateAndTransition}
    />
  );
}
