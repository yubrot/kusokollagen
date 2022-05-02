import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import Component from '../components/UserSettings';
import { useDeleteUser } from './hooks/api';

export interface Props {}

export default function UserSettings(_: Props): React.ReactElement {
  const router = useRouter();
  const deleteUser = useDeleteUser();

  const deleteSignedInUser = useCallback(async () => {
    const session = await getSession();
    if (!session?.user) throw 'Session unavailable';

    const ok = await deleteUser(session.user.id);
    if (!ok) throw 'Something went wrong';

    // Since current (v4.3) next-auth does not support a way to enforce session validation, the page must be reloaded.
    // We believe that future next-auth will support user deletion functionality.
    router.reload();
  }, []);

  return <Component deleteUserAccount={deleteSignedInUser} />;
}
