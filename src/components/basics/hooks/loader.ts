/**
 * Hooks that load as much data as needed from the source as appropriate.
 * @module
 */

import { useEffect, useRef, useState } from 'react';

export type Source<T> = (last: T | null) => Promise<T[]>;

export interface Loader<T> {
  data: T[];
  state: State;
}

export type State = 'loading' | 'loaded' | 'depleted';

export function useLoader<T>(source: Source<T>, count: number): Loader<T> {
  const [isDepleted, setIsDepleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const loadingRequired = data.length < count;
  const active = useRef(false);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isDepleted && !isLoading && loadingRequired) {
      setIsLoading(true);
      source(data.length == 0 ? null : data[data.length - 1]).then(additionalData => {
        if (!active.current) return;
        if (additionalData.length == 0) {
          setIsDepleted(true);
        } else {
          setData([...data, ...additionalData]);
          setIsLoading(false);
        }
      });
    }
  }, [data, isDepleted, isLoading, loadingRequired, source]);

  return {
    state: isDepleted ? 'depleted' : isLoading || loadingRequired ? 'loading' : 'loaded',
    data: data.slice(0, count),
  };
}
