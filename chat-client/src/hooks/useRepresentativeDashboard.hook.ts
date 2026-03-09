import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import parseJwt from '../utils/jwt';
import {
    getRepresentativeById,
    toggleBreak,
    returnFromBreak,
    logoutRepresentative
} from '../services/representative.service'
 import axiosInstance from '../services/axios'

export const useRepresentativeDashboard = () => {
    const navigate = useNavigate()
    const [repData, setRepData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadData = useCallback(async () => {
        try {
            const token = localStorage.getItem('representativeToken');
            if (!token)
            {
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
        try {
            const res = await axiosInstance.post(`/ChatSession/get-next-client/${repData.idRepresentative}`);
            navigate('/chat', { state: { sessionId: res.data.sessionID } });
        } catch (err: any) {
            setError(err.response?.data?.message || "אין לקוחות בתור");
        } finally { setActionLoading(false); }
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