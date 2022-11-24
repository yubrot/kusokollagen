import Icon20 from './Icon20';
import { useDeferredEffect } from './hooks/defer';
import React, { useState } from 'react';

export type Severity = 'error' | 'warn' | 'info' | 'success';

export interface Props {
  severity: Severity;
  message: string;
  resolve(): void;
}

const itemClassNames: { [K in Severity]: string } = {
  error: 'text-red-800 border-2 border-red-400',
  warn: 'text-yellow-800 border-2 border-yellow-400',
  info: 'text-blue-800 border-2 border-blue-500',
  success: 'text-green-800 border-2 border-green-500',
};

export default function Toast({ severity, message, resolve }: Props): React.ReactElement {
  const [show, setShow] = useState(false);
  useDeferredEffect(() => setShow(true), 50, []);
  useDeferredEffect(resolve, 8000, [resolve]);

  const transition = show
    ? 'translate-y-0 scale-100 ease-out opacity-100'
    : '-translate-y-16 scale-95 opacity-0';

  return (
    <div className="fixed z-40 top-0 inset-x-0 flex justify-center">
      <button
        className={`button absolute mt-20 p-3 space-x-4 flex items-center bg-white rounded-lg shadow-xl transform ${transition} ${itemClassNames[severity]}`}
        onClick={resolve}
      >
        <div>{message}</div>
        <Icon20 name="x" className="w-5 h-5" />
      </button>
    </div>
  );
}

export function toast(severity: Severity, message: string) {
  return function OrphanToast(resolve: (_: void) => void): React.ReactElement {
    return <Toast severity={severity} message={message} resolve={resolve} />;
  };
}
