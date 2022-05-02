import { useCallback, useState } from 'react';

const max = 18;

export interface Palette {
  colors: string[];
  selectedColor: string;
  selectColor(color: string): void;
}

export function usePalette(initialColors: () => string[]): Palette {
  const [colors, setColors] = useState(() => defaultColors(initialColors()));
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const selectColor = useCallback((color: string) => {
    setColors(colors =>
      colors.find(c => c == color)
        ? colors
        : [color, ...colors.filter(c => c != color).slice(0, max)]
    );
    setSelectedColor(color);
  }, []);

  return {
    colors,
    selectedColor,
    selectColor,
  };
}

function defaultColors(initialColors: string[]): string[] {
  const set = new Set<string>();
  return [...initialColors, ...'0123456789abcdef'.split('').map(c => `#${c}${c}${c}`)]
    .filter(color => !set.has(color) && set.add(color))
    .slice(0, max);
}
