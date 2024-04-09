import { CanvasSource, createCanvas, getBlob } from './canvas-util';
import { Label, render as renderLabel } from './label';

export interface Template<Image = ImageBitmap> {
  name: string;
  labels: Label[];
  image: Image;
}

export function difference<T>(a: Template<T>, b: Template<T>): Partial<Template<T>> {
  const diff: Partial<Template<T>> = {};
  if (b.name != a.name) diff.name = b.name;
  if (b.labels != a.labels) diff.labels = b.labels;
  if (b.image != a.image) diff.image = b.image;
  return diff;
}

export async function render<T extends CanvasSource>(template: Template<T>): Promise<void> {
  const win = open('about:blank');
  if (!win) return;

  const tmpCanvas = createCanvas(template.image);
  const tmpCanvasCtx = tmpCanvas.getContext('2d');
  if (!tmpCanvasCtx) return;
  for (const l of template.labels) renderLabel(tmpCanvasCtx, l);

  const blob = await getBlob(tmpCanvas, 'image/jpeg');
  win.location.href = URL.createObjectURL(blob);
}
