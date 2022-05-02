import Icon24 from './Icon24';
import { Children } from 'react';

export interface Props {
  currentPage: number;
  setCurrentPage?(page: number): void;
  showPrev?: boolean;
  showNext?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function Pager({
  currentPage,
  setCurrentPage,
  showPrev,
  showNext,
  className,
  children,
}: Props): React.ReactElement {
  const elems = Children.toArray(children).filter(Boolean);
  currentPage = currentPage < 0 ? 0 : elems.length <= currentPage ? elems.length - 1 : currentPage;
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <div
        className="top-0 left-0 ease-in-out flex items-stretch h-full"
        style={{
          width: `${elems.length}00%`,
          transition: 'margin-left 0.3s',
          marginLeft: `-${currentPage}00%`,
        }}
      >
        {elems.map((elem, i) => (
          <div key={i} className="w-full h-full box-content">
            {elem}
          </div>
        ))}
      </div>
      {setCurrentPage && showPrev && currentPage != 0 && (
        <button
          className="button absolute top-0 h-full w-20 flex justify-start items-center text-bluegray-400 opacity-50 hover:opacity-100 hover:text-blue-300"
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <Icon24 name="chevron-left" className="w-12 h-12" />
        </button>
      )}
      {setCurrentPage && showNext && currentPage != elems.length - 1 && (
        <button
          className="button absolute top-0 right-0 h-full w-20 flex justify-end items-center text-bluegray-400 opacity-50 hover:opacity-100 hover:text-blue-300"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <Icon24 name="chevron-right" className="w-12 h-12" />
        </button>
      )}
    </div>
  );
}
