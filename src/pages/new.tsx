import SignInRequiredCard from '../components/SignInRequiredCard';
import TemplateCreationFlow from '../application/TemplateCreationFlow';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';

const NewPage: NextPage = () => {
  const { status } = useSession();

  if (status != 'authenticated') return <SignInRequiredCard />;

  return <TemplateCreationFlow />;
};

export default NewPage;
