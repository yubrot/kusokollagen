import Confirm from '../basics/Confirm';

export interface Props {
  resolve(value: boolean): void;
}

export default function ConfirmDeleteUserAccount({ resolve }: Props): React.ReactElement {
  return (
    <Confirm
      title="DELETING USER ACCOUNT"
      acceptTitle="Delete"
      acceptIconName="trash"
      acceptClassName="text-red-600"
      declineTitle="Cancel"
      declineClassName="text-bluegray-500"
      resolve={resolve}
    >
      <p>
        Are you sure you want to delete the user account? <br />
        All templates you have created will be deleted.
      </p>
      <p>
        <strong className="font-bold">This operation cannot be undone!</strong>
      </p>
    </Confirm>
  );
}
