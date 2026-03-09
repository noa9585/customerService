import React from 'react';
import '../styles/ContactUs.css';
import { Link } from 'react-router-dom';
import { useContactActions } from '../hooks/useContactActions.hook';

const ContactUs: React.FC = () => {
    const { handleStart } = useContactActions();
    return (
        <div className="contact-container">
            <div className="contact-card">
                {/* Header Badge */}
                <div className="badge">שירות לקוחות חכם ומהיר ⚡</div>

                {/* Main Title */}
                <h1 className="main-title">שירות לקוחות</h1>
                <h2 className="sub-title">ברמה אחרת</h2>

                {/* Description */}
                <p className="description">
                    מערכת תור חכמה שמחברת אותך לנציג המתאים ביותר, עם זמני המתנה מינימליים וחוויית שירות מעולה.
                </p>

                {/* CTA Buttons */}
                <div className="button-group">
                    <Link to="/login" className="btn btn-outline">למד עוד</Link>
                    <button type="button" className="btn btn-primary" onClick={handleStart}>התחל שיחה 💬</button>
                </div>

                {/* Stats Section */}
                <div className="stats-section">
                    <div className="stat">
                        <div className="stat-value">98%</div>
                        <div className="stat-label">שביעות רצון</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value">&lt; 2 דקות</div>
                        <div className="stat-label">זמן המתנה</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value">24/6</div>
                        <div className="stat-label">זמינות</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
