import UserSettings from '../application/UserSettings';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SettingsPage: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status == 'unauthenticated') router.push('/');
  }, [router, status]);

  if (status != 'authenticated') return <div />;

  return <UserSettings />;
};

export default SettingsPage;
