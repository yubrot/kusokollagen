/**
 * Hooks to obtain and observe window size.
 * @module
 */

import { useEffect, useState } from 'react';

export interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>(getWindowSize);

  useEffect(() => {
    const update = () => {
      setSize(getWindowSize());
    };
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
    };
  }, []);

  return size;
}

export function getWindowSize(): WindowSize {
  if (typeof window == 'undefined') return { width: 1024, height: 768 };
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}
