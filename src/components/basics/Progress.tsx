import clsx from 'clsx';
import LoadingSpinner from './LoadingSpinner';
import { useDelayedEffect } from './hooks/delay';
import { useState } from 'react';

export default function Progress(): React.ReactElement {
  const [show, setShow] = useState(false);
  useDelayedEffect(
    () => {
      setShow(true);
    },
    100,
    []
  );

  return (
    <div
      className={clsx(
        'fixed z-50 inset-0 bg-opacity-50 bg-slate-200 flex flex-col justify-center items-center',
        show ? 'transition ease-out opacity-100' : 'opacity-0 pointer-events-none'
      )}
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
