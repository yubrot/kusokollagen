import { useRef, useEffect, useState } from 'react';

export interface ImageBitmapOrError {
  data: ImageBitmap | null;
  error: unknown | null;
}

export function useImageBitmap(url: string | null): ImageBitmapOrError {
  const isMounted = useRef(false);
  const [state, setState] = useState<ImageBitmapOrError>({ data: null, error: null });

  useEffect(() => {
    if (!url) {
      setState({ data: null, error: null });
      return;
    }

    isMounted.current = true;

    (async () => {
      try {
        const response = await fetch(url, { mode: 'cors' });
        const blob = await response.blob();
        const image = await createImageBitmap(blob);
        setState({ data: image, error: null });
      } catch (error) {
        setState({ data: null, error });
      }
    })();

    return () => {
      isMounted.current = false;
    };
  }, [url]);

  return state;
}
