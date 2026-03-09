import React from 'react';
import { useCustomerAuth } from '../hooks/useRepresentativeLogin.hook'; // וודא שהנתיב נכון
import '../styles/CustomerLogin.css'; // נשתמש בעיצוב שהכנו קודם
import { Link } from 'react-router-dom';

const RepresentativeLogin: React.FC = () => {
    // שליפת הנתונים מה-Hook
    const { formData, setFormData, error, loading, handleSubmit } = useCustomerAuth();
    return (
        <div className="chat-card">
            <div className="logo-container">
                <div className="logo-icon">👤</div>
                <h1>כניסת נציג</h1>
            </div>

            {/* עכשיו handleSubmit מוגדר נכון */}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>אימייל:</label>
                    <input
                        type="email"
                        required
                        value={formData.emailRepr}
                        onChange={(e) => setFormData({ ...formData, emailRepr: e.target.value })}
                        placeholder="your@email.com"
                    />
                </div>

                <div className="form-group">
                    <label>סיסמה:</label>
                    <input
                        type="password"
                        required
                        value={formData.passwordRepr}
                        onChange={(e) => setFormData({ ...formData, passwordRepr: e.target.value })}
                        placeholder="******"
                    />
                </div>

                {/* משתנה error מגיע מה-Hook */}
                {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? <div className="spinner"></div> : 'התחברות'}
                </button>
            </form>

            <p style={{ marginTop: '20px', fontSize: '14px' }}>
                עדיין לא רשום? <Link to="/RepresentativeRegister">צור חשבון חדש</Link>
            </p>
        </div>
    );
};

export default RepresentativeLogin;