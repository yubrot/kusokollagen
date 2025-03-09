/**
 * Hooks for reserving non-immediate operations.
 * @module
 */

import { useCallback, useRef, useEffect, DependencyList, useState } from 'react';

export function useDelay(): (action: () => void, delay: number) => () => void {
  const timeout = useRef(0);

  return useCallback((action: () => void, delay: number) => {
    clearTimeout(timeout.current);
    timeout.current = window.setTimeout(action, delay);
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);
}

/**
 * Hooks for side effects that are executed non-immediately.
 */
export function useDelayedEffect(action: () => void, delay: number, deps: DependencyList): void {
  const defer = useDelay();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => defer(action, delay), [defer, delay, ...deps]);
}

/**
 * Hooks that returns input with a delay.
 */
export function useDelayedValue<T>(value: T, delay: number): T {
  const [deferredValue, setDeferredValue] = useState(value);
  useDelayedEffect(
    () => {
      setDeferredValue(value);
    },
    delay,
    [value]
  );
  return deferredValue;
}
