/**
 * Hooks to handle file drop and file paste events.
 * @module
 */

import { useState, useEffect, useRef, DependencyList } from 'react';

export interface FileDrop {
  ref: (node: HTMLElement | null) => void;
  isDropping: boolean;
}

export function useFileDrop(onDrop?: (files: FileList) => void): FileDrop {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [isDropping, setIsDropping] = useState(false);
  const drop = useRef(onDrop);
  drop.current = onDrop;
  const hasDrop = !!onDrop;

  useEffect(() => {
    if (!container || !hasDrop) return;

    const handleDragOver = (ev: DragEvent) => {
      ev.preventDefault();
      if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'copy';
      setIsDropping(true);
    };

    const handleDragLeave = () => {
      setIsDropping(false);
    };

    const handleDrop = (ev: DragEvent) => {
      ev.preventDefault();
      setIsDropping(false);
      if (ev.dataTransfer) drop.current?.(ev.dataTransfer.files);
    };

    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('dragleave', handleDragLeave);
    container.addEventListener('drop', handleDrop);
    return () => {
      container.removeEventListener('dragover', handleDragOver);
      container.removeEventListener('dragleave', handleDragLeave);
      container.removeEventListener('drop', handleDrop);
    };
  }, [container, hasDrop]);

  return { ref: setContainer, isDropping };
}

export function useFilePaste(onPaste: (file: File) => void, deps: DependencyList): void {
  useEffect(() => {
    const handlePaste = (ev: ClipboardEvent) => {
      const items = ev.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        const file = item.getAsFile();
        if (file) onPaste(file);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
