import TemplateList, { myTemplates, publicTemplates } from '../application/TemplateList';
import ApplicationCover from '../components/ApplicationCover';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React from 'react';

const IndexPage: NextPage = () => {
  const { status } = useSession();

  if (status != 'authenticated') {
    return (
      <>
        <ApplicationCover />
        <TemplateList mode="pager" {...publicTemplates} />
      </>
    );
  }

  return (
    <>
      <TemplateList mode="pager" {...myTemplates} />
      <TemplateList mode="pager" {...publicTemplates} />
    </>
  );
};

export default IndexPage;
