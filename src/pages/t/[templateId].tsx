import TemplateEditor from '../../application/TemplateEditor';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const TemplatePage: NextPage = () => {
  const router = useRouter();
  const { templateId } = router.query;

  if (typeof templateId != 'string') return <div />;

  return (
    <div className="my-8">
      <TemplateEditor id={templateId} />
    </div>
  );
};

export default TemplatePage;
