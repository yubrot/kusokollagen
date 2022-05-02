export interface Props {
  radius: number;
  x: number;
  y: number;
  color?: string | null;
  invScale?: number;
}

export default function PenNib({ radius, x, y, color, invScale }: Props): React.ReactElement {
  return (
    <div
      className="absolute rounded-full"
      style={{
        border: `${1.5 * (invScale ?? 1)}px solid ${color ?? '#000'}`,
        width: `${2 * radius}px`,
        height: `${2 * radius}px`,
        top: `${y - radius}px`,
        left: `${x - radius}px`,
        boxShadow: '0 0 1px #fff',
      }}
    />
  );
}
