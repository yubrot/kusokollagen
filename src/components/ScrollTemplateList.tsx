import LoadingSpinner from './common/LoadingSpinner';
import { useResponsive } from './common/hooks/responsive';
import TemplateListEmpty from './template-list/TemplateListEmpty';
import TemplateListHeader, { Props as HeaderProps } from './template-list/TemplateListHeader';
import TemplatePanel from './template-list/TemplatePanel';
import { useEffect } from 'react';

export type Props = {
  container?: HTMLElement | null;
  items: { name: string; image?: string | null }[];
  areItemsDepleted?: boolean;
  onRequireItems?(count: number): void;
  onItemSelect?(index: number): void;
} & HeaderProps;

export default function ScrollTemplateList({
  container,
  items,
  areItemsDepleted,
  onRequireItems,
  onItemSelect,
  ...headerProps
}: Props): React.ReactElement {
  const responsive = useResponsive();
  const pageSize = responsive.xxl ? 5 : responsive.lg ? 4 : responsive.md ? 3 : 2;

  useEffect(() => {
    const c = container === undefined ? document.documentElement : container;
    if (!c) return;

    const ec = c == document.documentElement ? window : c;
    const check = () =>
      c.scrollHeight - c.clientHeight * 1.5 < c.scrollTop &&
      onRequireItems?.(items.length + pageSize * 3);

    check();
    ec.addEventListener('scroll', check);
    return () => ec.removeEventListener('scroll', check);
  }, [container, pageSize, items.length, onRequireItems]);

  return (
    <div className="container-lg my-4 px-2">
      <TemplateListHeader {...headerProps} />

      <div className="m-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2">
        {items.map(({ name, image }, i) => (
          <TemplatePanel
            key={i}
            name={name}
            src={image}
            onClick={() => onItemSelect?.(i)}
            className="h-64"
          />
        ))}

        {!areItemsDepleted && (
          <div className="h-64 flex justify-center items-center">
            <LoadingSpinner className="w-16 h-16 text-bluegray-500" />
          </div>
        )}
      </div>

      {areItemsDepleted && items.length == 0 && <TemplateListEmpty className="h-64" />}
    </div>
  );
}
