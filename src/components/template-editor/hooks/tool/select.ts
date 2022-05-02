import { getApproximateSurroundingColor, getBlob } from '../../models/canvas-util';
import * as dragArea from '../../models/drag-area';
import * as rect from '../../models/rect';
import type { TemplateImage } from '../template-image';
import type { Palette } from '../palette';
import type { Tool } from './tool';
import { useCallback, useState } from 'react';

export interface Select extends Tool<'select'> {
  mode: Mode;
  setMode(mode: Mode): void;
  rectMode: rect.RectMode;
  setRectMode(mode: rect.RectMode): void;

  selectingColor: string;
  selectingRect: rect.Rect | null;
  floatingImage: FloatingImage | null;
}

export type Mode = 'move' | 'fill-with-surrounding-color' | 'fill-with-selected-color';

export interface Options {
  palette: Palette;
  image: TemplateImage;
  stageImageChange(): Promise<void>;
  commitChanges(): void;
}

export function useSelect({ palette, image, stageImageChange, commitChanges }: Options): Select {
  const [mode, setMode] = useState<Mode>('move');
  const [rectMode, setRectMode] = useState<rect.RectMode>('rectangle');

  const [selectingArea, setSelectingArea] = useState<dragArea.DragArea | null>(null);
  const [floatingImage, setFloatingImage] = useState<FloatingImage | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);

  const imageCtx = image.ctx;
  const commitFloatingImage = useCallback(async () => {
    if (!floatingImage || !imageCtx) return;
    setFloatingImage(null);
    await floatingImage.render(imageCtx);
    await stageImageChange();
    commitChanges();
  }, [imageCtx, commitChanges, floatingImage, stageImageChange]);

  const setModeAfterCommit = useCallback(
    async (mode: Mode) => {
      await commitFloatingImage();
      setMode(mode);
    },
    [commitFloatingImage]
  );

  const setRectModeAfterCommit = useCallback(
    async (rectMode: rect.RectMode) => {
      await commitFloatingImage();
      setRectMode(rectMode);
    },
    [commitFloatingImage]
  );

  const selectingColor =
    mode == 'move' ? '#999' : mode == 'fill-with-selected-color' ? palette.selectedColor : '#909';

  return {
    name: 'select',
    mode,
    setMode: setModeAfterCommit,
    rectMode,
    setRectMode: setRectModeAfterCommit,
    selectingColor,
    selectingRect: selectingArea && dragArea.rect(selectingArea),
    floatingImage,
    cursor,

    onMove(x, y) {
      setCursor(floatingImage && rect.contains(x, y, floatingImage.rect) ? 'move' : null);
    },
    async onDrag(x, y, state) {
      if (floatingImage) {
        switch (state) {
          case 'down':
            if (!rect.contains(x, y, floatingImage.rect)) {
              commitFloatingImage();
              break;
            }
            setDragPosition({ x, y });
            return;
          case 'move':
            if (!dragPosition) return;
            setFloatingImage(floatingImage.move(dragPosition, { x, y }));
            setDragPosition({ x, y });
            return;
          case 'up':
            setDragPosition(null);
            return;
        }
      }

      switch (state) {
        case 'down':
          setSelectingArea(dragArea.from(x, y));
          break;
        case 'move':
          if (!selectingArea) break;
          setSelectingArea(dragArea.to(selectingArea, x, y));
          break;
        case 'up':
          if (!selectingArea) break;
          setSelectingArea(null);
          if (!imageCtx) return;
          const selectedRect = dragArea.rect(selectingArea);

          if (mode == 'move') {
            const floatingImage = await FloatingImage.fromCanvas(imageCtx, selectedRect, rectMode);
            if (!floatingImage) return;
            setFloatingImage(floatingImage);
          }

          imageCtx.fillStyle =
            mode == 'fill-with-selected-color'
              ? palette.selectedColor
              : getApproximateSurroundingColor(imageCtx, rect.points(rectMode, selectedRect), 0);
          rect.fill(imageCtx, rectMode, selectedRect);

          if (mode != 'move') {
            await stageImageChange();
            commitChanges();
          }
          break;
      }
    },
    complete: commitFloatingImage,
  };
}

export class FloatingImage {
  constructor(readonly blob: Blob, readonly rect: rect.Rect) {}

  async render(ctx: CanvasRenderingContext2D): Promise<void> {
    const imageBitmap = await createImageBitmap(this.blob);
    ctx.drawImage(imageBitmap, this.rect.x, this.rect.y);
  }

  move(from: { x: number; y: number }, to: { x: number; y: number }): FloatingImage {
    return new FloatingImage(this.blob, {
      ...this.rect,
      x: this.rect.x + to.x - from.x,
      y: this.rect.y + to.y - from.y,
    });
  }

  static async fromCanvas(
    ctx: CanvasRenderingContext2D,
    selectedRect: rect.Rect,
    rectMode: rect.RectMode
  ): Promise<FloatingImage | null> {
    const sourceData = rect.getImageData(ctx, rectMode, selectedRect);
    if (!sourceData) return null;
    const source = await createImageBitmap(sourceData);
    const blob = await getBlob(source, 'image/png');
    return new FloatingImage(blob, selectedRect);
  }
}
