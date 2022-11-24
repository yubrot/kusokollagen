import type { Label } from '../models/label';
import type { Rect, RectMode } from '../models/rect';
import type { TemplateImage } from '../hooks/template-image';
import { MouseDragState, useMouse } from '../../basics/hooks/mouse';
import CroppingRect from './canvas-screen/CroppingRect';
import FloatingImage from './canvas-screen/FloatingImage';
import LabelPreview from './canvas-screen/LabelPreview';
import PenNib from './canvas-screen/PenNib';
import SelectionRect from './canvas-screen/SelectionRect';

export interface Props {
  min?: { width: number; height: number };
  max?: { width: number; height: number };
  canvas: TemplateImage;
  scale: {
    min: number;
    max: number;
    step: number;
    value: number;
    set?(scale: number): void;
    reset?(): void;
  };
  mouse?: {
    cursor?: string | null;
    onDrag?(x: number, y: number, state: MouseDragState): void;
    onMove?(x: number, y: number): void;
    onWheel?(delta: number): void;
  };
  crop?: {
    rect: Rect;
  } | null;
  selection?: {
    rect: Rect;
    color?: string;
    mode?: RectMode;
  } | null;
  pen?: {
    radius: number;
    color?: string | null;
    position?: [number, number] | null;
  } | null;
  overlayImages: {
    rect: Rect;
    src: string | Blob;
    mode?: RectMode;
  }[];
  text: {
    labels: Label[];
    showBorder?: boolean;
    selectedLabel?: number | null;
  };
  className?: string;
}

export default function CanvasScreen({
  min,
  max,
  canvas,
  scale,
  mouse,
  crop,
  selection,
  pen,
  overlayImages,
  text,
  className,
}: Props): React.ReactElement {
  function positionInImage(ev: MouseEvent): readonly [number, number] {
    if (!canvas.ctx) return [0, 0];
    const canvasRect = canvas.ctx.canvas.getBoundingClientRect();
    const px = Math.floor((ev.clientX - canvasRect.left) / scale.value);
    const py = Math.floor((ev.clientY - canvasRect.top) / scale.value);
    return [px, py] as const;
  }

  const screenMouse = useMouse({
    onDrag(ev, state) {
      const [x, y] = positionInImage(ev);
      mouse?.onDrag?.(x, y, state);
    },
    onMove(ev) {
      const [x, y] = positionInImage(ev);
      mouse?.onMove?.(x, y);
    },
    onWheel(ev) {
      ev.preventDefault();
      if (mouse?.onWheel && !ev.ctrlKey) {
        // mouse.onWheel processing takes precedence
        mouse.onWheel(ev.deltaY);
      } else {
        scale.set?.(
          ev.deltaY < 0
            ? Math.min(scale.value + scale.step, scale.max)
            : Math.max(scale.value - scale.step, scale.min)
        );
      }
    },
  });

  const canvasWidth = Math.floor(canvas.width * scale.value);
  const canvasHeight = Math.floor(canvas.height * scale.value);
  const invScale = 1 / scale.value;
  const containerWidth = clamp(canvas.width * 2, min?.width ?? 1, max?.width ?? Infinity);
  const containerHeight = clamp(canvas.height * 2, min?.height ?? 1, max?.height ?? Infinity);

  const canvasTop = Math.max(0, Math.floor((containerHeight - canvasHeight) / 2));
  const canvasLeft = Math.max(0, Math.floor((containerWidth - canvasWidth) / 2));
  const frameWidth = Math.max(canvasWidth, containerWidth);
  const frameHeight = Math.max(canvasHeight, containerHeight);

  return (
    <div
      ref={screenMouse.ref}
      className={`overflow-auto bg-bluegray-500 ${className ?? ''}`}
      style={{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        cursor: mouse?.cursor ?? 'default',
      }}
    >
      <div
        className="relative"
        style={{
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
        }}
      >
        <canvas
          ref={canvas.ref}
          className="absolute"
          style={{
            top: `${canvasTop}px`,
            left: `${canvasLeft}px`,
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            // reset for some browsers
            letterSpacing: '0',
            lineHeight: '1',
          }}
        />

        <div
          className="absolute pointer-events-none"
          style={{
            top: `${canvasTop}px`,
            left: `${canvasLeft}px`,
            width: `${canvas.width}px`,
            height: `${canvas.height}px`,
            transformOrigin: 'top left',
            transform: `scale(${scale.value})`,
          }}
        >
          {crop && <CroppingRect rect={crop.rect} invScale={invScale} />}
          {selection && (
            <SelectionRect
              color={selection.color}
              rect={selection.rect}
              mode={selection.mode}
              invScale={invScale}
            />
          )}
          {pen && (
            <PenNib
              radius={pen.radius}
              color={pen.color}
              x={pen.position?.[0] ?? canvas.width / 2}
              y={pen.position?.[1] ?? canvas.height / 2}
              invScale={invScale}
            />
          )}
          {overlayImages.map(({ rect, src, mode }, i) => (
            <FloatingImage key={i} rect={rect} src={src} mode={mode} />
          ))}
          {text.labels.map((label, i) => (
            <LabelPreview
              key={i}
              label={label}
              showBorder={text.showBorder}
              isSelected={i == text.selectedLabel}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}
