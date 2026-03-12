import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDecodedTokenRep } from '../utils/auth'
import parseJwt from '../utils/jwt';
import {
    getRepresentativeById,
    toggleBreak,
    returnFromBreak,
    logoutRepresentative
} from '../services/representative.service'
import axiosInstance from '../services/axios'
import { getNextClient } from '../services/chatSession.service';
import { SenderType } from '../types/chatMessage.types';

export const useRepresentativeDashboard = () => {
    const navigate = useNavigate()
    const [repData, setRepData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadData = useCallback(async () => {
        try {
            const token = localStorage.getItem('representativeToken');
            if (!token) {
                setError("לא נמצאה אסימון. אנא התחבר מחדש.");
                return navigate('/RepresentativeLogin');
            }

            const decoded = parseJwt(token);
            const data = await getRepresentativeById(Number(decoded.sub));
            setRepData(data);


        } catch (err) {
            navigate('/RepresentativeLogin');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleGetNextClient = async () => {
        setActionLoading(true);
        setError(null);
        try {
            const res = await getNextClient(repData.idRepresentative);
            navigate('/representative-chat', { state: { sessionId: res.sessionID ,SenderType:1} });
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                setError("אין לקוחות ממתינים בתור כרגע. נסה שוב בעוד כמה דקות.");
            } else {
                setError("אירעה שגיאה בחיבור לשרת. אנא נסה שוב.");
            }
        } finally {
            setActionLoading(false);
        }
    };




    const handleToggleBreak = async () => {
        setActionLoading(true);
        try {
            if (repData.isOnline) await toggleBreak(repData.idRepresentative);
            else await returnFromBreak(repData.idRepresentative);
            await loadData();
        } catch (err) { setError("שגיאה בעדכון הסטטוס"); }
        finally { setActionLoading(false); }
    };

    const handleLogout = async () => {
        await logoutRepresentative(repData.idRepresentative);
        localStorage.removeItem('representativeToken');
        navigate('/RepresentativeLogin');
    };

    return { repData, loading, actionLoading, error, handleGetNextClient, handleToggleBreak, navigate, handleLogout };
};