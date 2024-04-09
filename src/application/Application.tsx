import { useCallback, useState } from 'react';
import { useDetach } from '../components/basics/hooks/orphan';
import { toast } from '../components/basics/Toast';
import ApplicationFooter from '../components/ApplicationFooter';
import ApplicationHeader from '../components/ApplicationHeader';
import UploadImageCard from '../components/UploadImageCard';
import TemplateEditor from '../components/TemplateEditor';
import { Template } from '../components/template-editor/models/template';

export default function Application(): React.ReactElement {
  const detach = useDetach();
  const [template, setTemplate] = useState<Template | null>(null);

  const createTemplate = useCallback(
    async (file: File) => {
      try {
        const image = await createImageBitmap(file);
        setTemplate({ name: file.name, image, labels: [] });
      } catch (e) {
        detach(toast('error', `Failed to load image: ${e instanceof Error ? e.message : e}`));
      }
    },
    [detach, setTemplate]
  );
  const deleteTemplate = useCallback(async () => setTemplate(null), [setTemplate]);

  return (
    <div className="absolute inset-0 flex flex-col">
      <ApplicationHeader />
      <div className="flex-grow my-8">
        {template ? (
          <TemplateEditor source={template} onDelete={deleteTemplate} />
        ) : (
          <UploadImageCard onUpload={createTemplate} />
        )}
      </div>
      <ApplicationFooter />
    </div>
  );
}
