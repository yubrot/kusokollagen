import clsx from 'clsx';
import Icon20 from '../../basics/Icon20';

export interface Props {
  onDelete?: () => void;
  className?: string;
}

export default function DeleteButton({ onDelete, className }: Props): React.ReactElement {
  return (
    <button className={clsx('button icon-button text-red-500', className)} onClick={onDelete}>
      <Icon20 name="trash" className="w-5 h-5" />
      <div>Delete</div>
    </button>
  );
}
