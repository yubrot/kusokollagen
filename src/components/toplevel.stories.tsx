import ApplicationFooterImpl from './ApplicationFooter';
import TemplateEditorImpl from './TemplateEditor';
import ApplicationHeaderImpl from './ApplicationHeader';
import UploadImageCardImpl from './UploadImageCard';
import { useImageBitmap } from './basics/hooks/image-bitmap';

export function ApplicationHeader(): React.ReactElement {
  return (
    <div className="container-lg">
      <h1 className="heading">Default</h1>
      <div className="pseudo-frame pb-16">
        <ApplicationHeaderImpl />
      </div>

      <h1 className="heading">Loading</h1>
      <div className="pseudo-frame pb-16">
        <ApplicationHeaderImpl isLoading />
      </div>
    </div>
  );
}

export function ApplicationFooter(): React.ReactElement {
  return (
    <div className="container-lg">
      <div className="pseudo-frame pt-16">
        <ApplicationFooterImpl />
      </div>
    </div>
  );
}

export function UploadImageCard(): React.ReactElement {
  return (
    <div className="container-lg">
      <div className="pseudo-frame">
        <UploadImageCardImpl />
      </div>
    </div>
  );
}

export function TemplateEditor(): React.ReactElement {
  const { data: initialImage } = useImageBitmap('https://picsum.photos/600');
  return <>{initialImage && <TemplateEditorBody image={initialImage} />}</>;
}

function TemplateEditorBody({ image }: { image: ImageBitmap }): React.ReactElement {
  return (
    <TemplateEditorImpl
      source={{
        name: 'template name',
        image,
        labels: [
          {
            size: 16,
            color: '#f00',
            text: 'あのイーハトーヴォのすきとおった風、\\n夏でも底に冷たさをもつ青いそら、',
            bold: true,
            vertical: false,
            x: 10,
            y: 10,
          },
          {
            size: 20,
            color: '#0f0',
            text: 'あのイーハトーヴォの\\nすきとおった風、\\n夏でも底に冷たさをもつ\\n青いそら、',
            bold: false,
            vertical: true,
            x: 260,
            y: 60,
          },
        ],
      }}
      onSave={() => Promise.resolve()}
      onDelete={() => Promise.resolve()}
    />
  );
}
