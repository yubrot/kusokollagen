export interface Props {
  className?: string;
}

export default function TemplateListEmpty({ className }: Props): React.ReactElement {
  return (
    <div className={`flex justify-center items-center ${className ?? ''}`}>
      <div className="text-sm text-bluegray-500">There are no templates</div>
    </div>
  );
}
