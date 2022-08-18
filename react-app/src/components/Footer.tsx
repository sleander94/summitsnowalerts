import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer id="footer">
      <p>© 2022 Summit Snow Alerts</p>
      <Link to="https://github.com/sleander94">
        <img
          src={require('../assets/icons/iconmonstr-github-1.svg').default}
          alt=""
        />
      </Link>
    </footer>
  );
};

export default Footer;
