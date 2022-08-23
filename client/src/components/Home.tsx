import { Link } from 'react-router-dom';
import { AuthProps } from '../types.d';

const Home = ({ user }: AuthProps) => {
  return (
    <section id="home">
      <div className="background-image"></div>
      <h1>Summit Snow Alerts</h1>
      <div className="content">
        <h2>
          Never miss a storm. Get text notifications for your favorite
          mountains.
        </h2>
        {user && <p>Welcome back, {user.name.split(' ')[0]}.</p>}
        {!user && (
          <div className="link-container">
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
          </div>
        )}
        {user && (
          <div className="link-container">
            <Link to="/conditions">My Mountains</Link>
            <Link to="/account">Edit Account</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
