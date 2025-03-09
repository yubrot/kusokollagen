import clsx from 'clsx';
import { useMouse } from './hooks/mouse';

export interface Props {
  range: readonly [number, number, number];
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export default function Slider({
  range: [min, max, step],
  value,
  onChange,
  disabled,
  className,
}: Props): React.ReactElement {
  const mouse = useMouse({
    onDrag(ev, _, container) {
      if (disabled) return;
      const { left, width } = container.getBoundingClientRect();
      const r = Math.min(1, Math.max(0, (ev.clientX - left) / width));
      onChange?.(min + step * Math.round((r * (max - min)) / step));
    },
    onWheel(ev) {
      ev.preventDefault();
      onChange?.(Math.min(max, Math.max(min, value + (ev.deltaY > 0 ? -step : step))));
    },
  });

  const left = `${((value - min) / (max - min)) * 100}%`;

  return (
    <div className={className}>
      <div
        ref={mouse.ref}
        style={{ cursor: disabled ? 'default' : 'ew-resize' }}
        className="py-3 relative flex items-center"
      >
        <div
          style={{ height: '6px' }}
          className={clsx(
            'flex-grow relative rounded-sm shadow-sm',
            disabled ? 'bg-slate-200' : 'bg-gradient-to-r from-slate-100 to-slate-400'
          )}
        >
          <div
            style={{ left, width: '12px', height: '18px', marginLeft: '-6px', marginTop: '-6px' }}
            className={clsx(
              'absolute box-border border bg-gradient-to-b from-white to-slate-100 rounded-sm shadow-md',
              disabled ? 'border-slate-200' : 'border-slate-400'
            )}
          />
        </div>
      </div>
    </div>
  );
}
