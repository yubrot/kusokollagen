import LoadingSpinner from './common/LoadingSpinner';
import Pager from './common/Pager';
import { useResponsive } from './common/hooks/responsive';
import TemplateListEmpty from './template-list/TemplateListEmpty';
import TemplateListHeader, { Props as HeaderProps } from './template-list/TemplateListHeader';
import TemplatePanel from './template-list/TemplatePanel';
import { useEffect, useState } from 'react';

export type Props = {
  items: { name: string; image?: string | null }[];
  areItemsDepleted?: boolean;
  onRequireItems?(count: number): void;
  onItemSelect?(index: number): void;
} & HeaderProps;

export default function PagerTemplateList({
  items,
  areItemsDepleted,
  onRequireItems,
  onItemSelect,
  ...headerProps
}: Props): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(0);
  const responsive = useResponsive();
  const pageSize = responsive.xxl ? 5 : responsive.lg ? 4 : responsive.md ? 3 : 2;
  const requiredItems = (currentPage + 2) * pageSize;

  useEffect(() => {
    items.length <= requiredItems && onRequireItems?.(requiredItems);
  }, [items.length, requiredItems, onRequireItems]);

  const pages = chunk(items, pageSize);

  return (
    <div className="container-lg my-4 px-2">
      <TemplateListHeader {...headerProps} />

      <Pager currentPage={currentPage} setCurrentPage={setCurrentPage} showPrev showNext>
        {pages.map((pageItems, i) => (
          <div
            className="mx-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2"
            key={i}
          >
            {pageItems.map(({ name, image }, j) => (
              <TemplatePanel
                key={j}
                name={name}
                src={image}
                onClick={() => onItemSelect?.(i * pageSize + j)}
                className="h-64"
              />
            ))}
          </div>
        ))}
        {!areItemsDepleted && (
          <div className="h-64 flex justify-center items-center">
            <LoadingSpinner className="w-16 h-16 text-bluegray-500" />
          </div>
        )}
        {areItemsDepleted && items.length == 0 && <TemplateListEmpty className="h-64" />}
      </Pager>
    </div>
  );
}

function chunk<T>(array: T[], size: number): T[][] {
  return array.reduce(
    (acc, _, i) => (i % size ? acc : [...acc, array.slice(i, i + size)]),
    [] as T[][]
  );
}
