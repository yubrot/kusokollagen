import CheckOption from './CheckOption';
import Confirm from './Confirm';
import Icon20, { IconName as Icon20Name } from './Icon20';
import Icon24, { IconName as Icon24Name } from './Icon24';
import LoadingSpinner from './LoadingSpinner';
import Pager from './Pager';
import { progress } from './Progress';
import SearchInputField from './SearchInputField';
import Slider from './Slider';
import { Severity, toast } from './Toast';
import UserIcon from './UserIcon';
import { useDetach } from './hooks/orphan';
import { useState } from 'react';

const icon20names: Icon20Name[] = [
  'ccw',
  'check',
  'copy',
  'crop',
  'cw',
  'edit-pencil',
  'eye',
  'eye-off',
  'github',
  'pin',
  'text-box',
  'trash',
  'x',
];

const icon24names: Icon24Name[] = [
  'arrow-down',
  'arrow-up',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'fekg',
  'home',
  'photograph',
  'plus-circle',
  'save',
  'search',
  'sparkles',
  'star',
  'trash',
  'upload',
  'user-circle',
];

export const Icons = () => (
  <div className="container-sm">
    <h1 className="heading lined">Icon20</h1>
    <div className="grid grid-cols-5 gap-6">
      {icon20names.map(name => (
        <div key={name} className="flex flex-col items-center space-y-2">
          <div className="whitespace-nowrap">{name}</div>
          <Icon20 name={name} className="w-5 h-5" />
        </div>
      ))}
    </div>

    <h1 className="heading lined">Icon24</h1>
    <div className="grid grid-cols-5 gap-6">
      {icon24names.map(name => (
        <div key={name} className="flex flex-col items-center space-y-2">
          <div className="whitespace-nowrap">{name}</div>
          <Icon24 name={name} className="w-8 h-8" />
        </div>
      ))}
    </div>

    <h1 className="heading lined">UserIcon</h1>
    <div className="flex space-x-2">
      <UserIcon className="w-12 h-12" imageUrl={null} />
      <UserIcon className="w-12 h-12" imageUrl="https://picsum.photos/64" />
    </div>
  </div>
);

export function Parts(): React.ReactElement {
  const [checkOptionA, setCheckOptionA] = useState(false);
  const [checkOptionB, setCheckOptionB] = useState(false);
  const [sliderA, setSliderA] = useState(10);
  const [pagerA, setPagerA] = useState(0);
  const [textFieldA, setTextFieldA] = useState('default');
  const [textFieldB, setTextFieldB] = useState('outlined');

  return (
    <div className="container-sm">
      <h1 className="heading lined">CheckOption</h1>
      <CheckOption
        label={undefined}
        checked={checkOptionA}
        onClick={() => setCheckOptionA(!checkOptionA)}
      />
      <CheckOption
        label="label"
        checked={checkOptionB}
        onClick={() => setCheckOptionB(!checkOptionB)}
      />

      <h1 className="heading lined">LoadingSpinner</h1>
      <LoadingSpinner className="w-12 h-12" />

      <h1 className="heading lined">Slider</h1>
      <Slider className="w-48" range={[0, 100, 1]} value={sliderA} onChange={setSliderA} />
      <Slider className="w-48" range={[0, 100, 1]} value={35} disabled />

      <h1 className="heading lined">Button</h1>
      <div className="flex flex-wrap items-center space-x-2">
        <button className="button my-1">Default</button>
        <button className="button my-1" disabled>
          Disabled
        </button>
        <button className="button primary-button my-1">Primary</button>
        <button className="button primary-button my-1" disabled>
          Disabled
        </button>
        <button className="button primary-button not my-1">Primary Not</button>
        <button className="button primary-button not my-1" disabled>
          Disabled
        </button>
        <button className="button icon-button">
          <Icon24 name="home" className="w-8 h-8" />
          Icon
        </button>
        <button className="button icon-button" disabled>
          <Icon24 name="home" className="w-8 h-8" />
          Disabled
        </button>
      </div>

      <h1 className="heading lined">TextField</h1>
      <div className="flex flex-wrap items-center space-x-2">
        <input
          type="text"
          className="text-field"
          value={textFieldA}
          onChange={ev => setTextFieldA(ev.target.value)}
        />
        <input
          type="text"
          className="text-field outlined"
          value={textFieldB}
          onChange={ev => setTextFieldB(ev.target.value)}
        />
        <SearchInputField placeholder="search" />
      </div>

      <h1 className="heading lined">Pager</h1>
      <Pager currentPage={pagerA} setCurrentPage={setPagerA} showPrev showNext>
        {['bg-white', 'bg-bluegray-100', 'bg-bluegray-200', 'bg-bluegray-300'].map(color => (
          <div className={`${color} px-16 py-8 text-sm`} key={color}>
            {color}
          </div>
        ))}
      </Pager>

      <h1 className="heading lined">Card</h1>
      <div className="card">Card</div>

      <h1 className="heading lined">Menu</h1>
      <div className="menu">
        <button className="button menu-item">Menu A</button>
        <button className="button menu-item">Menu BBB</button>
        <button className="button menu-item">Menu CCCCC</button>
      </div>
    </div>
  );
}

export function Orphans(): React.ReactElement {
  const detach = useDetach();
  const severities: Severity[] = ['error', 'warn', 'info', 'success'];

  return (
    <div className="container-sm">
      <h1 className="heading lined">Toast</h1>
      <div className="flex space-x-2 items-center">
        {severities.map(severity => (
          <button
            key={severity}
            className="button primary-button"
            onClick={() => detach(toast(severity, `${severity} toast`))}
          >
            {severity}
          </button>
        ))}
      </div>

      <h1 className="heading lined">Confirm</h1>
      <button
        className="button primary-button"
        onClick={() =>
          detach(resolve => (
            <Confirm
              title="Confirmation"
              resolve={resolve}
              acceptTitle="Delete"
              acceptIconName="trash"
              acceptClassName="text-red-600"
              declineTitle="Cancel"
              declineClassName="text-bluegray-500"
            >
              <div>
                Confirm children Confirm children Confirm children Confirm children Confirm children
              </div>
              <div>
                Confirm children Confirm children Confirm children Confirm children Confirm children
              </div>
            </Confirm>
          ))
        }
      >
        Show
      </button>

      <h1 className="heading lined">Progress</h1>
      <button
        className="button primary-button"
        onClick={() => detach(progress(new Promise(resolve => setTimeout(resolve, 2000))))}
      >
        Show
      </button>
    </div>
  );
}
