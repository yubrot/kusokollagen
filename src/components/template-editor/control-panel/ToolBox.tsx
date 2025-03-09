import { ToolName } from '../hooks/tool/tool-box';
import CropOptions, { Props as CropProps } from './CropOptions';
import DropperOptions, { Props as DropperProps } from './DropperOptions';
import PenOptions, { Props as PenProps } from './PenOptions';
import SelectOptions, { Props as SelectProps } from './SelectOptions';
import TextOptions, { Props as TextProps } from './TextOptions';
import ToolTabBar from './ToolTabBar';

export interface Props {
  selectedTool: ToolName;
  onToolSelect?: (name: ToolName) => void;
  dropper: Omit<DropperProps, 'className'>;
  pen: Omit<PenProps, 'className'>;
  select: Omit<SelectProps, 'className'>;
  text: Omit<TextProps, 'className'>;
  crop: Omit<CropProps, 'className'>;
  contentMaxHeight?: number;
  className?: string;
}

export default function ToolBox({
  selectedTool,
  onToolSelect,
  dropper,
  pen,
  select,
  text,
  crop,
  contentMaxHeight,
  className,
}: Props): React.ReactElement {
  return (
    <div className={className}>
      <ToolTabBar selected={selectedTool} onSelect={onToolSelect} />
      <div className="p-4 overflow-auto" style={{ maxHeight: contentMaxHeight }}>
        {selectedTool == 'dropper' && <DropperOptions {...dropper} />}
        {selectedTool == 'pen' && <PenOptions {...pen} />}
        {selectedTool == 'select' && <SelectOptions {...select} />}
        {selectedTool == 'text' && <TextOptions {...text} />}
        {selectedTool == 'crop' && <CropOptions {...crop} />}
      </div>
    </div>
  );
}
