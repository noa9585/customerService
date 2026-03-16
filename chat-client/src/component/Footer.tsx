import React from 'react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-logo">
              <div className="footer-logo-icon">💬</div>
              <span className="footer-logo-text">QuickChat</span>
            </div>
            <p className="footer-tagline">מערכת שירות לקוחות חכמה</p>
          </div>
          <nav className="footer-nav">
            <span>אודות</span>
            <span>תמיכה</span>
            <span>פרטיות</span>
            <span>תנאים</span>
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© {currentYear} QuickChat. כל הזכויות שמורות.</p>
          <div className="footer-status">
            <div className="footer-status-dot" />
            {/* <span>כל המערכות תקינות</span> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;