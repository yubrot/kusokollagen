/**
 * Hooks to detach components from the original component tree.
 * @module
 */

import { createContext, Fragment, useCallback, useContext, useRef, useState } from 'react';

interface Orphan {
  elements: OrphanElement[];
  detach: Detach;
}

interface OrphanElement {
  id: number;
  body: React.ReactElement;
}

/**
 * Detach the component. The input function creates a component, which is mounted in
 * {@link OrphanContainer} independently. The input function must call either {@link resolve} or
 * {@link reject} given as arguments when the component finishes its role.
 */
export type Detach = <T>(
  handler: (resolve: (result: T) => void, reject: (error: unknown) => void) => React.ReactElement
) => Promise<T>;

const OrphanContext = createContext<Orphan>({
  elements: [],
  detach: () => Promise.reject(new Error()),
});

export function useDetach(): Detach {
  return useContext(OrphanContext).detach;
}

export interface OrphanProviderProps {
  children?: React.ReactNode;
}

export function OrphanProvider({ children }: OrphanProviderProps): React.ReactElement {
  const [elements, setElements] = useState<OrphanElement[]>([]);
  const idRef = useRef(0);

  const detach = useCallback(
    (handler => {
      const id = ++idRef.current;
      return new Promise((resolve, reject) => {
        setElements(ls => [...ls, { id, body: handler(resolve, reject) }]);
      }).finally(() => {
        setElements(ls => ls.filter(element => element.id != id));
      });
    }) as Detach,
    []
  );

  return <OrphanContext.Provider value={{ elements, detach }}>{children}</OrphanContext.Provider>;
}

export interface OrphanContainerProps {
  className?: string;
}

/**
 * Container for mounting detached components. Only one must be placed inside a {@link OrphanContext}.
 */
export function OrphanContainer({ className }: OrphanContainerProps): React.ReactElement {
  const elements = useContext(OrphanContext).elements;

  return (
    <div className={className}>
      {elements.map(element => (
        <Fragment key={element.id}>{element.body}</Fragment>
      ))}
    </div>
  );
}
