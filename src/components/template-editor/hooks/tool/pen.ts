import { getApproximateSurroundingColor } from '../../models/canvas-util';
import type { TemplateImage } from '../template-image';
import type { Palette } from '../palette';
import type { Tool } from './tool';
import { useCallback, useRef, useState } from 'react';

export interface Pen extends Tool<'pen'> {
  radius: number;
  setRadius: (size: number) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  previewColor: string;
  previewPosition: [number, number] | null;
  resetPreviewPosition: () => void;
}

export type Mode = 'surrounding-color' | 'selected-color';

export interface Options {
  palette: Palette;
  image: TemplateImage;
  stageImageChange: () => Promise<void>;
  commitChanges: () => void;
}

export function usePen({ image, stageImageChange, commitChanges, palette }: Options): Pen {
  const [radius, setRadius] = useState(10);
  const [mode, setMode] = useState<Mode>('surrounding-color');

  const strokePoints = useRef<[number, number][]>([]).current;
  const strokeColor = mode == 'selected-color' ? palette.selectedColor : '#f0f';

  const [previewPosition, setPreviewPosition] = useState<[number, number] | null>(null);
  const resetPreviewPosition = useCallback(() => {
    setPreviewPosition(null);
  }, []);

  return {
    name: 'pen',
    radius,
    setRadius,
    mode,
    setMode,
    previewColor: strokeColor,
    previewPosition,
    resetPreviewPosition,
    cursor: 'none',

    async onDrag(x, y, state) {
      if (state == 'down') strokePoints.splice(0);
      if (!image.ctx) return;
      const intermediateRadius = radius - (mode == 'surrounding-color' ? 1 : 0);
      strokeIntermediate(image.ctx, strokePoints, x, y, intermediateRadius, strokeColor);

      if (state == 'up') {
        if (mode == 'surrounding-color') strokeComplete(image.ctx, strokePoints, radius);
        await stageImageChange();
        commitChanges();
      }
    },
    onMove(x, y) {
      setPreviewPosition([x, y]);
    },
    onWheel(deltaY) {
      setRadius(r => (deltaY < 0 ? Math.min(r + 1, 50) : Math.max(r - 1, 1)));
    },
  };
}

function strokeIntermediate(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  x: number,
  y: number,
  radius: number,
  color: string
): void {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = radius * 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(...(points.slice(-1)[0] || [x, y]));
  ctx.lineTo(x, y);
  ctx.stroke();
  points.push([x, y]);
}

function strokeComplete(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  radius: number
): void {
  ctx.lineWidth = radius * 2;
  ctx.strokeStyle = getApproximateSurroundingColor(ctx, points, radius);
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const p of points.slice(1)) ctx.lineTo(...p);
  ctx.stroke();
}
