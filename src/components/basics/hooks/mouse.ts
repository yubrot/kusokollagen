/**
 * Hooks to handle mouse events.
 * @module
 */

import { useEffect, useRef, useState } from 'react';

export interface Mouse {
  container: HTMLElement | null;
  ref: (node: HTMLElement | null) => void;
}

export type MouseDragState = 'down' | 'move' | 'up';

export interface Options {
  onDrag?: (ev: MouseEvent, state: MouseDragState, container: HTMLElement) => void;
  onMove?: (ev: MouseEvent, container: HTMLElement) => void;
  onWheel?: (ev: WheelEvent, container: HTMLElement) => void;
}

export function useMouse({ onDrag, onMove, onWheel }: Options): Mouse {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useMouseDrag(container, onDrag);
  useMouseMove(container, onMove);
  useMouseWheel(container, onWheel);
  return { container, ref: setContainer };
}

function useMouseDrag(container: HTMLElement | null, onDrag: Options['onDrag']): void {
  const drag = useRef(onDrag);
  drag.current = onDrag;
  const hasDrag = !!onDrag;

  useEffect(() => {
    if (!container || !hasDrag) return;

    const handleDown = (ev: MouseEvent) => {
      ev.preventDefault();
      if (!isOnClientRect(ev, container)) return; // on scrollbar
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
      drag.current?.(ev, 'down', container);
    };

    const handleMove = (ev: MouseEvent) => drag.current?.(ev, 'move', container);

    const handleUp = (ev: MouseEvent) => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      drag.current?.(ev, 'up', container);
    };

    container.addEventListener('mousedown', handleDown);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      container.removeEventListener('mousedown', handleDown);
    };
  }, [container, hasDrag]);
}

function useMouseMove(container: HTMLElement | null, onMove: Options['onMove']): void {
  const move = useRef(onMove);
  move.current = onMove;
  const hasMove = !!onMove;

  useEffect(() => {
    if (!container || !hasMove) return;

    const handleMove = (ev: MouseEvent) => move.current?.(ev, container);

    container.addEventListener('mousemove', handleMove);

    return () => {
      container.removeEventListener('mousemove', handleMove);
    };
  }, [container, hasMove]);
}

function useMouseWheel(container: HTMLElement | null, onWheel: Options['onWheel']): void {
  const wheel = useRef(onWheel);
  wheel.current = onWheel;
  const hasWheel = !!onWheel;

  useEffect(() => {
    if (!container || !hasWheel) return;

    const handleWheel = (ev: WheelEvent) => wheel.current?.(ev, container);

    container.addEventListener('wheel', handleWheel);

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [container, hasWheel]);
}

function isOnClientRect(ev: MouseEvent, container: HTMLElement): boolean {
  const rect = container.getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;
  return 0 <= x && x < container.clientWidth && 0 <= y && y < container.clientHeight;
}
