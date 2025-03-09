import clsx from 'clsx';
import Icon20, { IconName } from '../../basics/Icon20';
import type { ToolName } from '../hooks/tool/tool-box';

export interface Props {
  selected: ToolName;
  onSelect?: (name: ToolName) => void;
  className?: string;
}

export default function ToolTabBar({ selected, onSelect, className }: Props): React.ReactElement {
  return (
    <div
      className={clsx(
        'flex justify-center items-strech pt-1 border-b border-slate-300 bg-slate-100',
        className
      )}
    >
      {toolList.map(({ name, icon, label }) => (
        <button
          key={name}
          className={clsx(
            'button icon-button rouded-t-sm',
            selected == name
              ? 'text-slate-800 border-t border-l border-r bg-white border-slate-300 transform translate-y-px'
              : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
          )}
          onClick={() => onSelect?.(name)}
        >
          <Icon20 name={icon} className="w-5 h-5" />
          <div>{label}</div>
        </button>
      ))}
    </div>
  );
}

const toolList: { name: ToolName; icon: IconName; label: string }[] = [
  { name: 'dropper', icon: 'pin', label: 'Dropper' },
  { name: 'pen', icon: 'edit-pencil', label: 'Pen' },
  { name: 'select', icon: 'copy', label: 'Select' },
  { name: 'text', icon: 'text-box', label: 'Text' },
  { name: 'crop', icon: 'crop', label: 'Crop' },
];
