import ApplicationCoverImpl from './ApplicationCover';
import CreateTemplateImpl from './TemplateCreationFlow';
import ApplicationFooterImpl from './ApplicationFooter';
import PagerTemplateListImpl from './PagerTemplateList';
import ScrollTemplateListImpl from './ScrollTemplateList';
import SignInRequiredCardImpl from './SignInRequiredCard';
import UserSettingsImpl from './UserSettings';
import TemplateEditorImpl from './TemplateEditor';
import ApplicationHeaderImpl from './ApplicationHeader';
import Slider from './common/Slider';
import { useImageBitmap } from './common/hooks/image-bitmap';
import { useLoader } from './common/hooks/loader';
import { useState } from 'react';

export function ApplicationHeader(): React.ReactElement {
  return (
    <div className="container-lg">
      <h1 className="heading">Before sign-in</h1>
      <div className="pseudo-frame pb-16">
        <ApplicationHeaderImpl isLoading userMenu={[{ text: 'Sign in' }]} />
      </div>

      <h1 className="heading">After sign-in</h1>
      <div className="pseudo-frame pb-16">
        <ApplicationHeaderImpl
          userImageUrl="https://picsum.photos/64"
          userMenu={[{ text: 'Settings' }, { text: 'Sign out' }]}
        />
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

export function ApplicationCover(): React.ReactElement {
  return (
    <div className="container-lg">
      <div className="pseudo-frame">
        <ApplicationCoverImpl />
      </div>
    </div>
  );
}

export function SignInRequiredCard(): React.ReactElement {
  return (
    <div className="container-lg">
      <div className="pseudo-frame">
        <SignInRequiredCardImpl />
      </div>
    </div>
  );
}

export function UserSettings(): React.ReactElement {
  return (
    <div className="container-lg">
      <div className="pseudo-frame">
        <UserSettingsImpl
          deleteUserAccount={async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (Math.random() < 0.5) throw 'error test';
          }}
        />
      </div>
    </div>
  );
}

export function TemplateCreationFlow(): React.ReactElement {
  return (
    <div className="container-lg">
      <div className="pseudo-frame">
        <CreateTemplateImpl
          supportedImage={{
            mimeTypes: 'image/jpeg image/png image/gif image/webp'.split(/ /),
            fileSize: 50 * 1024 * 1024,
          }}
          createTemplate={async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (Math.random() < 0.5) throw 'error test';
          }}
        />
      </div>
    </div>
  );
}

export function ScrollTemplateList(): React.ReactElement {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [requiredCount, setRequiredCount] = useState(0);
  const [loaderDelay, setLoaderDelay] = useState(500);
  const { data, state } = useLoader<number>(async last => {
    await new Promise(resolve => setTimeout(resolve, loaderDelay));
    const offset = last ?? 0;
    return Array.from({ length: 10 }, (_, index) => offset + index + 1);
  }, requiredCount);

  return (
    <div className="container-lg h-full flex flex-col">
      <div className="flex space-x-2 items-center">
        <div>Loader delay: {loaderDelay}ms</div>
        <Slider
          className="w-48"
          range={[100, 2000, 100]}
          value={loaderDelay}
          onChange={setLoaderDelay}
        />
      </div>

      <div className="flex-1 pseudo-frame overflow-auto" ref={setContainer}>
        <ScrollTemplateListImpl
          container={container}
          name="Popular templates"
          icon="sparkles"
          items={data.map(n => ({
            name: `Item ${n}`,
            image: `https://picsum.photos/${150 + n}/${200 + n}`,
          }))}
          areItemsDepleted={state == 'depleted'}
          onRequireItems={setRequiredCount}
        />
      </div>
    </div>
  );
}

export function PagerTemplateList(): React.ReactElement {
  const nonEmptyItems = [
    { name: 'Item 0', image: 'https://picsum.photos/200/300' },
    { name: 'Item 1', image: 'https://picsum.photos/300/200' },
    { name: 'Item 2', image: 'https://picsum.photos/300/100' },
    { name: 'Item 3', image: 'https://picsum.photos/100/300' },
    { name: 'Item 4', image: 'https://picsum.photos/200/200' },
    { name: 'Item 5', image: null },
  ];

  const [requiredCount, setRequiredCount] = useState(0);
  const [loaderDelay, setLoaderDelay] = useState(500);
  const { data, state } = useLoader<number>(async last => {
    await new Promise(resolve => setTimeout(resolve, loaderDelay));
    const offset = last ?? 0;
    return Array.from({ length: 10 }, (_, index) => offset + index + 1);
  }, requiredCount);

  return (
    <div className="container-lg">
      <h1 className="heading">Empty</h1>
      <div className="pseudo-frame">
        <PagerTemplateListImpl
          name="Popular templates"
          icon="sparkles"
          items={[]}
          areItemsDepleted={true}
        />
      </div>

      <h1 className="heading">Non-empty (loading)</h1>
      <div className="pseudo-frame">
        <PagerTemplateListImpl
          name="Popular templates"
          icon="sparkles"
          items={nonEmptyItems}
          areItemsDepleted={false}
        />
      </div>

      <h1 className="heading">Non-empty (depleted)</h1>
      <div className="pseudo-frame">
        <PagerTemplateListImpl
          name="Popular templates"
          icon="sparkles"
          items={nonEmptyItems}
          areItemsDepleted={true}
        />
      </div>

      <h1 className="heading">Infinite</h1>
      <div className="flex space-x-2 items-center">
        <div>Loader delay: {loaderDelay}ms</div>
        <Slider
          className="w-48"
          range={[100, 2000, 100]}
          value={loaderDelay}
          onChange={setLoaderDelay}
        />
      </div>
      <div className="pseudo-frame">
        <PagerTemplateListImpl
          name="Popular templates"
          icon="sparkles"
          items={data.map(n => ({
            name: `Item ${n}`,
            image: `https://picsum.photos/${150 + n}/${200 + n}`,
          }))}
          areItemsDepleted={state == 'depleted'}
          onRequireItems={setRequiredCount}
        />
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
        accessibility: 'PRIVATE',
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
      canMakePublic
      onSave={() => Promise.resolve()}
      onDelete={() => Promise.resolve()}
    />
  );
}
