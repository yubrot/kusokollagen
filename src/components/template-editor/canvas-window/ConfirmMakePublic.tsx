import Confirm from '../../common/Confirm';
import Icon24 from '../../common/Icon24';

export interface Props {
  resolve(value: boolean): void;
}

export default function ConfirmMakePublic({ resolve }: Props): React.ReactElement {
  return (
    <Confirm
      title="PUBLISHING TEMPLATE"
      acceptTitle="Make public"
      acceptIconName="eye"
      acceptClassName="text-green-600"
      declineTitle="Leave private"
      declineIconName="eye-off"
      declineClassName="text-purple-400"
      resolve={resolve}
    >
      <p className="mb-3">
        Even if the template is private, the template can be accessed{' '}
        <strong className="font-bold">by anyone who knows the URL</strong>.
      </p>
      <p>By making the template public,</p>
      <ul className="list-disc mt-4 ml-8 mr-4 space-y-2">
        <li>
          Anyone can find the template from{' '}
          <Icon24 name="search" className="inline-block w-6 h-6" />
          Search.
        </li>
        <li>
          It will be listed on <Icon24 name="sparkles" className="inline-block w-6 h-6" />
          Published templates.
        </li>
      </ul>
    </Confirm>
  );
}
