import { Crop, Options as CropOptions, useCrop } from './crop';
import { Dropper, Options as DropperOptions, useDropper } from './dropper';
import { Pen, Options as PenOptions, usePen } from './pen';
import { Select, Options as SelectOptions, useSelect } from './select';
import { Text, Options as TextOptions, useText } from './text';
import { useCallback, useState } from 'react';

export interface ToolBox {
  dropper: Dropper;
  pen: Pen;
  select: Select;
  text: Text;
  crop: Crop;
  currentTool: Tool;
  setCurrentTool: (name: ToolName) => Promise<void>;
}

export type ToolName = Tool['name'];

export type Tool = Dropper | Pen | Select | Text | Crop;

export interface Options
  extends DropperOptions,
    PenOptions,
    SelectOptions,
    TextOptions,
    CropOptions {}

export function useToolBox(options: Options): ToolBox {
  const dropper = useDropper(options);
  const crop = useCrop(options);
  const pen = usePen(options);
  const select = useSelect(options);
  const text = useText(options);
  const tools = { dropper, pen, select, text, crop };

  const [toolName, setToolName] = useState<ToolName>('text');
  const currentTool = tools[toolName];
  const setCurrentTool = useCallback(
    async (name: ToolName) => {
      await currentTool.complete?.();
      setToolName(name);
    },
    [currentTool]
  );

  return { ...tools, currentTool, setCurrentTool };
}
