import React from 'react';
import '../styles/WaitingRoomStyled.css';
import useWaitingRoom from '../hooks/useWaitingRoom.hook';

const WaitingRoomStyled: React.FC = () => {
  const { session, elapsed, estimated, cancel } = useWaitingRoom();

  const format = (s: number) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const progressPercent = Math.round(
    Math.min(100, (elapsed / Math.max(1, elapsed + estimated)) * 100)
  );

  return (
    <div className="waiting-page" dir="rtl">
      <div className="wr-card">
        <div className="wr-top-accent" />

        <div className="wr-avatar">
          <div className="wr-avatar-ring">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13.5C13.933 13.5 15.5 11.933 15.5 10V7.5C15.5 6.119 14.381 5 13 5H11C9.619 5 8.5 6.119 8.5 7.5V10C8.5 11.933 10.067 13.5 12 13.5Z" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 10.5V13C5 15.485 7.015 17.5 9.5 17.5H14.5C16.985 17.5 19 15.485 19 13V10.5" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <button className="wr-badge">⏳ מתמתין בתור</button>

        <h1 className="wr-title">{session.customer_name}, אנחנו כאן!</h1>
        <div className="wr-sub">נושא: <strong>{session.topic_name}</strong></div>

        <div className="wr-stats">
          <div className="wr-stat">
            <div className="stat-icon">⏱️</div>
            <div className="stat-main">{format(elapsed)}</div>
            <div className="stat-sub">זמן שעבר</div>
          </div>

          <div className="wr-stat">
            <div className="stat-icon">🕒</div>
            <div className="stat-main">~ {Math.round(estimated / 60)} דק׳</div>
            <div className="stat-sub">זמן משוער</div>
          </div>

          <div className="wr-stat">
            <div className="stat-icon">👥</div>
            <div className="stat-main">{session.queue_position}</div>
            <div className="stat-sub">מיקום בתור</div>
          </div>
        </div>

        <div className="wr-progress-wrap">
          <div className="wr-progress">
            <div className="wr-progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="wr-progress-note">אל תסגור את הדף — נעדכן אותך ברגע שנגיע לתורה ✨</div>
        </div>

        <div className="wr-actions">
          <button className="wr-cancel" onClick={cancel}>בטל ויצא מהתור ✖</button>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomStyled;
