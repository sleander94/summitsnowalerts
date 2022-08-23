import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer id="footer">
      <p>© 2022 Summit Snow Alerts</p>
      <a href="https://github.com/sleander94/summitsnowalerts" target="_blank">
        <img
          src={require('../assets/icons/iconmonstr-github-1.svg').default}
          alt=""
        />
      </a>
    </footer>
  );
};

export default Footer;
