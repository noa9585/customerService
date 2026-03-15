// ─────────────────────────────────────────────────────────────────────────────
// AdminDashboard.tsx
// עמוד מנהל בסיסי — placeholder לפיצ'רים עתידיים
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('representativeToken');
    localStorage.removeItem('representativeUser');
    navigate('/admin-login');
  };

  const placeholderSections = [
    { icon: '👥', title: 'ניהול נציגים',   desc: 'צפייה, עריכה והוספת נציגים' },
    { icon: '🙋', title: 'ניהול לקוחות',   desc: 'רשימת לקוחות וניהול חשבונות' },
    { icon: '📋', title: 'ניהול נושאים',    desc: 'הוספה ועריכה של נושאי פנייה' },
    { icon: '📊', title: 'דוחות וסטטיסטיקות', desc: 'נתוני שיחות וביצועי נציגים' },
  ];

  return (
    <div className="admin-dashboard-page" dir="rtl">
      <header className="admin-dash-header">
        <div className="admin-dash-logo">🛡️ מערכת ניהול</div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 התנתקות
        </button>
      </header>

      <main className="admin-dash-main">
        <h1>ברוך הבא, מנהל</h1>
        <p className="admin-dash-sub">בחר מודול לניהול</p>

        <div className="admin-modules-grid">
          {placeholderSections.map((s) => (
            <div key={s.title} className="admin-module-card">
              <div className="module-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="module-badge">בקרוב</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
