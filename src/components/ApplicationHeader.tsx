import Icon24 from './basics/Icon24';
import LoadingSpinner from './basics/LoadingSpinner';
import SearchInputField from './basics/SearchInputField';
import UserIcon from './basics/UserIcon';
import { useDeferredValue } from './basics/hooks/defer';
import { useState } from 'react';

export interface Props {
  isLoading?: boolean;
  home?(): void;
  search?(text: string): void;
  userImageUrl?: string | null;
  userMenu?: UserMenuItem[];
}

export interface UserMenuItem {
  text: string;
  onClick?(): void;
}

export function userMenuItem(text: string, onClick?: () => void): UserMenuItem {
  return { text, onClick };
}

export default function ApplicationHeader({
  isLoading,
  home,
  search,
  userImageUrl,
  userMenu,
}: Props): React.ReactElement {
  const [showDropdown, setShowDropdown] = useState(false);
  const actualShowDropdown = useDeferredValue(showDropdown, 0);

  return (
    <div className="relative z-30 bg-gradient-to-r from-bluegray-800 to-bluegray-700 text-bluegray-200 shadow-md">
      <header className="cc relative flex justify-between items-center space-x-2 px-8 py-2">
        <h1 className="flex-1 flex items-center space-x-2">
          <button className="button font-bold text-lg hover:text-white" onClick={home}>
            Kusokollagen
          </button>
          <div className="w-6 h-6">{isLoading && <LoadingSpinner />}</div>
        </h1>

        <SearchInputField
          placeholder="Search templates..."
          className="text-lg flex-1"
          onSubmit={search}
        />

        <div className="relative flex-1">
          <div className="flex justify-end">
            <button
              className={`button hover:text-white flex items-center space-x-2 ${
                showDropdown ? 'overlay' : ''
              }`}
              onClick={() => setShowDropdown(value => !value)}
            >
              <UserIcon imageUrl={userImageUrl} className="w-10 h-10" />
              <Icon24 name="chevron-down" className="w-5 h-5" />
            </button>
          </div>

          <div
            className={`absolute z-20 right-0 mt-4 w-56 menu fade-${showDropdown}-${actualShowDropdown}`}
          >
            {userMenu &&
              userMenu.map(({ text, onClick }) => (
                <button
                  key={text}
                  className="button menu-item"
                  onClick={() => {
                    onClick?.();
                    setShowDropdown(false);
                  }}
                >
                  {text}
                </button>
              ))}
          </div>
        </div>
      </header>
    </div>
  );
}
