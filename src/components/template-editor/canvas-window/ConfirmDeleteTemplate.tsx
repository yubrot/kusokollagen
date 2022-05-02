import Confirm from '../../common/Confirm';

export interface Props {
  resolve(value: boolean): void;
}

export default function ConfirmDeleteTemplate({ resolve }: Props): React.ReactElement {
  return (
    <Confirm
      title="DELETING TEMPLATE"
      acceptTitle="Delete"
      acceptIconName="trash"
      acceptClassName="text-red-600"
      declineTitle="Cancel"
      declineClassName="text-bluegray-500"
      resolve={resolve}
    >
      Are you sure you want to delete the template? <br />
      This operation cannot be undone.
    </Confirm>
  );
}
