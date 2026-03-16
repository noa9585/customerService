// useAdminDashboard_hook.ts — ניהול מנהל מלא עם CRUD לכל הישויות
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/index';

// Topics
import {
  fetchTopics,
  addTopicThunk,
  updateTopicThunk,
  deleteTopicThunk,
} from '../store/slices/Topic.slice';
import { Topic, TopicAdd } from '../types/topic.types';

// Representatives
import {
  fetchRepresentativeById,
} from '../store/slices/Representative.slice';
import { getAllRepresentatives, deleteRepresentative } from '../services/representative.service';
import { Representative } from '../types/representative.types';

// Customers
import { fetchCustomers, deleteCustomerThunk } from '../store/slices/Customerslice';
import { CustomerChat } from '../types/customer.types';

// Chat Sessions
import { fetchSessions } from '../store/slices/Chatsession.slice';
import { ChatSession } from '../types/chatSession.types';

// ── Types ─────────────────────────────────────────────────────────────────────

export type AdminTab = 'overview' | 'topics' | 'representatives' | 'customers' | 'sessions';

export type TopicFormData = {
  nameTopic: string;
  averageTreatTime: number;
  priorityTopics: number;
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useAdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // ── Tab state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // ── Redux state ───────────────────────────────────────────────────────────
  const { topics, loading: topicsLoading } = useSelector((s: RootState) => s.topic);
  const { sessions, loading: sessionsLoading } = useSelector((s: RootState) => s.chatSession);
  const { customers, loading: customersLoading } = useSelector((s: RootState) => s.customer);

  // נציגים — נשמרים ב-local state כי ה-slice הנוכחי מכיל נציג בודד
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [repsLoading, setRepsLoading] = useState(false);

  // ── Topic form state ───────────────────────────────────────────────────────
  const [topicForm, setTopicForm] = useState<TopicFormData>({
    nameTopic: '',
    averageTreatTime: 10,
    priorityTopics: 1,
  });
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);

  // ── General UI state ───────────────────────────────────────────────────────
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: number } | null>(null);

  // ── Load data on tab change ────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === 'topics' || activeTab === 'overview') {
      dispatch(fetchTopics());
    }
    if (activeTab === 'customers' || activeTab === 'overview') {
      dispatch(fetchCustomers());
    }
    if (activeTab === 'sessions' || activeTab === 'overview') {
      dispatch(fetchSessions());
    }
    if (activeTab === 'representatives' || activeTab === 'overview') {
      loadRepresentatives();
    }
  }, [activeTab, dispatch]);

  const loadRepresentatives = async () => {
    setRepsLoading(true);
    try {
      const data = await getAllRepresentatives();
      setRepresentatives(data as unknown as Representative[]);
    } catch {
      setError('שגיאה בטעינת נציגים');
    } finally {
      setRepsLoading(false);
    }
  };

  // ── Flash message helper ───────────────────────────────────────────────────
  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // ── Topic CRUD ─────────────────────────────────────────────────────────────

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
    if (!topicForm.nameTopic.trim()) {
      setError('שם הנושא הוא שדה חובה');
      return;
    }
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

  // ── Representative actions ─────────────────────────────────────────────────

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

  // ── Customer actions ───────────────────────────────────────────────────────

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

  // ── Confirm delete dispatcher ──────────────────────────────────────────────

  const handleConfirmDelete = () => {
    if (!confirmDelete) return;
    const { type, id } = confirmDelete;
    if (type === 'topic') handleDeleteTopic(id);
    else if (type === 'representative') handleDeleteRepresentative(id);
    else if (type === 'customer') handleDeleteCustomer(id);
  };

  // ── Logout ─────────────────────────────────────────────────────────────────

  const handleLogout = () => {
    localStorage.removeItem('representativeToken');
    localStorage.removeItem('representativeUser');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin-login');
  };

  // ── Stats for overview ─────────────────────────────────────────────────────

  const stats = {
    totalTopics: topics.length,
    totalRepresentatives: representatives.length,
    totalCustomers: customers.length,
    totalSessions: sessions.length,
    activeSessions: sessions.filter((s: ChatSession) => s.statusChat === 1).length,
    waitingSessions: sessions.filter((s: ChatSession) => s.statusChat === 0).length,
    onlineReps: representatives.filter((r: Representative) => r.isOnline).length,
    busyReps: representatives.filter((r: Representative) => r.isBusy).length,
  };

  return {
    // Tab
    activeTab, setActiveTab,
    // Data
    topics, representatives, customers, sessions,
    // Loading
    topicsLoading, repsLoading, customersLoading, sessionsLoading,
    // Topic form
    topicForm, setTopicForm,
    topicDialogOpen, setTopicDialogOpen,
    editingTopicId,
    openAddTopic, openEditTopic,
    handleSaveTopic,
    // Delete
    confirmDelete, setConfirmDelete,
    handleConfirmDelete,
    // UI
    error, setError,
    successMsg,
    // Stats
    stats,
    // Logout
    handleLogout,
  };
};