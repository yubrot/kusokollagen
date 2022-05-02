import Icon24 from '../../common/Icon24';
import Slider from '../../common/Slider';

export interface Props {
  scale: number;
  scaleRange: readonly [number, number, number];
  setScale?(scale: number): void;
  resetScale?(): void;
  className?: string;
}

export default function ZoomSlider({
  scale,
  scaleRange,
  setScale,
  resetScale,
  className,
}: Props): React.ReactElement {
  return (
    <div className={`flex flex-col ${className ?? ''}`}>
      <Slider value={scale} range={scaleRange} onChange={setScale} className="flex-grow" />
      <button
        className="button text-xs self-end py-1 px-2 mb-1 hover:bg-gray-200"
        onClick={resetScale}
      >
        <Icon24 name="search" className="inline-block w-4 h-4" />
        {Math.floor(scale * 100)}%
      </button>
    </div>
  );
}
