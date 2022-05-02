import type { Accessibility } from './models/template';
import Icon24 from '../common/Icon24';
import { useDetach } from '../common/hooks/orphan';
import AccessibilityButton from './canvas-window/AccessibilityButton';
import CanvasScreen, { Props as ScreenProps } from './canvas-window/CanvasScreen';
import ConfirmDeleteTemplate from './canvas-window/ConfirmDeleteTemplate';
import ConfirmMakePublic from './canvas-window/ConfirmMakePublic';
import DeleteButton from './canvas-window/DeleteButton';
import UndoRedo from './canvas-window/UndoRedo';
import ZoomSlider from './canvas-window/ZoomSlider';
import { useCallback } from 'react';

export interface Props {
  name: string;
  onNameChange?(name: string): void;

  canSave?: boolean;
  onSave?(): void;
  hasDifference?: boolean;

  canDelete?: boolean;
  onDelete?(): void;

  canMakePublic?: boolean;
  accessibility: Accessibility;
  setAccessibility?(accessibility: Accessibility): void;

  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?(): void;
  onRedo?(): void;

  screen: Omit<ScreenProps, 'className'>;
  className?: string;
}

export default function CanvasWindow({
  name,
  onNameChange,

  canSave,
  onSave,
  hasDifference,

  canDelete,
  onDelete,

  canMakePublic,
  accessibility,
  setAccessibility,

  canUndo,
  canRedo,
  onUndo,
  onRedo,

  screen,
  className,
}: Props): React.ReactElement {
  const detach = useDetach();

  const toggleAccessibility = useCallback(async () => {
    switch (accessibility) {
      case 'PUBLIC':
        setAccessibility?.('PRIVATE');
        break;
      case 'PRIVATE':
        const sure = await detach(resolve => <ConfirmMakePublic resolve={resolve} />);
        if (sure) setAccessibility?.('PUBLIC');
        break;
    }
  }, [accessibility, detach, setAccessibility]);

  const deleteWithConfirmation = useCallback(async () => {
    const sure = await detach(resolve => <ConfirmDeleteTemplate resolve={resolve} />);
    if (sure) onDelete?.();
  }, [detach, onDelete]);

  return (
    <div className={`bg-white border-4 border-bluegray-300 ${className ?? ''}`}>
      <div className="font-bold flex justify-between items-stretch border-b border-bluegray-300">
        <input
          type="text"
          className="self-center flex-grow w-0 label py-1 px-2 my-2 mx-4 bg-transparent border-b border-bluegray-400 transition hover:border-bluegray-500 focus:border-blue-500 focus:outline-none"
          value={name}
          onChange={e => onNameChange?.(e.target.value)}
        />
        {canSave && (
          <button
            className="button icon-button"
            disabled={name == '' || !(hasDifference ?? true)}
            onClick={onSave}
          >
            <Icon24 name="save" className="w-6 h-6" />
            <div>Save</div>
          </button>
        )}
        <button className="hidden button icon-button">
          <Icon24 name="star" className="w-6 h-6" />
          <div>Star</div>
        </button>
      </div>

      <CanvasScreen {...screen} />

      <div className="flex items-stretch">
        {canDelete && <DeleteButton onDelete={deleteWithConfirmation} />}
        <AccessibilityButton
          value={accessibility}
          onClick={toggleAccessibility}
          disabled={!canMakePublic}
        />
        <ZoomSlider
          scale={screen.scale.value}
          scaleRange={[screen.scale.min, screen.scale.max, screen.scale.step]}
          setScale={screen.scale.set}
          resetScale={screen.scale.reset}
          className="flex-grow mx-2"
        />
        <UndoRedo canUndo={canUndo} canRedo={canRedo} onUndo={onUndo} onRedo={onRedo} />
      </div>
    </div>
  );
}
