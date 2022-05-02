import * as dragArea from '../../models/drag-area';
import * as label from '../../models/label';
import * as rect from '../../models/rect';
import type { TemplateImage } from '../template-image';
import type { Tool } from './tool';
import { useState } from 'react';

export interface Crop extends Tool<'crop'> {
  croppingRect: rect.Rect | null;
}

export interface Options {
  labels: label.Label[];
  changeLabels(labels: label.Label[]): void;
  image: TemplateImage;
  stageImageChange(): Promise<void>;
  commitChanges(): void;
}

export function useCrop({
  labels,
  changeLabels,
  image,
  stageImageChange,
  commitChanges,
}: Options): Crop {
  const [croppingArea, setCroppingArea] = useState<dragArea.DragArea | null>(null);

  return {
    name: 'crop',
    croppingRect: croppingArea && dragArea.rect(croppingArea),

    async onDrag(x, y, state) {
      x = Math.min(Math.max(0, x), image.width - 1);
      y = Math.min(Math.max(0, y), image.height - 1);
      switch (state) {
        case 'down': {
          setCroppingArea(dragArea.from(x, y));
          break;
        }
        case 'move': {
          setCroppingArea(croppingArea && dragArea.to(croppingArea, x, y));
          break;
        }
        case 'up': {
          if (!croppingArea) return;
          setCroppingArea(null);
          if (!image.ctx) return;
          const { x, y, w, h } = dragArea.rect(croppingArea);
          if (w == 0 || h == 0) return;

          changeLabels(
            labels
              .map(l => ({ ...l, x: l.x - x, y: l.y - y }))
              .filter(l => rect.overlaps(label.getRect(l), { x: 0, y: 0, w, h }))
          );
          const croppedImage = await createImageBitmap(image.ctx.canvas, x, y, w, h);
          image.resize(w, h);
          image.ctx.clearRect(0, 0, w, h);
          image.ctx.drawImage(croppedImage, 0, 0);
          await stageImageChange();
          commitChanges();
          break;
        }
      }
    },
  };
}
