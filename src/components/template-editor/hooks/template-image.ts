import { useState, useCallback } from 'react';

export interface TemplateImage {
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  resize(width: number, height: number): void;
  ref(node: HTMLCanvasElement | null): void;
}

export function useTemplateImage(initialSize?: { width: number; height: number }): TemplateImage {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [width, setWidth] = useState(initialSize?.width ?? 0);
  const [height, setHeight] = useState(initialSize?.height ?? 0);

  const ref = useCallback(
    (node: HTMLCanvasElement | null) => {
      if (ctx || !node) return;
      node.width = width;
      node.height = height;
      setCtx(node.getContext('2d'));
    },
    [ctx, height, width]
  );

  const resize = useCallback(
    (width: number, height: number) => {
      if (ctx) {
        ctx.canvas.width = width;
        ctx.canvas.height = height;
      }
      setWidth(width);
      setHeight(height);
    },
    [ctx]
  );

  return { ctx, width, height, ref, resize };
}
