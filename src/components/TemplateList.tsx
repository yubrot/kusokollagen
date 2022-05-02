import PagerTemplateList, { Props as PagerProps } from '../components/PagerTemplateList';
import ScrollTemplateList, { Props as ScrollProps } from '../components/ScrollTemplateList';

export type Props = { mode: 'pager' | 'scroll' } & PagerProps & ScrollProps;

export default function TemplateList({ mode, ...props }: Props): React.ReactElement {
  return mode == 'pager' ? <PagerTemplateList {...props} /> : <ScrollTemplateList {...props} />;
}
