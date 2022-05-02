import Icon24 from './common/Icon24';
import Image from './common/Image';
import Pager from './common/Pager';
import { progress } from './common/Progress';
import { toast } from './common/Toast';
import { useFileDrop } from './common/hooks/file-drop';
import { useDetach } from './common/hooks/orphan';
import { FormEvent, useCallback, useState } from 'react';

export interface Props {
  supportedImage: {
    mimeTypes: string[];
    fileSize: number;
  };
  createTemplate(name: string, image: Blob): Promise<void>;
}

export default function TemplateCreationFlow({
  supportedImage,
  createTemplate,
}: Props): React.ReactElement {
  const detach = useDetach();

  const [currentPage, setCurrentPage] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [templateName, setTemplateName] = useState('');

  const setImageAndContinueToInputName = useCallback(
    (file: File) => {
      if (!supportedImage.mimeTypes.find(mimeType => mimeType == file.type)) {
        const supportedFileTypes = supportedImage.mimeTypes.join(', ');
        detach(toast('warn', `Unsupported file type. Expected ${supportedFileTypes}.`));
        setCurrentPage(0);
        return;
      }

      if (supportedImage.fileSize < file.size) {
        const mb = supportedImage.fileSize / 1000 / 1000;
        detach(toast('warn', `File size is too large, no more than ${mb}MB is allowed.`));
        setCurrentPage(0);
        return;
      }

      setImageFile(file);
      setCurrentPage(1);
    },
    [detach, supportedImage]
  );

  const continueToCreateTemplate = useCallback(
    async (ev: FormEvent) => {
      ev.preventDefault();
      if (!imageFile || !templateName) return;

      try {
        await detach(progress(createTemplate(templateName, imageFile)));
        detach(toast('success', 'A new template has been successfully created.'));
      } catch (e) {
        detach(toast('error', `Failed to upload image: ${e instanceof Error ? e.message : e}`));
        setCurrentPage(0);
      }
    },
    [createTemplate, detach, imageFile, templateName]
  );

  const fileDrop = useFileDrop(files => {
    if (!files) return;
    setImageAndContinueToInputName(files[0]);
  });

  return (
    <div className="container-sm my-12 card">
      <div className="heading lined mx-4 space-x-2">
        <Icon24 name="plus-circle" className="w-6 h-6" />
        <div>Create a template</div>
      </div>

      <Pager
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        showNext={imageFile != null && currentPage == 0}
        showPrev={currentPage == 1}
      >
        <div
          ref={fileDrop.ref}
          className={`py-4 px-8 flex flex-col items-center space-y-8 rounded-md drop-${fileDrop.isDropping}`}
        >
          <div className="w-full">
            The created template can be accessed{' '}
            <strong className="font-bold">by anyone who knows the URL</strong>.
          </div>

          <label className="button primary-button">
            <Icon24 name="upload" className="w-5 h-5" />
            <span>Select a local image</span>
            <input
              type="file"
              accept={supportedImage.mimeTypes.join(',')}
              className="hidden"
              onChange={ev => {
                if (!ev.target.files) return;
                setImageAndContinueToInputName(ev.target.files[0]);
              }}
            />
          </label>
        </div>

        <div className="py-4 px-8 space-y-8">
          <form className="flex justify-center space-x-2" onSubmit={continueToCreateTemplate}>
            <input
              type="text"
              placeholder="Template name"
              value={templateName}
              onChange={ev => setTemplateName(ev.target.value)}
              className="text-field outlined w-64"
            />
            <button className="button primary-button" disabled={!templateName}>
              Create
            </button>
          </form>

          {currentPage == 1 && (
            <div className="mx-auto max-w-lg border-4 border-bluegray-300 bg-gradient-to-br from-bluegray-100 to-bluegray-500 flex justify-center items-center">
              <Image
                alt="preview"
                src={imageFile}
                className="object-scale-down"
                loadingClassName="w-16 h-16 my-8 text-white"
              />
            </div>
          )}
        </div>
      </Pager>
    </div>
  );
}
