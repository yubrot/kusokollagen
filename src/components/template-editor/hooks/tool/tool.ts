import type { MouseDragState } from '../../../basics/hooks/mouse';

export interface Tool<Name> {
  name: Name;
  cursor?: string | null;
  onDrag?(x: number, y: number, state: MouseDragState): void;
  onMove?(x: number, y: number): void;
  onWheel?(deltaY: number): void;
  complete?(): Promise<void>;
}
