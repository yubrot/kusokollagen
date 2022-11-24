import Component, { userMenuItem } from '../components/ApplicationHeader';
import { progress } from '../components/basics/Progress';
import { useDetach } from '../components/basics/hooks/orphan';
import { useLoadingState } from './hooks/loading-state';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export interface Props {}

export default function ApplicationHeader(_: Props): React.ReactElement {
  const isLoading = useLoadingState();
  const router = useRouter();
  const session = useSession();
  const detach = useDetach();
  const userMenu = useMemo(() => {
    switch (session.status) {
      case 'authenticated':
        return [
          userMenuItem('Settings', () => router.push('/settings')),
          userMenuItem('Sign-out', () => detach(progress(signOut()))),
        ];
      case 'unauthenticated':
        return [userMenuItem('Sign-in', () => detach(progress(signIn())))];
      default:
        return [];
    }
  }, [detach, router, session.status]);

  return (
    <Component
      isLoading={isLoading}
      home={() => router.push('/')}
      search={text => router.push(`/search?q=${text}`)}
      userImageUrl={session.data?.user?.image}
      userMenu={userMenu}
    />
  );
}
