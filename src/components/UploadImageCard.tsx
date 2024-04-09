import Icon24 from './basics/Icon24';
import { toast } from './basics/Toast';
import { useFileDrop, useFilePaste } from './basics/hooks/file';
import { useDetach } from './basics/hooks/orphan';
import { useCallback } from 'react';

const mimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export interface Props {
  onUpload?(image: File): void;
}

export default function UploadImageCard({ onUpload }: Props): React.ReactElement {
  const detach = useDetach();

  const upload = useCallback(
    (file: File) => {
      if (!mimeTypes.find(mimeType => mimeType == file.type)) {
        const supportedFileTypes = mimeTypes.join(', ');
        detach(toast('warn', `Unsupported file type. Expected ${supportedFileTypes}.`));
        return;
      }

      onUpload?.(file);
    },
    [detach, onUpload]
  );

  const fileDrop = useFileDrop(files => {
    if (!files) return;
    upload(files[0]);
  });

  useFilePaste(upload, [upload]);

  return (
    <div className="container-sm my-12 card">
      <div className="heading lined mx-4 space-x-2">
        <Icon24 name="plus-circle" className="w-6 h-6" />
        <div>Upload a base image</div>
      </div>

      <div
        ref={fileDrop.ref}
        className={`py-4 px-8 flex flex-col items-center space-y-8 rounded-md drop-${fileDrop.isDropping}`}
      >
        <div className="w-full">
          Upload a base image by drag-and-drop or from a dialog. You can also paste an image from
          the clipboard.
        </div>

        <label className="button primary-button">
          <Icon24 name="upload" className="w-5 h-5" />
          <span>Select from local images</span>
          <input
            type="file"
            accept={mimeTypes.join(',')}
            className="hidden"
            onChange={ev => {
              if (!ev.target.files) return;
              upload(ev.target.files[0]);
            }}
          />
        </label>
      </div>
    </div>
  );
}
