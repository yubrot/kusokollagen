import LoadingSpinner from './LoadingSpinner';
import { useEffect, useState } from 'react';

export interface Props {
  alt?: string;
  src?: string | Blob | null;
  loadingClassName?: string;
  className?: string;
}

export default function Image({
  alt,
  src,
  loadingClassName,
  className,
}: Props): React.ReactElement {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (src instanceof Blob) {
      const url = URL.createObjectURL(src);
      setBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setBlobUrl(null);
    }
  }, [src]);

  const url = (typeof src == 'string' && src) || blobUrl;

  return url ? (
    <img
      src={url}
      className={className}
      onLoad={() => {
        if (url == blobUrl) URL.revokeObjectURL(url);
      }}
      alt={alt}
    />
  ) : (
    <LoadingSpinner className={loadingClassName} />
  );
}
