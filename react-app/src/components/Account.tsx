import { AuthProps } from '../types.d';
import AccountInfoForm from './account-actions/AccountInfoForm';
import MountainsForm from './account-actions/MountainsForm';

const Account = ({ user }: AuthProps) => {
  return (
    <section id="account">
      <MountainsForm user={user} />
      <AccountInfoForm user={user} />
    </section>
  );
};

export default Account;
