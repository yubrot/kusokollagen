import type { NextPage } from 'next';
import { useSession, signIn, signOut } from 'next-auth/react';

const Home: NextPage = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="m-4 flex space-x-2 items-center">
        <p>Signed in as {session.user?.email}</p>
        <button className="button primary-button" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }
  return (
    <div className="m-4 flex space-x-2 items-center">
      <p>Not signed in </p>
      <button className="button primary-button" onClick={() => signIn()}>
        Sign in
      </button>
    </div>
  );
};

export default Home;
