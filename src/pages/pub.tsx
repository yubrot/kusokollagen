import TemplateList, { publicTemplates } from '../application/TemplateList';
import type { NextPage } from 'next';

const PubPage: NextPage = () => <TemplateList mode="scroll" {...publicTemplates} />;

export default PubPage;
