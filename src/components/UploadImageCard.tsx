import clsx from 'clsx';
import Icon24 from './basics/Icon24';
import { toast } from './basics/Toast';
import { useFileDrop, useFilePaste } from './basics/hooks/file';
import { useDetach } from './basics/hooks/orphan';
import { useCallback } from 'react';

const mimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export interface Props {
  onUpload?: (image: File) => void;
}

export default function UploadImageCard({ onUpload }: Props): React.ReactElement {
  const detach = useDetach();

  const upload = useCallback(
    (file: File) => {
      if (!mimeTypes.find(mimeType => mimeType == file.type)) {
        const supportedFileTypes = mimeTypes.join(', ');
        void detach(toast('warn', `Unsupported file type. Expected ${supportedFileTypes}.`));
        return;
      }

      onUpload?.(file);
    },
    [detach, onUpload]
  );

  const fileDrop = useFileDrop(files => {
    if (!files.length) return;
    upload(files[0]);
  });

  useFilePaste(upload, [upload]);

  return (
    <div className="max-w-3xl my-12 mx-auto bg-white rounded-md px-4 py-2 shadow-md">
      <div className="text-slate-500 text-xl font-bold flex items-center p-2 m-4 border-b-2 border-slate-400 space-x-2">
        <Icon24 name="plus-circle" className="w-6 h-6" />
        <div>Upload a base image</div>
      </div>

      <div
        ref={fileDrop.ref}
        className={clsx(
          'py-4 px-8 flex flex-col items-center space-y-8 rounded-md',
          fileDrop.isDropping ? 'bg-slate-300' : 'bg-transparent'
        )}
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
