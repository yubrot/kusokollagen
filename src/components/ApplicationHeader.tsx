import LoadingSpinner from './basics/LoadingSpinner';

export interface Props {
  isLoading?: boolean;
}

export default function ApplicationHeader({ isLoading }: Props): React.ReactElement {
  return (
    <div className="relative z-30 bg-gradient-to-r from-slate-800 to-slate-700 text-slate-200 shadow-md">
      <header className="cc relative flex justify-between items-center space-x-2 px-8 py-2">
        <h1 className="flex-1 flex items-center space-x-2 text-lg font-bold">Kusokollagen</h1>
        <div className="w-6 h-6">{isLoading && <LoadingSpinner />}</div>
      </header>
    </div>
  );
}
