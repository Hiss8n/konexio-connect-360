const footerLinks = {
  About: ['Our mission', 'Partners', 'Team'],
  Explore: ['Programmes', 'Impact', 'Alumni', 'Annual reports'],
  Connect: ['Newsletter', 'Contact', 'Get involved']
};

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="brand-mark">K</div>
          <div>
            <strong>Konexio</strong>
            <p>Skills, pathways and opportunity for Africa’s next generation.</p>
          </div>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title} className="footer-column">
            <h3>{title}</h3>
            <ul>
              {links.map((link) => (
                <li key={link}><a href="#">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <span>© 2026 Konexio Africa Digi Pass</span>
        <span className="demo-note">Sample data for demonstration</span>
        <a href="#">LinkedIn</a>
      </div>
    </footer>
  );
};

export default Footer;
