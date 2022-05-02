import Icon24 from '../common/Icon24';
import ColorPalette, { Props as ColorProps } from './control-panel/ColorPalette';
import ToolBox, { Props as ToolProps } from './control-panel/ToolBox';

export interface Props {
  color: Omit<ColorProps, 'className'>;
  tool: Omit<ToolProps, 'className'>;
  onRenderAsImage?(): void;
  className?: string;
}

export default function ControlPanel({
  color,
  tool,
  onRenderAsImage,
  className,
}: Props): React.ReactElement {
  return (
    <div
      className={`bg-white border border-bluegray-200 shadow-md rounded-md py-3 ${className ?? ''}`}
    >
      <ColorPalette {...color} className="p-4 border-b border-bluegray-200" />
      <ToolBox {...tool} className="border-b border-bluegray-200" />
      <div className="p-4 flex items-center justify-around space-x-2">
        <button className="button primary-button" onClick={onRenderAsImage}>
          <Icon24 name="photograph" className="w-6 h-6" />
          <div className="text-sm">Render as image</div>
        </button>
      </div>
    </div>
  );
}
