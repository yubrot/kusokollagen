import Icon24, { IconName } from '../common/Icon24';

export interface Props {
  name: string;
  icon: IconName;
  onClick?(): void;
  onCreate?(): void;
}

export default function TemplateListHeader({
  name,
  icon,
  onClick,
  onCreate,
}: Props): React.ReactElement {
  return (
    <div className="flex justify-between items-center">
      <button
        className="button heading space-x-1 transition hover:text-blue-500"
        onClick={onClick}
        disabled={!onClick}
      >
        <Icon24 name={icon} className="w-6 h-6" />
        <div>{name}</div>
      </button>
      {onCreate && (
        <button className="button primary-button text-base mx-4" onClick={onCreate}>
          <Icon24 name="plus-circle" className="w-6 h-6" />
          <div>Add</div>
        </button>
      )}
    </div>
  );
}
