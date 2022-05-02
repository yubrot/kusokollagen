import type { Rect, RectMode } from '../../models/rect';

export interface Props {
  rect: Rect;
  color?: string;
  mode?: RectMode;
  invScale?: number;
}

export default function SelectionRect({ color, rect, mode, invScale }: Props): React.ReactElement {
  return (
    <div
      className="absolute"
      style={{
        border: `${1.5 * (invScale ?? 1)}px solid ${color ?? '#000'}`,
        borderRadius: mode == 'ellipse' ? `${rect.w}px / ${rect.h}px` : '0',
        width: `${rect.w}px`,
        height: `${rect.h}px`,
        top: `${rect.y}px`,
        left: `${rect.x}px`,
        boxShadow: '0 0 1px #ffffff',
      }}
    />
  );
}
