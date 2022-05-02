import type { Rect } from '../../models/rect';

export interface Props {
  rect: Rect;
  invScale?: number;
}

export default function CroppingRect({ rect, invScale }: Props): React.ReactElement {
  const commonClassName = 'bg-black bg-opacity-50 absolute';
  const borderStyle = `${invScale ?? 1}px solid #ffffff`;
  return (
    <>
      <div
        className={`${commonClassName} inset-x-0 top-0`}
        style={{ borderBottom: borderStyle, height: `${rect.y}px` }}
      />
      <div
        className={`${commonClassName} inset-x-0 bottom-0`}
        style={{ borderTop: borderStyle, top: `${rect.y + rect.h}px` }}
      />
      <div
        className={`${commonClassName} inset-y-0 left-0`}
        style={{ borderRight: borderStyle, width: `${rect.x}px` }}
      />
      <div
        className={`${commonClassName} inset-y-0 right-0`}
        style={{ borderLeft: borderStyle, left: `${rect.x + rect.w}px` }}
      />
    </>
  );
}
