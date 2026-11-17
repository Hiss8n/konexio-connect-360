import { useState } from 'react';

type NavbarProps = {
  onHome: () => void;
  onLogin: () => void;
  onSignup: () => void;
};

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Programmes', href: '#programmes' },
  { label: 'Impact', href: '#impact' },

  { label: 'Reports', href: '#reports' },
  { label: 'Newsletter', href: '#newsletter' },
  { label: 'Contact', href: '#contact' }
];

const Navbar = ({ onHome, onLogin, onSignup }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <button type="button" className="brand-wrap brand-button" aria-label="Konexio home" onClick={onHome}>
        <img src="/src/assets/konexio_africa_placeholder_logo.png" alt="Konexio logo" className="brand-logo" />
      </button>

      <button
        type="button"
        className="mobile-menu-toggle"
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isMenuOpen}
        aria-controls="primary-menu"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`mobile-menu${isMenuOpen ? ' is-open' : ''}`} id="primary-menu">
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button type="button" className="btn btn-light" onClick={() => { setIsMenuOpen(false); onLogin(); }}>Log in</button>
          <button type="button" className="btn btn-primary" onClick={() => { setIsMenuOpen(false); onSignup(); }}>Sign up</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;