import ApplicationFooter from '../components/ApplicationFooter';
import LoadingSpinner from '../components/basics/LoadingSpinner';
import ApplicationHeader from './ApplicationHeader';
import { useSession } from 'next-auth/react';

export interface Props {
  children?: React.ReactNode;
}

export default function ApplicationFrame({ children }: Props): React.ReactElement {
  const { status } = useSession();
  return (
    <div className="absolute inset-0 flex flex-col">
      <ApplicationHeader />
      {status == 'loading' ? (
        <div className="flex-grow flex justify-center items-center">
          <LoadingSpinner className="w-24 h-24" />
        </div>
      ) : (
        <div className="flex-grow">{children}</div>
      )}
      <ApplicationFooter />
    </div>
  );
}
