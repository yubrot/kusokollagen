import Icon24 from './basics/Icon24';
import { progress } from './basics/Progress';
import { toast } from './basics/Toast';
import { useDetach } from './basics/hooks/orphan';
import ConfirmDeleteUserAccount from './settings/ConfirmDeleteUserAccount';
import { useCallback } from 'react';

export interface Props {
  deleteUserAccount(): Promise<void>;
}

export default function UserSettings({ deleteUserAccount }: Props): React.ReactElement {
  const detach = useDetach();

  const deleteUserAccountInteraction = useCallback(async () => {
    const sure = await detach(resolve => <ConfirmDeleteUserAccount resolve={resolve} />);
    if (!sure) return;

    try {
      await detach(progress(deleteUserAccount()));
    } catch (e) {
      detach(
        toast('error', `Failed to delete user account: ${e instanceof Error ? e.message : e}`)
      );
      return;
    }

    detach(toast('success', 'Your user account was successfully deleted.'));
  }, [deleteUserAccount, detach]);

  return (
    <div className="container-sm my-12 card">
      <div className="heading lined mx-4 space-x-2">
        <Icon24 name="user-circle" className="w-6 h-6" />
        <div>Settings</div>
      </div>
      <div className="p-4 flex justify-center">
        <button
          className="button primary-button not space-x-2"
          onClick={deleteUserAccountInteraction}
        >
          <Icon24 name="trash" className="w-6 h-6" />
          <div>Delete user account</div>
        </button>
      </div>
    </div>
  );
}
