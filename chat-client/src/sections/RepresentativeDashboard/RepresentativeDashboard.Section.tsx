import React from 'react';
import '../../styles/RepresentativeDashboard.css';

interface RepresentativeDashboardSectionProps {
  repData: any;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  handleGetNextClient: () => void;
  handleToggleBreak: () => void;
  handleLogout: () => void;
  onNavigate: (path: string) => void;
}

/**
 * RepresentativeDashboardSection Component
 * Large UI section for the representative dashboard
 * Displays representative profile, stats, and action panel
 * This is a presentational (dumb) component - receives all props from parent
 */
const RepresentativeDashboardSection: React.FC<RepresentativeDashboardSectionProps> = ({
  repData,
  loading,
  actionLoading,
  error,
  handleGetNextClient,
  handleToggleBreak,
  handleLogout,
  onNavigate
}) => {
  if (loading) return <div className="dashboard-page">טוען נתונים...</div>;
  if (!repData) return null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="user-profile-section">
            <div className="avatar-circle">{'👨‍💻'}</div>
            <div>
              <h1 className="dash-title">שלום, {repData.nameRepr}</h1>
              {/* <p className="dash-email">{repData.emailRepr}</p> */}
            </div>
          </div>
          <div className={`status-indicator ${repData.isOnline ? 'status-online' : 'status-break'}`}>
            {repData.isOnline ? '🟢 מחובר וזמין' : '⏸️ בהפסקה'}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">ניקוד חודשי</span>
            <span className="stat-value">⭐ {repData.scoreForMonth || 0}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">סטטוס נוכחי</span>
            <span className="stat-value">{repData.isOnline ? 'פעיל' : 'הפסקה'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">תפקיד</span>
            <span className="stat-value">נציג שירות</span>
            {/* <span className="stat-value">{repData.role}</span> */}
          </div>
        </div>

        {/* Main Action Panel */}
        <main className="main-control-panel">
          <h2 style={{color: '#334155', margin: 0}}>מרכז פניות</h2>
          
          {error && <div style={{color: '#e11d48', fontWeight: 'bold'}}>{error}</div>}

          <div className="action-buttons">
            {/* הכפתור הזה יתבהר וייחסם כשהנציג בהפסקה */}
            <button 
              className="btn-dash btn-primary-dash" 
              disabled={!repData.isOnline || actionLoading}
              onClick={handleGetNextClient}
            >
              <span style={{fontSize: '20px'}}>🎧</span>
              { 'קבלת שיחה הבאה בתור'}
              {/* {actionLoading ? 'מושך לקוח...' : 'קבלת שיחה הבאה בתור'} */}
            </button>

            {/* כפתור ההפסקה נשאר פעיל כדי לאפשר חזרה לעבודה */}
            <button 
              className="btn-dash btn-outline-dash" 
              onClick={handleToggleBreak}
              disabled={actionLoading}
            >
              <span>{repData.isOnline ? '☕ צא להפסקה' : '🏠 חזור לעבודה'}</span>
            </button>
          </div>

          <div className="action-buttons">
            <button 
              className="btn-dash btn-outline-dash" 
              onClick={() => onNavigate('/update-representative')}
              disabled={actionLoading}
            >
              📝 עדכון פרטים אישיים
            </button>
            
            {/* כפתור התנתקות נשאר תמיד פעיל */}
            <button 
              className="btn-dash btn-logout" 
              onClick={handleLogout}
              disabled={actionLoading}
            >
              🚪 התנתקות מהמערכת
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RepresentativeDashboardSection;
