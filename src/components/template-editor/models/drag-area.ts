import type { Rect } from './rect';

export interface DragArea {
  sx: number;
  sy: number;
  ex: number;
  ey: number;
}

export function from(x: number, y: number): DragArea {
  return { sx: x, sy: y, ex: x, ey: y };
}

export function to(a: DragArea, x: number, y: number): DragArea {
  return { ...a, ex: x, ey: y };
}

export function rect({ sx, sy, ex, ey }: DragArea): Rect {
  const x = Math.min(sx, ex);
  const y = Math.min(sy, ey);
  const w = Math.abs(ex - sx);
  const h = Math.abs(ey - sy);
  return { x, y, w, h };
}
