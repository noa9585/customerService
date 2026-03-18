// useAdminDashboard_hook.ts
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/index';

import { fetchTopics, addTopicThunk, updateTopicThunk, deleteTopicThunk } from '../store/slices/Topic.slice';
import { Topic, TopicAdd } from '../types/topic.types';

import {
    getAllRepresentatives,
    deleteRepresentative,
    getWaitingRepresentatives,
    approveRepresentative,
    denyRepresentative,
} from '../services/representative.service';
import { Representative, RepresentativeChat } from '../types/representative.types';

import { fetchCustomers, deleteCustomerThunk } from '../store/slices/Customerslice';
import { fetchSessions } from '../store/slices/Chatsession.slice';
import { ChatSession } from '../types/chatSession.types';

// ── Types ─────────────────────────────────────────────────────────────────────
export type AdminTab = 'overview' | 'topics' | 'representatives' | 'waiting' | 'customers' | 'sessions';

export type TopicFormData = {
    nameTopic: string;
    averageTreatTime: number;
    priorityTopics: number;
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useAdminDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<AdminTab>('overview');

    const { topics, loading: topicsLoading } = useSelector((s: RootState) => s.topic);
    const { sessions, loading: sessionsLoading } = useSelector((s: RootState) => s.chatSession);
    const { customers, loading: customersLoading } = useSelector((s: RootState) => s.customer);

    const [representatives, setRepresentatives] = useState<Representative[]>([]);
    const [repsLoading, setRepsLoading] = useState(false);

const [waitingReps, setWaitingReps] = useState<Representative[]>([]);
    const [waitingLoading, setWaitingLoading] = useState(false);

    const [topicForm, setTopicForm] = useState<TopicFormData>({
        nameTopic: '', averageTreatTime: 10, priorityTopics: 1,
    });
    const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
    const [topicDialogOpen, setTopicDialogOpen] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: number } | null>(null);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    const getTopicName = useCallback((id: number) => {
        const topic = topics.find(t => t.idTopic === id);
        return topic ? topic.nameTopic : `נושא #${id}`;
    }, [topics]);

    const getCustomerName = useCallback((id: number) => {
        const customer = customers.find(c => c.idCustomer === id);
        return customer ? customer.nameCust : `לקוח #${id}`;
    }, [customers]);

    const getRepName = useCallback((id: number | null) => {
        if (!id) return '—';
        const rep = representatives.find(r => r.idRepresentative === id);
        return rep ? rep.nameRepr : `נציג #${id}`;
    }, [representatives]);

    // ── ✅ useCallback — הפונקציות יציבות וניתן לשים ב-dependencies ────────
    const loadRepresentatives = useCallback(async () => {
        setRepsLoading(true);
        try {
            const data = await getAllRepresentatives();
            setRepresentatives(data);
        } catch {
            setError('שגיאה בטעינת נציגים');
        } finally {
            setRepsLoading(false);
        }
    }, []);

    const loadWaitingRepresentatives = useCallback(async () => {
        setWaitingLoading(true);
        try {
            const data = await getWaitingRepresentatives();
            setWaitingReps(data);
        } catch {
            setError('שגיאה בטעינת נציגים ממתינים');
        } finally {
            setWaitingLoading(false);
        }
    }, []);

    // ── ✅ dependencies מלאות ─────────────────────────────────────────────
    useEffect(() => {
        if (activeTab === 'overview') {
            dispatch(fetchTopics());
            dispatch(fetchCustomers());
            dispatch(fetchSessions());
            loadRepresentatives();
            loadWaitingRepresentatives();
        }
        if (activeTab === 'topics') dispatch(fetchTopics());
        if (activeTab === 'customers') dispatch(fetchCustomers());
        if (activeTab === 'sessions') dispatch(fetchSessions());
        if (activeTab === 'representatives') loadRepresentatives();
        if (activeTab === 'waiting') loadWaitingRepresentatives();
    }, [activeTab, dispatch, loadRepresentatives, loadWaitingRepresentatives]);

    // ── Flash helper ──────────────────────────────────────────────────────
    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    // ── Topic CRUD ────────────────────────────────────────────────────────
    const openAddTopic = () => {
        setEditingTopicId(null);
        setTopicForm({ nameTopic: '', averageTreatTime: 10, priorityTopics: 1 });
        setTopicDialogOpen(true);
    };

    const openEditTopic = (topic: Topic) => {
        setEditingTopicId(topic.idTopic);
        setTopicForm({
            nameTopic: topic.nameTopic,
            averageTreatTime: topic.averageTreatTime,
            priorityTopics: topic.priorityTopics,
        });
        setTopicDialogOpen(true);
    };

    const handleSaveTopic = async () => {
        if (!topicForm.nameTopic.trim()) { setError('שם הנושא הוא שדה חובה'); return; }
        try {
            if (editingTopicId !== null) {
                await dispatch(updateTopicThunk({ id: editingTopicId, data: topicForm as TopicAdd }));
                showSuccess('הנושא עודכן בהצלחה');
            } else {
                await dispatch(addTopicThunk(topicForm as TopicAdd));
                showSuccess('הנושא נוסף בהצלחה');
            }
            setTopicDialogOpen(false);
        } catch {
            setError('שגיאה בשמירת הנושא');
        }
    };

    const handleDeleteTopic = async (id: number) => {
        try {
            await dispatch(deleteTopicThunk(id));
            showSuccess('הנושא נמחק בהצלחה');
        } catch {
            setError('שגיאה במחיקת הנושא');
        } finally {
            setConfirmDelete(null);
        }
    };

    // ── Representative actions ────────────────────────────────────────────
    const handleDeleteRepresentative = async (id: number) => {
        try {
            await deleteRepresentative(id);
            showSuccess('הנציג נמחק בהצלחה');
            await loadRepresentatives();
        } catch {
            setError('שגיאה במחיקת הנציג');
        } finally {
            setConfirmDelete(null);
        }
    };

    // ── Approve / Deny ────────────────────────────────────────────────────
    const handleApprove = async (id: number) => {
        setActionLoadingId(id);
        try {
            await approveRepresentative(id);
            showSuccess('הנציג אושר בהצלחה והוא יכול כעת להתחבר למערכת');
            setWaitingReps(prev => prev.filter(r => r.idRepresentative !== id));
            await loadRepresentatives();
        } catch {
            setError('שגיאה באישור הנציג');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDeny = async (id: number) => {
        setActionLoadingId(id);
        try {
            await denyRepresentative(id);
            showSuccess('הנציג נדחה');
            setWaitingReps(prev => prev.filter(r => r.idRepresentative !== id));
        } catch {
            setError('שגיאה בדחיית הנציג');
        } finally {
            setActionLoadingId(null);
        }
    };

    // ── Customer actions ──────────────────────────────────────────────────
    const handleDeleteCustomer = async (id: number) => {
        try {
            await dispatch(deleteCustomerThunk(id));
            showSuccess('הלקוח נמחק בהצלחה');
        } catch {
            setError('שגיאה במחיקת הלקוח');
        } finally {
            setConfirmDelete(null);
        }
    };

    // ── Confirm delete dispatcher ─────────────────────────────────────────
    const handleConfirmDelete = () => {
        if (!confirmDelete) return;
        const { type, id } = confirmDelete;
        if (type === 'topic') handleDeleteTopic(id);
        else if (type === 'representative') handleDeleteRepresentative(id);
        else if (type === 'customer') handleDeleteCustomer(id);
    };

    // ── Logout ────────────────────────────────────────────────────────────
    const handleLogout = () => {
        localStorage.removeItem('representativeToken');
        localStorage.removeItem('representativeUser');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // ── Stats ─────────────────────────────────────────────────────────────
    
    const stats = {
        totalTopics: topics.length,
        totalRepresentatives: representatives.length,
        totalCustomers: customers.length,
        totalSessions: sessions.length,
        activeSessions: sessions.filter((s: ChatSession) => s.statusChat === 1).length,
        waitingSessions: sessions.filter((s: ChatSession) => s.statusChat === 0).length,
        onlineReps: representatives.filter((r:Representative)=>r.isOnline).length,   // RepresentativeChat לא מכיל isOnline — נשאר 0
        pendingApproval: waitingReps.length,
    };
    const getActualWaitTime = useCallback((session: ChatSession) => {
    // אם אין זמן תחילת שירות (ServiceStartTimestamp), סימן שהשיחה מעולם לא נענתה
    if (!session.serviceStartTimestamp) {
        return "—"; 
    }

    const start = new Date(session.startTimestamp).getTime();
    const service = new Date(session.serviceStartTimestamp).getTime();
    
    const diffInMs = service - start;
    
    // אם מסיבה כלשהי הזמן שלילי (באג בנתונים), נחזיר 0
    if (diffInMs < 0) return "0:00";

    const minutes = Math.floor(diffInMs / 60000);
    const seconds = Math.floor((diffInMs % 60000) / 1000);

    // מחזיר פורמט של MM:SS
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}, []);

    return {
        activeTab, setActiveTab,
        topics, representatives, waitingReps, customers, sessions,
        topicsLoading, repsLoading, waitingLoading, customersLoading, sessionsLoading,
        topicForm, setTopicForm,
        topicDialogOpen, setTopicDialogOpen,
        editingTopicId,
        openAddTopic, openEditTopic, handleSaveTopic,
        confirmDelete, setConfirmDelete, handleConfirmDelete,
        handleApprove, handleDeny, actionLoadingId,
        error, setError,
        successMsg,
        stats,
        handleLogout,
        getTopicName,
        getCustomerName,
        getRepName,
        getActualWaitTime,
    };
};