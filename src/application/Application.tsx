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
  const [source, setSource] = useState<Template | null>(null);
  const openEditor = useCallback(
    async (file: File) => {
      try {
        const image = await createImageBitmap(file);
        setSource({ name: file.name, image, labels: [], accessibility: 'PRIVATE' });
      } catch (e) {
        detach(toast('error', `Failed to load image: ${e instanceof Error ? e.message : e}`));
      }
    },
    [detach, setSource]
  );
  const deleteSource = useCallback(async () => setSource(null), [setSource]);

  return (
    <div className="absolute inset-0 flex flex-col">
      <ApplicationHeader />
      <div className="flex-grow my-8">
        {source ? (
          <TemplateEditor source={source} onDelete={deleteSource} />
        ) : (
          <UploadImageCard onUpload={openEditor} />
        )}
      </div>
      <ApplicationFooter />
    </div>
  );
}
