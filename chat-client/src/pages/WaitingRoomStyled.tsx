import React from 'react';
import '../styles/WaitingRoomStyled.css';

interface WaitingRoomProps {
  session: any;      // נתוני הסשן המלאים מה-DB
  elapsed: number;   // זמן שעבר בשניות מאז פתיחת הדף
  waitTime: number;  // זמן המתנה משוער בדקות (מה-Worker)
}

const WaitingRoomStyled: React.FC<WaitingRoomProps> = ({ session, elapsed, waitTime }) => {
  
  // פורמט זמן שעבר (MM:SS)
  const formatElapsed = (s: number) => {
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // חישוב אחוז התקדמות ויזואלי
  // נוסחה: זמן שעבר חלקי (זמן שעבר + זמן שנותר)
  const totalEstimatedSeconds = (waitTime * 60) + elapsed;
  const progressPercent = Math.round(
    Math.min(95, (elapsed / Math.max(1, totalEstimatedSeconds)) * 100)
  );

  if (!session) return <div className="loading">מתחבר למערכת התור...</div>;

  return (
    <div className="waiting-page" dir="rtl">
      <div className="wr-card">
        <div className="wr-top-accent" />

        <div className="wr-avatar">
          <div className="wr-avatar-ring">
             <div className="pulse-ring"></div>
             <span style={{fontSize: '40px'}}>⏳</span>
          </div>
        </div>

        <button className="wr-badge">מתמין בתור לשיחה</button>

        <h1 className="wr-title">מיד נתחבר, {session.customerName || 'לקוח יקר'}</h1>
        <div className="wr-sub">מזהה פנייה: <strong>#{session.sessionID}</strong></div>

        <div className="wr-stats">
          <div className="wr-stat">
            <div className="stat-icon">⏱️</div>
            <div className="stat-main">{formatElapsed(elapsed)}</div>
            <div className="stat-sub">זמן המתנה בפועל</div>
          </div>

          <div className="wr-stat">
            <div className="stat-icon">🕒</div>
            <div className="stat-main">~ {Math.round(waitTime)} דק׳</div>
            <div className="stat-sub">זמן משוער שנותר</div>
          </div>

          <div className="wr-stat">
            <div className="stat-icon">👥</div>
            <div className="stat-main">מעבד...</div>
            <div className="stat-sub">מחשב מיקום</div>
          </div>
        </div>

        <div className="wr-progress-wrap">
          <div className="wr-progress">
            <div className="wr-progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="wr-progress-note">
            הנציגים שלנו בודקים את פנייתך. אל תסגור את הדף ✨
          </p>
        </div>

        <div className="wr-actions">
           <button className="btn-cancel" onClick={() => window.location.href='/new-chat'}>
             ביטול פנייה
           </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomStyled;