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
      <Link className="title" to="/home">
        <img
          src={
            require('../assets/icons/snowy-mountains-svgrepo-com.svg').default
          }
        />
        <h1>Summit Snow Alerts</h1>
      </Link>
      <Menu
        right
        width={200}
        isOpen={open}
        onOpen={handleIsOpen}
        onClose={handleIsOpen}
      >
        <Link
          id="home"
          className="menu-item"
          to="/home"
          onClick={() => {
            closeMenu();
          }}
        >
          Home
        </Link>
        <Link
          id="conditions"
          className="menu-item"
          to="/conditions"
          onClick={() => {
            closeMenu();
          }}
        >
          Conditions
        </Link>
        <Link
          id="account"
          className="menu-item"
          to="/account"
          onClick={() => {
            closeMenu();
          }}
        >
          Account
        </Link>
        <Link
          id="signup"
          className="menu-item"
          to="/signup"
          onClick={() => {
            closeMenu();
          }}
        >
          Signup
        </Link>
        <Link
          id="login"
          className="menu-item"
          to="/login"
          onClick={() => {
            closeMenu();
          }}
        >
          Login
        </Link>
        <button onClick={() => logout()}>Logout</button>
      </Menu>
    </header>
  );
};

export default Navbar;
