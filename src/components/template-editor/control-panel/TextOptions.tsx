import clsx from 'clsx';
import { Label } from '../models/label';
import Icon20 from '../../basics/Icon20';
import Slider from '../../basics/Slider';
import { useDelayedValue } from '../../basics/hooks/delay';
import ColorPalette from './ColorPalette';
import { useEffect, useRef, useState } from 'react';

export interface Props {
  labels: Label[];
  setLabels?: (labels: Label[]) => void;
  selectedLabel?: number | null;
  onLabelSelect?: (index: number | null) => void;
  colors: string[];
  className?: string;
}

export default function TextOptions({
  labels,
  setLabels,
  selectedLabel,
  onLabelSelect,
  colors,
  className,
}: Props): React.ReactElement {
  return (
    <div className={clsx('relative z-10 space-y-3', className)}>
      {labels.length == 0 && <div className="text-sm px-3">Click the image to add label</div>}
      {labels.map((label, index) => (
        <LabelOptions
          key={index}
          isSelected={selectedLabel == index}
          label={label}
          onSelect={() => onLabelSelect?.(index)}
          onUpdate={newLabel => setLabels?.(labels.map((l, i) => (i == index ? newLabel : l)))}
          onDelete={() => setLabels?.(labels.filter((_, i) => i != index))}
          colors={colors}
        />
      ))}
    </div>
  );
}

export interface LabelOptionsProps {
  isSelected: boolean;
  label: Label;
  onSelect: () => void;
  onUpdate: (label: Label) => void;
  onDelete: () => void;
  colors: string[];
}

export function LabelOptions({
  isSelected,
  label,
  onSelect,
  onUpdate,
  onDelete,
  colors,
}: LabelOptionsProps): React.ReactElement {
  const [showDropdown, setShowDropdown] = useState(false);
  const actualShowDropdown = useDelayedValue(showDropdown, 0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSelected) inputRef.current?.focus();
  }, [isSelected]);

  return (
    <div
      className={clsx(
        'relative flex flex-col p-3 border-l-4',
        isSelected ? 'border-blue-300' : 'border-slate-300'
      )}
      onClick={onSelect}
    >
      <div className="flex space-x-2 items-center">
        <input
          ref={inputRef}
          type="text"
          value={label.text}
          onChange={ev => {
            onUpdate({ ...label, text: ev.target.value });
          }}
          className="flex-grow bg-transparent border-b border-slate-300 text-slate-600 text-sm focus:outline-none"
        />
        <button className="button w-5 h-5 text-slate-400 hover:text-red-400" onClick={onDelete}>
          <Icon20 name="x" />
        </button>
      </div>

      <div className="mt-2 flex space-x-2 items-center text-xs">
        <div>Size</div>
        <Slider
          value={label.size}
          range={[10, 100, 1]}
          onChange={size => {
            onUpdate({ ...label, size });
          }}
          className="flex-grow"
        />
        <div className="w-6">{label.size}</div>
        <button
          className={clsx('button w-6 h-6 border-2 border-gray-200', showDropdown && 'overlay')}
          style={{ backgroundColor: label.color }}
          onClick={() => {
            setShowDropdown(value => !value);
          }}
        />

        <button
          className={clsx(
            'button py-1 px-2 rounded-sm border border-transparent hover:border-blue-300',
            label.bold && 'bg-blue-100'
          )}
          onClick={() => {
            onUpdate({ ...label, bold: !label.bold });
          }}
        >
          Bold
        </button>
        <button
          className={clsx(
            'button py-1 px-2 rounded-sm border border-transparent hover:border-blue-300',
            label.vertical && 'bg-blue-100'
          )}
          onClick={() => {
            onUpdate({ ...label, vertical: !label.vertical });
          }}
        >
          Vertical
        </button>
      </div>

      <div
        className={clsx(
          'absolute z-20 inset-x-0 bottom-0 -mx-2 rounded-md shadow-lg border border-slate-300 bg-slate-100 p-2',
          showDropdown
            ? actualShowDropdown
              ? 'transition ease-out opacity-100'
              : 'opacity-0 pointer-events-none'
            : actualShowDropdown
              ? 'opacity-100 pointer-events-none'
              : 'transition ease-in opacity-0 pointer-events-none'
        )}
      >
        <ColorPalette
          colors={colors}
          selectedColor={label.color}
          selectColor={color => {
            onUpdate({ ...label, color });
            setShowDropdown(false);
          }}
        />
      </div>
    </div>
  );
}
