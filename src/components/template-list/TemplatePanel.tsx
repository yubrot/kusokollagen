import Icon24 from '../basics/Icon24';
import Image from '../basics/Image';

export interface Props {
  name: string;
  src?: string | null;
  onClick?(): void;
  className?: string;
}

export default function TemplatePanel({
  name,
  src,
  onClick,
  className,
}: Props): React.ReactElement {
  return (
    <button className={`button relative group shadow-md ${className ?? ''}`} onClick={onClick}>
      <div className="absolute inset-0 bg-gradient-to-br from-bluegray-100 to-bluegray-500 flex justify-center items-center">
        <Image
          alt="template"
          src={src}
          className="w-full h-full object-contain"
          loadingClassName="w-16 h-16 text-white"
        />
      </div>
      <div className="absolute top-0 inset-x-0 text-left transition text-white text-sm font-bold pt-2 px-3 pb-1 flex bg-opacity-75 bg-bluegray-600 group-hover:bg-opacity-75 group-hover:bg-blue-600">
        <div className="flex-grow truncate pr-2">{name}</div>
        <Icon24 name="star" className="hidden flex-none w-5 h-5 text-yellow-400" />
      </div>
    </button>
  );
}
