import Component, { Props as ComponentProps } from '../components/TemplateList';
import { useRouter } from 'next/router';
import { TemplateFilter, useTemplates } from './hooks/api';
import { useState } from 'react';
import type { IconName } from '../components/common/Icon24';

export interface Props {
  mode: ComponentProps['mode'];
  name: string;
  icon: IconName;
  page?: string;
  addPage?: string;
  filter: TemplateFilter;
}

export default function TemplateList({
  mode,
  name,
  icon,
  page,
  addPage,
  filter,
}: Props): React.ReactElement {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const { data, atEnd } = useTemplates(count, filter);

  const props: ComponentProps = {
    mode,
    name,
    icon,
    onClick: page ? () => router.push(page) : undefined,
    onCreate: addPage ? () => router.push(addPage) : undefined,
    items: data || [],
    areItemsDepleted: atEnd,
    onRequireItems: setCount,
    onItemSelect: index => router.push(`/t/${data![index].id}`),
  };

  return <Component {...props} />;
}

function preset<T extends Partial<Props>>(t: T): T {
  return t;
}

export const myTemplates = preset({
  name: 'My templates',
  icon: 'home',
  page: '/my',
  addPage: '/new',
  filter: { owned: true },
});

export const publicTemplates = preset({
  name: 'Public templates',
  icon: 'sparkles',
  page: '/pub',
  filter: { published: true },
});

export const searchTemplates = preset({
  name: 'Search templates',
  icon: 'search',
});
