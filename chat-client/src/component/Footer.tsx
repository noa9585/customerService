import React from 'react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-logo">
          <div className="footer-logo-icon">💬</div>
          <span className="footer-logo-text">QuickChat</span>
        </div>

        <div className="footer-right">
          <nav className="footer-nav">
            <span>אודות</span>
            <span>תמיכה</span>
            <span>פרטיות</span>
            <span>תנאים</span>
          </nav>
          <p className="footer-copy">© {currentYear} QuickChat. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;