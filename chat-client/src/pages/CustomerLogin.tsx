import React, { useState } from 'react';
import { loginCustomer } from '../services/customer.service';
import { CustomerLogin as CustomerLoginType } from '../types/customer.types';
import '../styles/CustomerLogin.css'; // נשתמש בעיצוב שהכנו קודם
import { Link } from 'react-router-dom';

const CustomerLogin: React.FC = () => {
    // State לניהול השדות בטופס
    const [formData, setFormData] = useState<CustomerLoginType>({
        emailCust: '',
        passwordCust: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // קריאה ל-Service שבנית!
            const user = await loginCustomer(formData);
            console.log("התחברת בהצלחה!", user);
            alert(`שלום ${user.nameCust}, ברוך הבא!`);

            // כאן בהמשך נשמור אותו ב-Context או ב-SessionStorage
        } catch (err: any) {
            // טיפול בשגיאה (למשל 401 Unauthorized מה-Controller)
            setError("אימייל או סיסמה שגויים. נסה שוב.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-card">
            <div className="logo-container">
                <div className="logo-icon">👤</div>
                <h1>כניסת לקוח</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>אימייל:</label>
                    <input
                        type="email"
                        required
                        value={formData.emailCust}
                        onChange={(e) => setFormData({ ...formData, emailCust: e.target.value })}
                        placeholder="your@email.com"
                    />
                </div>

                <div className="form-group">
                    <label>סיסמה:</label>
                    <input
                        type="password"
                        required
                        value={formData.passwordCust}
                        onChange={(e) => setFormData({ ...formData, passwordCust: e.target.value })}
                        placeholder="******"
                    />
                </div>

                {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? <div className="spinner"></div> : 'התחברות'}
                </button>
            </form>

            <p style={{ marginTop: '20px', fontSize: '14px' }}>
                עדיין לא רשום? <Link to="/register">צור חשבון חדש</Link>
            </p>
        </div>
    );
};

export default CustomerLogin;