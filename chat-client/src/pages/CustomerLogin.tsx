import React from 'react';
import { useCustomerAuth } from '../hooks/useCustomerLogin'; // וודא שהנתיב נכון
import '../styles/CustomerLogin.css';

const CustomerLogin: React.FC = () => {
    // שליפת הנתונים מה-Hook
    const { formData, setFormData, error, loading, handleLogin } = useCustomerAuth();

    // שיניתי את השם ל-handleSubmit כדי שיתאים ל-JSX שלך למטה
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user = await handleLogin();
            if (user) {
                alert(`שלום ${user.nameCust}, ברוך הבא!`);
            }
        } catch (err) {
            // הלוגיקה של השגיאה מנוהלת בתוך ה-Hook (משתנה error)
            console.error("Login failed", err);
        }
    };

    return (
        <div className="chat-card">
            <div className="logo-container">
                <div className="logo-icon">👤</div>
                <h1>כניסת לקוח</h1>
            </div>

            {/* עכשיו handleSubmit מוגדר נכון */}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>אימייל:</label>
                    <input 
                        type="email" 
                        required
                        value={formData.emailCust}
                        onChange={(e) => setFormData({...formData, emailCust: e.target.value})}
                        placeholder="your@email.com"
                    />
                </div>

                <div className="form-group">
                    <label>סיסמה:</label>
                    <input 
                        type="password" 
                        required
                        value={formData.passwordCust}
                        onChange={(e) => setFormData({...formData, passwordCust: e.target.value})}
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
                עדיין לא רשום? <a href="/register">צור חשבון חדש</a>
            </p>
        </div>
    );
};

export default CustomerLogin;