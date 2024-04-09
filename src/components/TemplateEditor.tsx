import type { Template } from './template-editor/models/template';
import * as template from './template-editor/models/template';
import { toast } from './basics/Toast';
import { useDetach } from './basics/hooks/orphan';
import { useWindowSize } from './basics/hooks/window-size';
import CanvasWindow from './template-editor/CanvasWindow';
import ControlPanel from './template-editor/ControlPanel';
import { usePalette } from './template-editor/hooks/palette';
import { useTemplateSaver } from './template-editor/hooks/template-saver';
import { useTemplateState } from './template-editor/hooks/template-state';
import { useToolBox } from './template-editor/hooks/tool/tool-box';
import { useCallback, useState } from 'react';
import { progress } from './basics/Progress';

export interface Props {
  source: Template;
  onSave?(diff: Partial<Template>): Promise<void>;
  onDelete?(): Promise<void>;
}

export default function TemplateEditor({ source, onSave, onDelete }: Props): React.ReactElement {
  const detach = useDetach();

  const palette = usePalette(() => source.labels.map(l => l.color));
  const state = useTemplateState(source);
  const { hasDifference, save } = useTemplateSaver(source, state.staged, onSave);
  const { currentTool, ...toolBox } = useToolBox({
    palette,
    ...state.current,
    changeLabels: state.changeLabels,
    stageImageChange: state.stageImageChange,
    commitChanges: state.commitChanges,
  });

  async function undo() {
    await currentTool.complete?.();
    state.undo();
  }

  async function redo() {
    await currentTool.complete?.();
    state.redo();
  }

  const saveWithErrorHandling = useCallback(async () => {
    await currentTool.complete?.();
    try {
      await detach(progress(save(false)));
    } catch (e) {
      detach(toast('error', `Failed to save template: ${e instanceof Error ? e.message : e}`));
    }
  }, [currentTool, detach, save]);

  const deleteWithErrorHandling = useCallback(async () => {
    try {
      await detach(progress(onDelete!()));
    } catch (e) {
      detach(toast('error', `Failed to delete template: ${e instanceof Error ? e.message : e}`));
    }
  }, [detach, onDelete]);

  async function renderAsImageWithErrorHandling(): Promise<void> {
    try {
      await template.render(state.staged);
    } catch (e) {
      detach(toast('error', `Failed to render image: ${e instanceof Error ? e.message : e}`));
    }
  }

  const window = useWindowSize();
  const min = { width: 500, height: 500 };
  const max = { width: window.width * 0.5, height: window.height * 0.7 };
  const defaultScale = () => calculateDefaultScale(state.current.image, max);
  const [scale, setScale] = useState(defaultScale);
  const resetScale = () => setScale(defaultScale());

  return (
    <div className="flex justify-center items-start space-x-2">
      <CanvasWindow
        name={state.current.name}
        onNameChange={state.changeName}
        canSave={!!onSave}
        onSave={saveWithErrorHandling}
        hasDifference={hasDifference}
        canDelete={!!onDelete}
        onDelete={deleteWithErrorHandling}
        canUndo={state.canUndo}
        canRedo={state.canRedo}
        onUndo={undo}
        onRedo={redo}
        screen={{
          min,
          max,
          canvas: state.current.image,
          scale: {
            min: 0.25,
            max: 2,
            step: 0.05,
            value: scale,
            set: setScale,
            reset: resetScale,
          },
          mouse: {
            cursor: currentTool.cursor,
            onDrag: currentTool.onDrag,
            onMove: currentTool.onMove,
            onWheel: currentTool.onWheel,
          },
          crop:
            currentTool.name == 'crop' && currentTool.croppingRect
              ? {
                  rect: currentTool.croppingRect,
                }
              : null,
          selection:
            currentTool.name == 'select' && currentTool.selectingRect
              ? {
                  rect: currentTool.selectingRect,
                  color: currentTool.selectingColor,
                  mode: currentTool.rectMode,
                }
              : null,
          pen:
            currentTool.name == 'pen'
              ? {
                  radius: currentTool.radius,
                  color: currentTool.previewColor,
                  position: currentTool.previewPosition,
                }
              : null,
          overlayImages:
            currentTool.name == 'select' && currentTool.floatingImage
              ? [
                  {
                    rect: currentTool.floatingImage.rect,
                    src: currentTool.floatingImage.blob,
                    mode: currentTool.rectMode,
                  },
                ]
              : [],
          text: {
            labels: state.current.labels,
            showBorder: currentTool.name == 'text',
            selectedLabel: toolBox.text.currentLabel,
          },
        }}
      />
      <ControlPanel
        color={{
          colors: palette.colors,
          selectedColor: palette.selectedColor,
          selectColor: palette.selectColor,
        }}
        tool={{
          selectedTool: currentTool.name,
          onToolSelect: toolBox.setCurrentTool,
          dropper: {
            previewColor: toolBox.dropper.previewColor,
          },
          pen: {
            selectedColor: palette.selectedColor,
            radius: toolBox.pen.radius,
            setRadius: radius => {
              toolBox.pen.setRadius(radius);
              toolBox.pen.resetPreviewPosition();
            },
            mode: toolBox.pen.mode,
            setMode: toolBox.pen.setMode,
          },
          select: {
            selectedColor: palette.selectedColor,
            mode: toolBox.select.mode,
            setMode: toolBox.select.setMode,
            rectMode: toolBox.select.rectMode,
            setRectMode: toolBox.select.setRectMode,
          },
          text: {
            labels: state.current.labels,
            setLabels: state.changeLabels,
            selectedLabel: toolBox.text.currentLabel,
            onLabelSelect: toolBox.text.setCurrentLabel,
            colors: palette.colors,
          },
          crop: {},
          contentMaxHeight: max.height - 50,
        }}
        onRenderAsImage={renderAsImageWithErrorHandling}
        className="flex-grow max-w-md"
      />
    </div>
  );
}

function calculateDefaultScale(
  image: { width: number; height: number },
  max: { width: number; height: number }
) {
  return Math.max(
    Math.min(1, (max.width / image.width) * 0.95, (max.height / image.height) * 0.95),
    0.25
  );
}
