import LoadingSpinner from './LoadingSpinner';
import { useDeferredEffect } from './hooks/defer';
import { useState } from 'react';

export interface Props {}

export default function Progress(_: Props): React.ReactElement {
  const [show, setShow] = useState(false);
  useDeferredEffect(() => setShow(true), 100, []);

  return (
    <div
      className={`fixed z-50 inset-0 bg-opacity-50 bg-bluegray-200 flex flex-col justify-center items-center fade-true-${show}`}
    >
      <LoadingSpinner className="w-24 h-24" />
    </div>
  );
}

export function progress<T>(promise: Promise<T>) {
  return function OrphanProgress(
    resolve: (result: T) => void,
    reject: (error: unknown) => void
  ): React.ReactElement {
    promise.then(resolve).catch(reject);
    return <Progress />;
  };
}
