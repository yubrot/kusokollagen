import TemplateList, { searchTemplates } from '../application/TemplateList';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TemplateFilter } from '../graphql/request-sdk';

const SearchPage: NextPage = () => {
  const router = useRouter();
  let { q } = router.query;
  if (Array.isArray(q)) q = q.join(' ');
  const filter = interpretSearchQuery(q);

  return <TemplateList mode="scroll" {...searchTemplates} filter={filter} />;
};

export default SearchPage;

function interpretSearchQuery(q: string | undefined): TemplateFilter {
  if (!q) return {};
  const filter: TemplateFilter = {};
  const nameParts = [];

  for (const r of q.matchAll(/"[^"]+"|[^ ]+/g)) {
    const part = r.shift()!;

    switch (part) {
      case 'owned:true':
        filter.owned = true;
        break;
      case 'published:true':
        filter.published = true;
        break;
      default:
        nameParts.push(part.match(/^[-+]/) ? part : '+' + part);
        break;
    }
  }

  if (nameParts.length != 0) filter.name = nameParts.join(' ');

  return filter;
}
