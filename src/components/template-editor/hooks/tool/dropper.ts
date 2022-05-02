import { getPixelColor } from '../../models/canvas-util';
import type { TemplateImage } from '../template-image';
import type { Palette } from '../palette';
import type { Tool } from './tool';
import { useState } from 'react';

export interface Dropper extends Tool<'dropper'> {
  previewColor: string;
}

export interface Options {
  image: TemplateImage;
  palette: Palette;
}

export function useDropper({ image, palette }: Options): Dropper {
  const [previewColor, setPreviewColor] = useState<string>('#ffffff');

  return {
    name: 'dropper',
    previewColor,

    onDrag(x, y, state) {
      if (x < 0 || image.width <= x || y < 0 || image.height <= y) return;
      if (state == 'up') palette.selectColor(previewColor);
    },
    onMove(x, y) {
      if (!image.ctx) return;
      if (x < 0 || image.width <= x || y < 0 || image.height <= y) return;
      setPreviewColor(getPixelColor(image.ctx, x, y));
    },
  };
}
