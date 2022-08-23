import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import { NavbarProps } from '../types.d';
import { useState } from 'react';

const Navbar = ({ user, logout }: NavbarProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleIsOpen = () => {
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };
  return (
    <header id="header">
      <Link className="title" to="/">
        <img
          src={
            require('../assets/icons/snowy-mountains-svgrepo-com.svg').default
          }
          alt=""
        />
        <h1>Summit Snow Alerts</h1>
      </Link>
      {/* Desktop Menu */}
      <nav className="desktop">
        <Link id="home-link" className="menu-item" to="/">
          Home
        </Link>
        <Link id="mountains-link" className="menu-item" to="/conditions">
          Forecast
        </Link>
        {user && (
          <Link id="account-link" className="menu-item" to="/account">
            Account
          </Link>
        )}
        {!user && (
          <Link id="signup-link" className="menu-item" to="/signup">
            Signup
          </Link>
        )}
        {!user && (
          <Link id="login-link" className="menu-item" to="/login">
            Login
          </Link>
        )}
        {user && (
          <Link
            id="logout-link"
            className="menu-item"
            to="/"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Link>
        )}
      </nav>
      {/* Mobile Menu */}
      <Menu
        right
        width={200}
        isOpen={open}
        onOpen={handleIsOpen}
        onClose={handleIsOpen}
      >
        <Link
          id="home-link"
          className="menu-item"
          to="/"
          onClick={() => {
            closeMenu();
          }}
        >
          Home
        </Link>
        <Link
          id="mountains-link"
          className="menu-item"
          to="/conditions"
          onClick={() => {
            closeMenu();
          }}
        >
          Forecast
        </Link>
        {user && (
          <Link
            id="account-link"
            className="menu-item"
            to="/account"
            onClick={() => {
              closeMenu();
            }}
          >
            Account
          </Link>
        )}
        {!user && (
          <Link
            id="signup-link"
            className="menu-item"
            to="/signup"
            onClick={() => {
              closeMenu();
            }}
          >
            Signup
          </Link>
        )}
        {!user && (
          <Link
            id="login-link"
            className="menu-item"
            to="/login"
            onClick={() => {
              closeMenu();
            }}
          >
            Login
          </Link>
        )}
        {user && (
          <Link
            id="logout-link"
            className="menu-item"
            to="/"
            onClick={() => {
              logout();
              closeMenu();
            }}
          >
            Logout
          </Link>
        )}
      </Menu>
    </header>
  );
};

export default Navbar;
