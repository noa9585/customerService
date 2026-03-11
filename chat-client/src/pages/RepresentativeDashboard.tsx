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
        actionLoading, 
        error, 
        handleGetNextClient, 
        handleToggleBreak, 
        handleLogout
    } = useRepresentativeDashboard();

    return (
        <RepresentativeDashboardSection
            repData={repData}
            loading={loading}
            actionLoading={actionLoading}
            error={error}
            handleGetNextClient={handleGetNextClient}
            handleToggleBreak={handleToggleBreak}
            handleLogout={handleLogout}
            onNavigate={navigate}
        />
    );
};

export default RepresentativeDashboard;