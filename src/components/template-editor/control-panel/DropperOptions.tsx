import clsx from 'clsx';

export interface Props {
  previewColor: string;
  className?: string;
}

export default function DropperOptions({ previewColor, className }: Props): React.ReactElement {
  return (
    <div className={clsx('text-sm flex items-center space-x-2', className)}>
      <div className="flex-grow">Click the image to get the color</div>
      <div style={{ backgroundColor: previewColor }} className="w-6 h-6 border-2 border-gray-200" />
    </div>
  );
}
