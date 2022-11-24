import Icon20 from '../../basics/Icon20';

export interface Props {
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?(): void;
  onRedo?(): void;
  className?: string;
}

export default function UndoRedo({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  className,
}: Props): React.ReactElement {
  return (
    <div className={`flex items-strech ${className ?? ''}`}>
      <button className="button icon-button" disabled={!canUndo} onClick={onUndo}>
        <Icon20 name="ccw" className="w-5 h-5" />
        <div>Undo</div>
      </button>
      <button className="button icon-button p-1" disabled={!canRedo} onClick={onRedo}>
        <Icon20 name="cw" className="w-5 h-5" />
        <div>Redo</div>
      </button>
    </div>
  );
}
