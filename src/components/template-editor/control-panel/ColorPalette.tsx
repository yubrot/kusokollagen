export interface Props {
  colors: string[];
  selectedColor: string;
  selectColor?(color: string): void;
  className?: string;
}

export default function ColorPalette({
  colors,
  selectedColor,
  selectColor,
  className,
}: Props): React.ReactElement {
  return (
    <div className={`flex ${className ?? ''}`}>
      {colors.map(color => (
        <button
          key={color}
          onClick={() => selectColor?.(color)}
          style={{ backgroundColor: color }}
          className={`button flex-grow h-6 border-4 ${
            color == selectedColor ? 'border-gray-400' : 'border-gray-100 hover:border-gray-300'
          }`}
        />
      ))}
    </div>
  );
}
