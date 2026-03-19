import React from 'react';
import { useNavigate } from 'react-router-dom';
import RepresentativeDashboardSection from '../sections/RepresentativeDashboard/RepresentativeDashboard.Section';
import { useRepresentativeDashboard } from '../hooks/useRepresentativeDashboard.hook';

/**
 * RepresentativeDashboard Page (Thin Wrapper)
 * Orchestrates: pulls data from hook, passes to section for rendering
 * Keeps logic separate from UI
 */
const RepresentativeDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { 
        repData, 
        loading, 
        error, 
        handleGetNextClient, 
        handleToggleBreak, 
        handleLogout,
        handleCloseScoreModal,
        lastScore
    } = useRepresentativeDashboard();

   return (
        <div className="dashboard-wrapper">
            <RepresentativeDashboardSection
                repData={repData}
                loading={loading}
                actionLoading={loading}
                error={error}
                handleGetNextClient={handleGetNextClient}
                handleToggleBreak={handleToggleBreak}
                handleLogout={handleLogout}
                onNavigate={navigate}
            />

            {/* חלונית הציון הקופצת */}
           {lastScore !== null && (
  <div className="score-modal-overlay">
    <div className="score-modal-card">
      <div className="score-modal-icon">★</div>
      <h2 className="score-modal-title">כל הכבוד</h2>
      <p className="score-modal-text">השיחה הסתיימה.<br />שביעות רצון הלקוח:</p>

      <div className="score-display">
        <span className="score-number">{lastScore}</span>
        <span className="score-out-of">/10</span>
      </div>

      <div className="score-dots">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={`score-dot${i < lastScore ? ' filled' : ''}`} />
        ))}
      </div>

      <button className="btn-score-confirm" onClick={handleCloseScoreModal}>
        המשך ללקוח הבא ←
      </button>
    </div>
  </div>
)}
        </div>
    );
};

export default RepresentativeDashboard;