import clsx from 'clsx';
import Icon20, { IconName } from './Icon20';
import { useDelayedEffect } from './hooks/delay';
import { useState } from 'react';

export interface Props {
  title?: string;
  resolve: (value: boolean) => void;
  className?: string;
  acceptTitle?: string;
  acceptIconName?: IconName;
  acceptClassName?: string;
  declineTitle?: string;
  declineIconName?: IconName;
  declineClassName?: string;
  children?: React.ReactNode;
}

export default function Confirm({
  title,
  children,
  resolve,
  className,
  acceptTitle,
  acceptIconName,
  acceptClassName,
  declineTitle,
  declineIconName,
  declineClassName,
}: Props): React.ReactElement {
  const [show, setShow] = useState(false);
  useDelayedEffect(
    () => {
      setShow(true);
    },
    50,
    []
  );

  return (
    <div
      className={clsx(
        'fixed z-50 inset-0 bg-opacity-25 bg-slate-600 flex flex-col justify-around items-center',
        show ? 'transition ease-out opacity-100' : 'opacity-0 pointer-events-none'
      )}
      onClick={() => {
        resolve(false);
      }}
    >
      <div />
      <div
        className={clsx('max-w-lg bg-white shadow-xl flex flex-col', className)}
        onClick={ev => {
          ev.stopPropagation();
        }}
      >
        <div className="text-slate-500 text-xl font-bold flex items-center px-6 my-4">{title}</div>
        <div className="px-6">{children}</div>
        <div className="mt-6 py-3 px-6 border-t border-slate-300 bg-slate-100 flex items-center space-x-4">
          <button
            className={clsx(
              'button flex-grow space-x-2 py-2 px-4 flex justify-center items-center rounded-sm hover:bg-slate-200',
              acceptClassName
            )}
            onClick={() => {
              resolve(true);
            }}
          >
            {acceptIconName && <Icon20 name={acceptIconName} className="w-5 h-5" />}
            <div>{acceptTitle ?? 'Accept'}</div>
          </button>
          <button
            className={clsx(
              'button flex-grow space-x-2 py-2 px-4 flex justify-center items-center rounded-sm hover:bg-slate-200',
              declineClassName
            )}
            onClick={() => {
              resolve(false);
            }}
          >
            {declineIconName && <Icon20 name={declineIconName} className="w-5 h-5" />}
            <div>{declineTitle ?? 'Decline'}</div>
          </button>
        </div>
      </div>
      <div />
      <div />
    </div>
  );
}
