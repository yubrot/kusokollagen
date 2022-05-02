/* eslint-disable @next/next/no-img-element */
import Icon24 from './Icon24';

export interface Props {
  imageUrl?: string | null;
  className?: string;
}

export default function UserIcon({ imageUrl, className }: Props): React.ReactElement {
  return (
    <div className={className}>
      {imageUrl ? (
        <img src={imageUrl} alt="user" className="rounded-full w-full h-full" />
      ) : (
        <Icon24 name="user-circle" className="rounded-full" />
      )}
    </div>
  );
}
