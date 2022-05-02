import type { Accessibility } from '../models/template';
import Icon20 from '../../common/Icon20';

export interface Props {
  value: Accessibility;
  onClick?(): void;
  disabled?: boolean;
  className?: string;
}

export default function AccessibilityButton({
  value,
  onClick,
  disabled,
  className,
}: Props): React.ReactElement {
  const colorClassName = value == 'PUBLIC' ? 'text-green-500' : 'text-purple-300';
  return (
    <button
      className={`button icon-button ${colorClassName} ${className ?? ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon20 name={value == 'PUBLIC' ? 'eye' : 'eye-off'} className="w-5 h-5" />
      <div>{value == 'PUBLIC' ? 'Public' : 'Private'}</div>
    </button>
  );
}
