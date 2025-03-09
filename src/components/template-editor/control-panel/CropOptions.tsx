import clsx from 'clsx';

export interface Props {
  className?: string;
}

export default function CropOptions({ className }: Props): React.ReactElement {
  return <div className={clsx('text-sm', className)}>Crop the image by drag &amp; drop</div>;
}
