import { Navigate } from 'react-router-dom';
import { AuthProps } from '../types.d';
import AccountInfoForm from './account-actions/AccountInfoForm';
import MountainsForm from './account-actions/MountainsForm';

const Account = ({ user }: AuthProps) => {
  return (
    <section id="account">
      {!user && <Navigate to="/" />}
      <div className="background-image"></div>
      <div className="content">
        <MountainsForm user={user} />
        <AccountInfoForm user={user} />
      </div>
    </section>
  );
};

export default Account;
