export type CanvasSource = HTMLVideoElement | HTMLCanvasElement | ImageBitmap;

export function createCanvas(source: CanvasSource, copy = true): HTMLCanvasElement {
  if (source instanceof HTMLCanvasElement && !copy) return source;
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, 0, 0);
  return canvas;
}

export function getBlob(source: CanvasSource, mimetype: string): Promise<Blob> {
  const canvas = createCanvas(source, false);
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject('Failed to get blob');
      }
    }, mimetype)
  );
}

export function getPixelColor(ctx: CanvasRenderingContext2D, x: number, y: number): string {
  const p = ctx.getImageData(x, y, 1, 1).data;
  return '#' + rgbToHex(p[0], p[1], p[2]);
}

export function getApproximateSurroundingColor(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  radius: number
): string {
  const colors = sampleSurroundingColors(ctx, points, radius);
  const { r, g, b } = computeMedianColor(colors);
  return '#' + rgbToHex(r, g, b);
}

export function sampleSurroundingColors(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  radius: number
): { r: number; g: number; b: number }[] {
  let [l, r, t, b] = points.reduce(
    ([l, r, t, b], [x, y]) => [
      Math.min(l, x - radius),
      Math.max(r, x + radius),
      Math.min(t, y - radius),
      Math.max(b, y + radius),
    ],
    [Infinity, -Infinity, Infinity, -Infinity] as const
  );

  l = Math.max(0, l);
  r = Math.min(ctx.canvas.width - 1, r);
  t = Math.max(0, t);
  b = Math.min(ctx.canvas.height - 1, b);

  const imageData = ctx.getImageData(l, t, r - l + 1, b - t + 1);
  const colorAt = (x: number, y: number) => {
    x = Math.floor(x - l);
    y = Math.floor(y - t);
    if (x < 0 || imageData.width <= x || y < 0 || imageData.height <= y) return null;
    const r = imageData.data[y * imageData.width * 4 + x * 4];
    const g = imageData.data[y * imageData.width * 4 + x * 4 + 1];
    const b = imageData.data[y * imageData.width * 4 + x * 4 + 2];
    return { r, g, b };
  };

  // Center of the points
  const cx = l + (r - l) / 2;
  const cy = t + (b - t) / 2;

  const result: ReturnType<typeof sampleSurroundingColors> = [];

  for (let i = 0; i < 36; ++i) {
    const r = (i / 36) * Math.PI * 2;
    const rx = Math.cos(r);
    const ry = Math.sin(r);
    // Get the outermost point at this angle
    const [x, y] = maxBy(points, ([x, y]) => (x - cx) * rx + (y - cy) * ry);
    const color = colorAt(x + radius * rx, y + radius * ry);
    if (color) result.push(color);
  }

  return result;
}

export function computeMedianColor(colors: { r: number; g: number; b: number }[]): {
  r: number;
  g: number;
  b: number;
} {
  return {
    r: median(colors.map(rgb => rgb.r)),
    g: median(colors.map(rgb => rgb.g)),
    b: median(colors.map(rgb => rgb.b)),
  };
}

function maxBy<T>(arr: T[], f: (value: T) => number): T {
  let r = arr[0];
  let score = f(r);
  for (let i = 1; i < arr.length; ++i) {
    const s = f(arr[i]);
    if (score < s) {
      r = arr[i];
      score = s;
    }
  }
  return r;
}

function median(nums: number[]): number {
  nums.sort((a, b) => a - b);
  return nums[Math.floor(nums.length / 2)];
}

function rgbToHex(r: number, g: number, b: number): string {
  r = Math.min(r, 255);
  g = Math.min(g, 255);
  b = Math.min(b, 255);
  return ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).substring(1);
}
