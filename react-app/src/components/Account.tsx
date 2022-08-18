import { Navigate } from 'react-router-dom';
import { AuthProps } from '../types.d';
import AccountInfoForm from './account-actions/AccountInfoForm';
import MountainsForm from './account-actions/MountainsForm';

const Account = ({ user }: AuthProps) => {
  return (
    <section id="account">
      {!user && <Navigate to="/" />}
      <MountainsForm user={user} />
      <AccountInfoForm user={user} />
    </section>
  );
};

export default Account;
