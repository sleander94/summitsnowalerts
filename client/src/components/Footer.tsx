const Footer = () => {
  return (
    <footer id="footer">
      <p>© 2022 Summit Snow Alerts</p>
      <a
        href="https://github.com/sleander94/summitsnowalerts"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={require('../assets/icons/iconmonstr-github-1.svg').default}
          alt="github logo"
        />
      </a>
    </footer>
  );
};

export default Footer;
