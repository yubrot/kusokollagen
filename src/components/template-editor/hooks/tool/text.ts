import * as label from '../../models/label';
import * as rect from '../../models/rect';
import type { Palette } from '../palette';
import type { Tool } from './tool';
import { useState } from 'react';

export interface Text extends Tool<'text'> {
  currentLabel: number | null;
  setCurrentLabel: (index: number | null) => void;
}

export interface Options {
  palette: Palette;
  labels: label.Label[];
  changeLabels: (labels: label.Label[]) => void;
}

export function useText({ labels, changeLabels, palette }: Options): Text {
  const [currentLabel, setCurrentLabel] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);

  return {
    name: 'text',
    currentLabel,
    setCurrentLabel,

    cursor,
    onMove(x, y) {
      const isOnLabel = labels.some(l => rect.contains(x, y, label.getRect(l)));
      setCursor(isOnLabel ? 'move' : null);
    },
    onDrag(x, y, state) {
      switch (state) {
        case 'down': {
          const targetLabels = labels
            .map((l, i) => [l, i] as const)
            .filter(([l]) => rect.contains(x, y, label.getRect(l)));

          if (targetLabels.length == 0) {
            const newLabel = {
              ...label.init,
              ...labels[labels.length - 1],
              text: '',
              color: palette.selectedColor,
              x,
              y,
            };
            changeLabels([...labels, newLabel]);
            setCurrentLabel(labels.length);
            break;
          }

          const [, i] = targetLabels.find(([, i]) => i == currentLabel) ?? targetLabels[0];
          setCurrentLabel(i);
          setDragPosition({ x, y });
          break;
        }
        case 'move': {
          if (currentLabel == null || !labels[currentLabel] || !dragPosition) break;
          const label = labels[currentLabel];
          const movedLabel = {
            ...label,
            x: label.x + x - dragPosition.x,
            y: label.y + y - dragPosition.y,
          };
          changeLabels(labels.map((l, i) => (i == currentLabel ? movedLabel : l)));
          setDragPosition({ x, y });
          break;
        }
        case 'up': {
          setDragPosition(null);
          break;
        }
      }
    },
  };
}
