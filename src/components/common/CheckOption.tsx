import Icon20 from './Icon20';

export interface Props {
  label?: string;
  checked?: boolean;
  onClick?(): void;
  className?: string;
}

export default function CheckOption({
  label,
  checked,
  onClick,
  className,
}: Props): React.ReactElement {
  return (
    <button
      className={`group button text-sm flex items-center space-x-2 p-1 ${className || ''}`}
      onClick={onClick}
    >
      <div
        style={{ width: '16px', height: '16px' }}
        className={`relative rounded-md border-2 overflow-visible transition ${
          checked
            ? 'bg-blue-100 border-blue-300'
            : 'bg-white border-bluegray-300 group-hover:border-blue-300'
        }`}
      >
        {checked && (
          <Icon20
            name="check"
            className="absolute w-5 h-5 transform -translate-x-1 -translate-y-1 text-blue-400"
          />
        )}
      </div>
      {label && <div className="flex-grow text-left">{label}</div>}
    </button>
  );
}
