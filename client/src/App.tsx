import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/account-actions/Login';
import Signup from './components/account-actions/Signup';
import Account from './components/Account';
import Home from './components/Home';
import Conditions from './components/Conditions';
import Footer from './components/Footer';
import './styles/main.css';
import { User } from './types.d';

const App = () => {
  const [user, setUser] = useState<User>();

  const getUser = (data: User) => {
    setUser(data);
  };

  useEffect(() => {
    if (!user) {
      const checkAuth = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_PRODUCTION_API}/users`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          const data = await response.json();
          if (response.ok) setUser(data);
          else setUser(undefined);
        } catch (err) {
          console.error(err);
        }
      };
      checkAuth();
    }
  }, [user]);

  const logout = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_PRODUCTION_API}/users/logout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.ok) setUser(undefined);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <Router>
        <Navbar user={user} logout={logout} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/login"
            element={<Login user={user} getUser={getUser} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account user={user} />} />
          <Route path="/conditions" element={<Conditions user={user} />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
