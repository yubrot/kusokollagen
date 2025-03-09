import clsx from 'clsx';
import CheckOption from '../../basics/CheckOption';
import Slider from '../../basics/Slider';
import type { Mode } from '../hooks/tool/pen';

export interface Props {
  selectedColor: string;
  radius: number;
  setRadius?: (value: number) => void;
  mode: Mode;
  setMode?: (mode: Mode) => void;
  className?: string;
}

export default function PenOptions({
  selectedColor,
  radius,
  setRadius,
  mode,
  setMode,
  className,
}: Props): React.ReactElement {
  return (
    <div className={clsx('flex flex-col items-strech', className)}>
      <div className="flex items-center space-x-2 text-sm">
        <div>Size</div>
        <Slider value={radius} range={[1, 50, 1]} onChange={setRadius} className="flex-grow px-2" />
        <div className="w-6 text-center">{radius}</div>
      </div>

      <div className="mt-4 space-y-1">
        <CheckOption
          label="Paint with the surrounding color"
          checked={mode == 'surrounding-color'}
          onClick={() => setMode?.('surrounding-color')}
        />
        <div className="flex items-center space-x-2">
          <CheckOption
            label="Paint with the selected color"
            checked={mode == 'selected-color'}
            onClick={() => setMode?.('selected-color')}
            className="flex-grow"
          />
          <div
            style={{ backgroundColor: selectedColor }}
            className="w-6 h-6 border-2 border-gray-200"
          />
        </div>
      </div>
    </div>
  );
}
