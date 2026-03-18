import React from 'react';
import { Link } from 'react-router-dom';
import { useContactActions } from '../hooks/useContactUs.hook';
import '../styles/ContactUs.css';

const ContactUs: React.FC = () => {
    const { handleStart, isAuthenticated } = useContactActions();

    const features = [
        { icon: '⚡', title: 'מענה מיידי', desc: 'חיבור לנציג תוך דקות ספורות' },
        { icon: '🤖', title: 'AI חכם', desc: 'ניתוח שיחות ושיפור מתמיד של השירות' },
        { icon: '🔒', title: 'מאובטח', desc: 'הנתונים שלך מוצפנים ומוגנים' },
        { icon: '📊', title: 'מעקב איכות', desc: 'ניקוד AI לכל נציג אחרי כל שיחה' },
    ];

    const stats = [
        { value: '98%', label: 'שביעות רצון' },
        { value: '< 2 דק׳', label: 'זמן המתנה' },
        { value: '24/6', label: 'זמינות' },
        { value: 'AI', label: 'ניתוח שיחות' },
    ];

    const steps = [
        { num: '01', title: 'הירשם', desc: 'צור חשבון תוך שניות' },
        { num: '02', title: 'בחר נושא', desc: 'מה הבעיה שלך?' },
        { num: '03', title: 'המתן', desc: 'נציג מגיע אליך' },
        { num: '04', title: 'שוחח', desc: 'קבל פתרון בזמן אמת' },
    ];

    return (
        <div className="cu-page" dir="rtl">

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="cu-hero">
                <div className="cu-hero-bg">
                    <div className="cu-orb cu-orb-1" />
                    <div className="cu-orb cu-orb-2" />
                    <div className="cu-orb cu-orb-3" />
                </div>
                <div className="cu-hero-content">
                    <div className="cu-badge">
                        <span className="cu-badge-dot" />
                        שירות לקוחות מהדור הבא
                    </div>
                    <h1 className="cu-hero-title">
                        שירות מהיר,<br />
                        <span className="cu-gradient-text">חכם ואישי</span>
                    </h1>
                    <p className="cu-hero-sub">
                        QuickChat מחברת אותך לנציג המתאים ביותר תוך דקות,
                        עם מערכת AI שמנתחת כל שיחה ומבטיחה איכות שירות מעולה.
                    </p>
                    <div className="cu-hero-actions">
                        <button className="cu-btn-primary" onClick={handleStart}>
                            התחל שיחה עכשיו
                            <span className="cu-btn-arrow">←</span>
                        </button>
                        {!isAuthenticated && (
                            <Link to="/login" className="cu-btn-ghost
">
                                כניסה למערכת
                            </Link>
                        )}                    </div>











                </div>

                {/* Chat preview card */}
                <div className="cu-hero-card">
                    <div className="cu-card-header">
                        <div className="cu-card-dots">
                            <span /><span /><span />
                        </div>
                        <span className="cu-card-title">QuickChat</span>
                        <span className="cu-card-status">
                            <span className="cu-online-dot" />
                            מחובר
                        </span>
                    </div>
                    <div className="cu-card-messages">
                        <div className="cu-msg cu-msg-rep">
                            <div className="cu-msg-avatar">נ</div>
                            <div className="cu-msg-bubble">שלום! במה אוכל לעזור? 😊</div>
                        </div>
                        <div className="cu-msg cu-msg-user">
                            <div className="cu-msg-bubble">יש לי שאלה על החשבון שלי</div>
                        </div>
                        <div className="cu-msg cu-msg-rep">
                            <div className="cu-msg-avatar">נ</div>
                            <div className="cu-msg-bubble">בשמחה! אני כאן לעזור 👍</div>
                        </div>
                        <div className="cu-typing">
                            <span /><span /><span />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats ────────────────────────────────────────────────── */}
            <section className="cu-stats">
                {stats.map(s => (
                    <div key={s.label} className="cu-stat">
                        <div className="cu-stat-value">{s.value}</div>
                        <div className="cu-stat-label">{s.label}</div>
                    </div>
                ))}
            </section>

            {/* ── Features ─────────────────────────────────────────────── */}
            <section className="cu-features">
                <div className="cu-section-header">
                    <h2>למה QuickChat?</h2>
                    <p>טכנולוגיה מתקדמת בשירות חוויית הלקוח</p>
                </div>
                <div className="cu-features-grid">
                    {features.map(f => (
                        <div key={f.title} className="cu-feature-card">
                            <div className="cu-feature-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How it works ─────────────────────────────────────────── */}
            <section className="cu-steps">
                <div className="cu-section-header">
                    <h2>איך זה עובד?</h2>
                    <p>תהליך פשוט בארבעה צעדים</p>
                </div>
                <div className="cu-steps-grid">
                    {steps.map((s, i) => (
                        <div key={s.num} className="cu-step">
                            <div className="cu-step-num">{s.num}</div>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                            {i < steps.length - 1 && <div className="cu-step-arrow">←</div>}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────────── */}
            <section className="cu-cta">
                <div className="cu-cta-inner">
                    <h2>מוכן להתחיל?</h2>
                    <p>הצטרף לאלפי לקוחות מרוצים</p>
                    <button className="cu-btn-primary cu-btn-large" onClick={handleStart}>
                        פתח שיחה עכשיו
                        <span className="cu-btn-arrow">←</span>
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ContactUs;

// import React from 'react';
// import '../styles/ContactUs.css';
// import { Link } from 'react-router-dom';
// import { useContactActions } from '../hooks/useContactUs.hook';

// const ContactUs: React.FC = () => {
//     const { handleStart } = useContactActions();
//     return (
//         <div className="contact-container">
//             <div className="contact-card">
//                 {/* Header Badge */}
//                 <div className="badge">שירות לקוחות חכם ומהיר ⚡</div>

//                 {/* Main Title */}
//                 <h1 className="main-title">שירות לקוחות</h1>
//                 <h2 className="sub-title">ברמה אחרת</h2>

//                 {/* Description */}
//                 <p className="description">
//                     מערכת תור חכמה שמחברת אותך לנציג המתאים ביותר, עם זמני המתנה מינימליים וחוויית שירות מעולה.
//                 </p>

//                 {/* CTA Buttons */}
//                 <div className="button-group">
//                     <Link to="/login" className="btn btn-outline">למד עוד</Link>
//                     <button type="button" className="btn btn-primary" onClick={handleStart}>התחל שיחה 💬</button>
//                 </div>

//                 {/* Stats Section */}
//                 <div className="stats-section">
//                     <div className="stat">
//                         <div className="stat-value">98%</div>
//                         <div className="stat-label">שביעות רצון</div>
//                     </div>
//                     <div className="stat">
//                         <div className="stat-value">&lt; 2 דקות</div>
//                         <div className="stat-label">זמן המתנה</div>
//                     </div>
//                     <div className="stat">
//                         <div className="stat-value">24/6</div>
//                         <div className="stat-label">זמינות</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ContactUs;
