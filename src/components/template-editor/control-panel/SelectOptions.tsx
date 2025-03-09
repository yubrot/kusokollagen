import type { RectMode } from '../models/rect';
import type { Mode } from '../hooks/tool/select';
import CheckOption from '../../basics/CheckOption';
import clsx from 'clsx';

export interface Props {
  selectedColor: string;
  mode: Mode;
  setMode?: (mode: Mode) => void;
  rectMode: RectMode;
  setRectMode?: (mode: RectMode) => void;
  className?: string;
}

export default function SelectOptions({
  selectedColor,
  mode,
  setMode,
  rectMode,
  setRectMode,
  className,
}: Props): React.ReactElement {
  const rectModeClassName = (selected: boolean) =>
    'button w-16 h-16 flex flex-col justify-center items-center space-y-1 rounded-sm border border-transparent hover:border-blue-300' +
    (selected ? ' bg-blue-100' : '');

  return (
    <div className={clsx('flex flex-col items-strech space-y-1', className)}>
      <div className="flex justify-center space-x-1">
        <button
          className={rectModeClassName(rectMode == 'rectangle')}
          onClick={() => setRectMode?.('rectangle')}
        >
          <div className="w-5 h-5 border-2 border-slate-500" />
          <div className="text-xs">Rectangle</div>
        </button>
        <button
          className={rectModeClassName(rectMode == 'ellipse')}
          onClick={() => setRectMode?.('ellipse')}
        >
          <div className="w-5 h-5 border-2 border-slate-500 rounded-full" />
          <div className="text-xs">Ellipse</div>
        </button>
      </div>

      <CheckOption label="Move" checked={mode == 'move'} onClick={() => setMode?.('move')} />
      <CheckOption
        label="Fill with the surrounding color"
        checked={mode == 'fill-with-surrounding-color'}
        onClick={() => setMode?.('fill-with-surrounding-color')}
      />
      <div className="flex items-center space-x-2">
        <CheckOption
          label="Fill with the selected color"
          checked={mode == 'fill-with-selected-color'}
          onClick={() => setMode?.('fill-with-selected-color')}
          className="flex-grow"
        />
        <div
          style={{ backgroundColor: selectedColor }}
          className="w-6 h-6 border-2 border-gray-200"
        />
      </div>
    </div>
  );
}
