import type { Rect, RectMode } from '../../models/rect';
import Image from '../../../common/Image';

export interface Props {
  rect: Rect;
  src: string | Blob;
  mode?: RectMode;
  invScale?: number;
}

export default function FloatingImage({ rect, src, mode, invScale }: Props): React.ReactElement {
  return (
    <div
      className="absolute flex justify-center items-center"
      style={{
        boxSizing: 'content-box',
        border: `${2 * (invScale ?? 1)}px dashed #aaaaaa`,
        borderRadius: mode == 'ellipse' ? `${rect.w}px / ${rect.h}px` : '0',
        width: `${rect.w}px`,
        height: `${rect.h}px`,
        top: `${rect.y - 2 * (invScale ?? 1)}px`,
        left: `${rect.x - 2 * (invScale ?? 1)}px`,
      }}
    >
      <Image alt="floating-image" src={src} className="w-full h-full" />
    </div>
  );
}
