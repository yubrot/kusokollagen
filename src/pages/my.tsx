import TemplateList, { myTemplates } from '../application/TemplateList';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import SignInRequiredCard from '../components/SignInRequiredCard';

const MyPage: NextPage = () => {
  const { status } = useSession();

  if (status != 'authenticated') return <SignInRequiredCard />;

  return <TemplateList mode="scroll" {...myTemplates} />;
};

export default MyPage;
