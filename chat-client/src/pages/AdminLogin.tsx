// ─────────────────────────────────────────────────────────────────────────────
// AdminLogin.tsx
// דף כניסת מנהל — עיצוב כהה ורשמי בהתאם לתפקיד
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // TODO: להחליף בקריאת API אמיתית לנקודת קצה של מנהל
      // const response = await loginAdmin(formData);
      // localStorage.setItem('representativeToken', response.token);
      // localStorage.setItem('representativeUser', JSON.stringify(response));
      // navigate('/admin');

      // כרגע — placeholder בלבד
      setError('כניסת מנהל עדיין לא מחוברת לשרת. בקרוב!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-icon">🛡️</div>
        <h1>כניסת מנהל</h1>
        <p className="admin-subtitle">גישה מורשית בלבד</p>

        <form onSubmit={handleSubmit} dir="rtl">
          <div className="admin-field">
            <label>אימייל</label>
            <input
              type="email"
              required
              placeholder="admin@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="admin-field">
            <label>סיסמה</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && <div className="admin-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'מתחבר...' : 'כניסה למערכת'}
          </button>
        </form>

        <div className="admin-links">
          <button className="admin-link-btn" onClick={() => navigate('/login')}>
            כניסת לקוח
          </button>
          <span className="admin-divider">|</span>
          <button className="admin-link-btn" onClick={() => navigate('/RepresentativeLogin')}>
            כניסת נציג
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
