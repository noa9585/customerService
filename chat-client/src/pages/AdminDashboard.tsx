// AdminDashboard.tsx — לוח ניהול מלא עם CRUD לכל הישויות
import React from 'react';
import { useAdminDashboard, AdminTab } from '../hooks/Useadmindashboard.hook';
import { Topic } from '../types/topic.types';
import { Representative, RepresentativeChat } from '../types/representative.types';
import { CustomerChat } from '../types/customer.types';
import { ChatSession } from '../types/chatSession.types';
import '../styles/AdminDashboard.css'
const sessionStatusLabel = (status: number) => {
    switch (status) {
        case 0: return { label: 'ממתין', cls: 'badge-waiting' };
        case 1: return { label: 'פעיל', cls: 'badge-active' };
        case 2: return { label: 'סגור', cls: 'badge-closed' };
        case 3: return { label: 'בוטל', cls: 'badge-cancelled' };
        default: return { label: 'לא ידוע', cls: '' };
    }
};

const AdminDashboard: React.FC = () => {
    const {
        activeTab, setActiveTab,
        topics, representatives, customers, sessions,
        topicsLoading, repsLoading, customersLoading, sessionsLoading,
        topicForm, setTopicForm,
        topicDialogOpen, setTopicDialogOpen,
        editingTopicId,
        openAddTopic, openEditTopic,
        handleSaveTopic,
        confirmDelete, setConfirmDelete,
        handleConfirmDelete,
        error, setError,
        successMsg,
        stats,
        handleLogout,
        actionLoadingId,waitingLoading,waitingReps,handleApprove,handleDeny,
        getTopicName,      
        getCustomerName,   
        getRepName,
        getActualWaitTime,
    } = useAdminDashboard();

    const tabs: { id: AdminTab; label: string; icon: string; badge?: number }[] = [
        { id: 'overview', label: 'סקירה כללית', icon: '📊' },
        { id: 'topics', label: 'נושאי פנייה', icon: '📋' },
        { id: 'representatives', label: 'נציגים', icon: '👨‍💼' },
        { id: 'waiting', label: 'ממתינים לאישור', icon: '⏳', badge: stats.pendingApproval },
        { id: 'customers', label: 'לקוחות', icon: '👥' },
        { id: 'sessions', label: 'שיחות', icon: '💬' },
    ];

    return (
        <div className="admin-page" dir="rtl">

            {/* ── Sidebar ─────────────────────────────────────────────────────── */}
            <aside className="admin-sidebar">
                <div className="sidebar-logo">
                    <span className="sidebar-logo-icon">🛡️</span>
                    <span className="sidebar-logo-text">מנהל מערכת</span>
                </div>
                <nav className="sidebar-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`sidebar-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="sidebar-btn-icon">{tab.icon}</span>
                            <span>{tab.label}</span>
                            {/* badge אדום לנציגים ממתינים */}
                            {tab.badge != null && tab.badge > 0 && (
                                <span className="sidebar-badge">{tab.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>
                <button className="sidebar-logout" onClick={handleLogout}>🚪 התנתקות</button>
            </aside>

            {/* ── Main ────────────────────────────────────────────────────────── */}
            <main className="admin-main">

                {successMsg && <div className="flash flash-success">✅ {successMsg}</div>}
                {error && (
                    <div className="flash flash-error">
                        ⚠️ {error}
                        <button className="flash-close" onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {/* Overview */}
                {activeTab === 'overview' && (
                    <section className="tab-section">
                        <h2 className="section-title">סקירה כללית</h2>
                        <div className="overview-grid">
                            {[
                                { icon: '📋', value: stats.totalTopics, label: 'נושאי פנייה' },
                                { icon: '👨‍💼', value: stats.totalRepresentatives, label: 'נציגים רשומים' },
                                { icon: '🟢', value: stats.onlineReps, label: 'נציגים מחוברים' },
                                { icon: '👥', value: stats.totalCustomers, label: 'לקוחות רשומים' },
                                { icon: '⏳', value: stats.waitingSessions, label: 'ממתינים לנציג' },
                                { icon: '💬', value: stats.activeSessions, label: 'שיחות פעילות' },
                            ].map(({ icon, value, label, }) => (
                                <div key={label} className={`ov-card  ? 'ov-card-highlight' : ''}`}>
                                    <div className="ov-icon">{icon}</div>
                                    <div className="ov-value">{value}</div>
                                    <div className="ov-label">{label}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Topics */}
                {activeTab === 'topics' && (
                    <section className="tab-section">
                        <div className="section-header">
                            <h2 className="section-title">נושאי פנייה</h2>
                            <button className="btn-add" onClick={openAddTopic}>+ הוסף נושא</button>
                        </div>
                        {topicsLoading ? <Spinner /> : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>שם הנושא</th><th>זמן טיפול (דק׳)</th>
                                        <th>עדיפות</th><th>סה״כ שיחות</th><th>פעולות</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topics.length === 0
                                        ? <tr><td colSpan={6} className="td-empty">אין נושאים במערכת</td></tr>
                                        : topics.map((t: Topic) => (
                                            <tr key={t.idTopic}>
                                                <td className="td-name">{t.nameTopic}</td>
                                                <td>{t.averageTreatTime.toFixed(1)}</td>
                                                <td><PriorityStars value={t.priorityTopics} /></td>
                                                <td>{(t as any).totalSessionsCount ?? '—'}</td>
                                                <td className="td-actions">
                                                    <button className="btn-edit" onClick={() => openEditTopic(t)}>✏️ עריכה</button>
                                                    <button className="btn-delete" onClick={() => setConfirmDelete({ type: 'topic', id: t.idTopic })}>🗑️ מחיקה</button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        )}
                    </section>
                )}

                {/* Representatives */}
                {activeTab === 'representatives' && (
                    <section className="tab-section">
                        <div className="section-header">
                            <h2 className="section-title">נציגי שירות</h2>
                            <span className="section-count">{representatives.length} נציגים</span>
                        </div>
                        {repsLoading ? <Spinner /> : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>שם</th><th>אימייל</th>
                                        <th>ניקוד חודשי</th><th>סטטוס</th><th>עסוק</th><th>פעולות</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {representatives.length === 0
                                        ? <tr><td colSpan={7} className="td-empty">אין נציגים במערכת</td></tr>
                                        : representatives.map((r: Representative) => (
                                            <tr key={r.idRepresentative}>
                                                <td className="td-name">{r.nameRepr}</td>
                                                <td className="td-email">{r.emailRepr}</td>
                                                <td>🎉 {r.scoreForMonth}</td>
                                                <td>
                                                    <span className={`status-dot ${r.isOnline ? 'online' : 'offline'}`}>
                                                        {r.isOnline ? '🟢 מחובר' : '⭕ מנותק'}
                                                    </span>
                                                </td>
                                                <td>{r.isBusy ? '🔴 בשיחה' : '🟡 פנוי'}</td>
                                                <td className="td-actions">
                                                    <button className="btn-delete" onClick={() => setConfirmDelete({ type: 'representative', id: r.idRepresentative })}>
                                                        🗑️ מחיקה
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        )}
                    </section>
                )}
                {/* ── Waiting Representatives ───────────────────────────── */}
                {activeTab === 'waiting' && (
                    <section className="tab-section">
                        <div className="section-header">
                            <h2 className="section-title">נציגים ממתינים לאישור</h2>
                            <span className="section-count">{waitingReps.length} ממתינים</span>
                        </div>

                        {waitingReps.length === 0 && !waitingLoading && (
                            <div className="empty-state">
                                <div className="empty-icon">✅</div>
                                <p>אין נציגים ממתינים לאישור</p>
                            </div>
                        )}

                        {waitingLoading ? <Spinner /> : (
                            waitingReps.length > 0 && (
                                <div className="waiting-cards">
                                    {waitingReps.map((r: Representative) => (
                                        <div key={r.idRepresentative} className="waiting-card">
                                            <div className="waiting-card-avatar">
                                                {r.nameRepr.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="waiting-card-info">
                                                <div className="waiting-card-name">{r.nameRepr}</div>
                                                <div className="waiting-card-email">{r.emailRepr}</div>
                                                <span className="badge badge-waiting">ממתין לאישור</span>
                                            </div>
                                            <div className="waiting-card-actions">
                                                <button
                                                    className="btn-approve"
                                                    onClick={() => handleApprove(r.idRepresentative)}
                                                    disabled={actionLoadingId === r.idRepresentative}
                                                >
                                                    {actionLoadingId === r.idRepresentative ? '...' : '✅ אשר'}
                                                </button>
                                                <button
                                                    className="btn-deny"
                                                    onClick={() => handleDeny(r.idRepresentative)}
                                                    disabled={actionLoadingId === r.idRepresentative}
                                                >
                                                    {actionLoadingId === r.idRepresentative ? '...' : '❌ דחה'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </section>
                )}
                {/* Customers */}
                {activeTab === 'customers' && (
                    <section className="tab-section">
                        <div className="section-header">
                            <h2 className="section-title">לקוחות</h2>
                            <span className="section-count">{customers.length} לקוחות</span>
                        </div>
                        {customersLoading ? <Spinner /> : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>שם</th><th>אימייל</th>
                                        <th>סטטוס</th><th>מחובר?</th><th>פעולות</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.length === 0
                                        ? <tr><td colSpan={6} className="td-empty">אין לקוחות במערכת</td></tr>
                                        : customers.map((c: CustomerChat) => (
                                            <tr key={c.idCustomer}>
                                                <td className="td-name">{c.nameCust}</td>
                                                <td className="td-email">{c.emailCust}</td>
                                                <td>
                                                    <span className={`badge ${(c as any).statusCust !== false ? 'badge-active' : 'badge-cancelled'}`}>
                                                        {(c as any).statusCust !== false ? 'פעיל' : 'מושבת'}
                                                    </span>
                                                </td>
                                                <td>{c.isOnline ? '🟢 כן' : '⭕ לא'}</td>
                                                <td className="td-actions">
                                                    <button className="btn-delete" onClick={() => setConfirmDelete({ type: 'customer', id: c.idCustomer })}>
                                                        🗑️ מחיקה
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        )}
                    </section>
                )}

                {/* Sessions */}
                {activeTab === 'sessions' && (
                    <section className="tab-section">
                        <div className="section-header">
                            <h2 className="section-title">שיחות</h2>
                            <span className="section-count">{sessions.length} שיחות</span>
                        </div>
                        {sessionsLoading ? <Spinner /> : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>לקוח</th><th>נציג</th>
                                        <th>נושא</th><th>סטטוס</th><th>המתנה (דק׳)</th><th>נפתח</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.length === 0
                                        ? <tr><td colSpan={7} className="td-empty">אין שיחות במערכת</td></tr>
                                        : sessions.map((s: ChatSession) => {
                                            const { label, cls } = sessionStatusLabel(s.statusChat);
                                            return (
                                                <tr key={s.sessionID}>
                                                    <td>{getCustomerName(s.idCustomer)}</td>
                                                    <td>{getRepName(s.idRepresentative)}</td>
                                                    <td>{getTopicName(s.idTopic)}</td>
                                                    <td><span className={`badge ${cls}`}>{label}</span></td>
                                                    <td>{getActualWaitTime(s)}</td>
                                                    <td className="td-date">
                                                        {new Date(s.startTimestamp).toLocaleString('he-IL')}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        )}
                    </section>
                )}
            </main>

            {/* ── Topic modal ──────────────────────────────────────────────────── */}
            {topicDialogOpen && (
                <div className="modal-overlay" onClick={() => setTopicDialogOpen(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <h3 className="modal-title">
                            {editingTopicId !== null ? '✏️ עריכת נושא' : '➕ הוספת נושא חדש'}
                        </h3>

                        <div className="modal-field">
                            <label>שם הנושא *</label>
                            <input
                                type="text"
                                value={topicForm.nameTopic}
                                onChange={e => setTopicForm({ ...topicForm, nameTopic: e.target.value })}
                                placeholder="לדוגמה: תמיכה טכנית"
                                autoFocus
                            />
                        </div>
                        <div className="modal-field">
                            <label>זמן טיפול ממוצע (דקות)</label>
                            <input
                                type="number" min={1} max={120}
                                value={topicForm.averageTreatTime}
                                onChange={e => setTopicForm({ ...topicForm, averageTreatTime: Number(e.target.value) })}
                            />
                        </div>
                        <div className="modal-field">
                            <label>עדיפות (0-1)</label>
                            <input
                                type="range" min={0.1} max={1} step={0.1}
                                value={topicForm.priorityTopics}
                                onChange={e => setTopicForm({ ...topicForm, priorityTopics: Number(e.target.value) })}
                            />
                            <div className="range-labels" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                <span>0(גבוהה)</span>
                                <span>0.2</span>
                                <span>0.4</span>
                                <span>0.6</span>
                                <span>0.8</span>
                                <span>1 (נמוכה)</span>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-primary-modal" onClick={handleSaveTopic}>
                                {editingTopicId !== null ? 'שמור שינויים' : 'הוסף נושא'}
                            </button>
                            <button className="btn-cancel-modal" onClick={() => setTopicDialogOpen(false)}>ביטול</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Confirm delete modal ─────────────────────────────────────────── */}
            {confirmDelete && (
                <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
                    <div className="modal-card modal-card-danger" onClick={e => e.stopPropagation()}>
                        <div className="danger-icon">⚠️</div>
                        <h3 className="modal-title">אישור מחיקה</h3>
                        <p className="modal-body-text">האם אתה בטוח? פעולה זו אינה ניתנת לביטול.</p>
                        <div className="modal-actions">
                            <button className="btn-danger-modal" onClick={handleConfirmDelete}>כן, מחק</button>
                            <button className="btn-cancel-modal" onClick={() => setConfirmDelete(null)}>ביטול</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Small helpers ──────────────────────────────────────────────────────────

const Spinner: React.FC = () => (
    <div className="loading-spinner"><div className="spinner" /></div>
);

const PriorityStars: React.FC<{ value: number }> = ({ value }) => {
    const starsCount = Math.round(5.5 - (5 * value));
    const finalStars = Math.max(1, Math.min(starsCount, 5));
    return (
        <span className="priority-badge">
            {'⭐'.repeat(finalStars)}
            <span className="priority-num">({value})</span>
        </span>
    );
};

export default AdminDashboard;



// // AdminDashboard.tsx — עם tab נציגים ממתינים לאישור
// import React from 'react';
// import { useAdminDashboard, AdminTab } from '../hooks/Useadmindashboard.hook';
// import { Topic } from '../types/topic.types';
// import { Representative, RepresentativeChat } from '../types/representative.types';
// import { CustomerChat } from '../types/customer.types';
// import { ChatSession } from '../types/chatSession.types';
// import '../styles/AdminDashboard.css';

// const sessionStatusLabel = (status: number) => {
//     switch (status) {
//         case 0: return { label: 'ממתין', cls: 'badge-waiting' };
//         case 1: return { label: 'פעיל', cls: 'badge-active' };
//         case 2: return { label: 'סגור', cls: 'badge-closed' };
//         case 3: return { label: 'בוטל', cls: 'badge-cancelled' };
//         default: return { label: 'לא ידוע', cls: '' };
//     }
// };

// const Spinner: React.FC = () => (
//     <div className="loading-spinner"><div className="spinner" /></div>
// );

// const PriorityStars: React.FC<{ value: number }> = ({ value }) => (
//     <span className="priority-badge">
//         {'⭐'.repeat(Math.min(Math.round(value), 5))}
//         <span className="priority-num">({value})</span>
//     </span>
// );

// const AdminDashboard: React.FC = () => {
//     const {
//         activeTab, setActiveTab,
//         topics, representatives, waitingReps, customers, sessions,
//         topicsLoading, repsLoading, waitingLoading, customersLoading, sessionsLoading,
//         topicForm, setTopicForm,
//         topicDialogOpen, setTopicDialogOpen,
//         editingTopicId,
//         openAddTopic, openEditTopic, handleSaveTopic,
//         confirmDelete, setConfirmDelete, handleConfirmDelete,
//         handleApprove, handleDeny, actionLoadingId,
//         error, setError,
//         successMsg,
//         stats,
//         handleLogout,
//     } = useAdminDashboard();

//     const tabs: { id: AdminTab; label: string; icon: string; badge?: number }[] = [
//         { id: 'overview',        label: 'סקירה כללית',      icon: '📊' },
//         { id: 'topics',          label: 'נושאי פנייה',      icon: '📋' },
//         { id: 'representatives', label: 'נציגים',            icon: '👨‍💼' },
//         { id: 'waiting',         label: 'ממתינים לאישור',   icon: '⏳', badge: stats.pendingApproval },
//         { id: 'customers',       label: 'לקוחות',            icon: '👥' },
//         { id: 'sessions',        label: 'שיחות',             icon: '💬' },
//     ];

//     return (
//         <div className="admin-page" dir="rtl">

//             {/* ── Sidebar ───────────────────────────────────────────────── */}
//             <aside className="admin-sidebar">
//                 <div className="sidebar-logo">
//                     <span className="sidebar-logo-icon">🛡️</span>
//                     <span className="sidebar-logo-text">מנהל מערכת</span>
//                 </div>
//                 <nav className="sidebar-nav">
//                     {tabs.map(tab => (
//                         <button
//                             key={tab.id}
//                             className={`sidebar-btn ${activeTab === tab.id ? 'active' : ''}`}
//                             onClick={() => setActiveTab(tab.id)}
//                         >
//                             <span className="sidebar-btn-icon">{tab.icon}</span>
//                             <span>{tab.label}</span>
//                             {/* badge אדום לנציגים ממתינים */}
//                             {tab.badge != null && tab.badge > 0 && (
//                                 <span className="sidebar-badge">{tab.badge}</span>
//                             )}
//                         </button>
//                     ))}
//                 </nav>
//                 <button className="sidebar-logout" onClick={handleLogout}>🚪 התנתקות</button>
//             </aside>

//             {/* ── Main ──────────────────────────────────────────────────── */}
//             <main className="admin-main">

//                 {successMsg && <div className="flash flash-success">✅ {successMsg}</div>}
//                 {error && (
//                     <div className="flash flash-error">
//                         ⚠️ {error}
//                         <button className="flash-close" onClick={() => setError(null)}>×</button>
//                     </div>
//                 )}

//                 {/* ── Overview ─────────────────────────────────────────── */}
//                 {activeTab === 'overview' && (
//                     <section className="tab-section">
//                         <h2 className="section-title">סקירה כללית</h2>
//                         <div className="overview-grid">
//                             {[
//                                 { icon: '📋', value: stats.totalTopics,        label: 'נושאי פנייה' },
//                                 { icon: '👨‍💼', value: stats.totalRepresentatives, label: 'נציגים פעילים' },
//                                 { icon: '🟢', value: stats.onlineReps,         label: 'נציגים מחוברים', hi: true },
//                                 { icon: '👥', value: stats.totalCustomers,     label: 'לקוחות רשומים' },
//                                 { icon: '⏳', value: stats.waitingSessions,    label: 'ממתינים לנציג',  hi: true },
//                                 { icon: '🔔', value: stats.pendingApproval,    label: 'ממתינים לאישור', hi: stats.pendingApproval > 0 },
//                             ].map(({ icon, value, label, hi }) => (
//                                 <div key={label} className={`ov-card ${hi ? 'ov-card-highlight' : ''}`}>
//                                     <div className="ov-icon">{icon}</div>
//                                     <div className="ov-value">{value}</div>
//                                     <div className="ov-label">{label}</div>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 )}

//                 {/* ── Topics ───────────────────────────────────────────── */}
//                 {activeTab === 'topics' && (
//                     <section className="tab-section">
//                         <div className="section-header">
//                             <h2 className="section-title">נושאי פנייה</h2>
//                             <button className="btn-add" onClick={openAddTopic}>+ הוסף נושא</button>
//                         </div>
//                         {topicsLoading ? <Spinner /> : (
//                             <table className="admin-table">
//                                 <thead>
//                                     <tr>
//                                         <th>#</th><th>שם הנושא</th><th>זמן טיפול (דק׳)</th>
//                                         <th>עדיפות</th><th>סה״כ שיחות</th><th>פעולות</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {topics.length === 0
//                                         ? <tr><td colSpan={6} className="td-empty">אין נושאים במערכת</td></tr>
//                                         : topics.map((t: Topic) => (
//                                             <tr key={t.idTopic}>
//                                                 <td className="td-id">{t.idTopic}</td>
//                                                 <td className="td-name">{t.nameTopic}</td>
//                                                 <td>{t.averageTreatTime.toFixed(1)}</td>
//                                                 <td><PriorityStars value={t.priorityTopics} /></td>
//                                                 <td>{(t as any).totalSessionsCount ?? '—'}</td>
//                                                 <td className="td-actions">
//                                                     <button className="btn-edit" onClick={() => openEditTopic(t)}>✏️ עריכה</button>
//                                                     <button className="btn-delete" onClick={() => setConfirmDelete({ type: 'topic', id: t.idTopic })}>🗑️ מחיקה</button>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     }
//                                 </tbody>
//                             </table>
//                         )}
//                     </section>
//                 )}

//                 {/* ── Representatives ──────────────────────────────────── */}
//                 {activeTab === 'representatives' && (
//                     <section className="tab-section">
//                         <div className="section-header">
//                             <h2 className="section-title">נציגי שירות פעילים</h2>
//                             <span className="section-count">{representatives.length} נציגים</span>
//                         </div>
//                         {repsLoading ? <Spinner /> : (
//                             <table className="admin-table">
//                                 <thead>
//                                     <tr>
//                                         <th>#</th><th>שם</th><th>תפקיד</th><th>פעולות</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {representatives.length === 0
//                                         ? <tr><td colSpan={4} className="td-empty">אין נציגים במערכת</td></tr>
//                                         : representatives.map((r: RepresentativeChat) => (
//                                             <tr key={r.idRepresentative}>
//                                                 <td className="td-id">{r.idRepresentative}</td>
//                                                 <td className="td-name">{r.nameRepr}</td>
//                                                 <td>{r.role}</td>
//                                                 <td className="td-actions">
//                                                     <button className="btn-delete" onClick={() => setConfirmDelete({ type: 'representative', id: r.idRepresentative })}>
//                                                         🗑️ מחיקה
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     }
//                                 </tbody>
//                             </table>
//                         )}
//                     </section>
//                 )}

//                 {/* ── Waiting Representatives ───────────────────────────── */}
//                 {activeTab === 'waiting' && (
//                     <section className="tab-section">
//                         <div className="section-header">
//                             <h2 className="section-title">נציגים ממתינים לאישור</h2>
//                             <span className="section-count">{waitingReps.length} ממתינים</span>
//                         </div>

//                         {waitingReps.length === 0 && !waitingLoading && (
//                             <div className="empty-state">
//                                 <div className="empty-icon">✅</div>
//                                 <p>אין נציגים ממתינים לאישור</p>
//                             </div>
//                         )}

//                         {waitingLoading ? <Spinner /> : (
//                             waitingReps.length > 0 && (
//                                 <div className="waiting-cards">
//                                     {waitingReps.map((r: RepresentativeChat) => (
//                                         <div key={r.idRepresentative} className="waiting-card">
//                                             <div className="waiting-card-avatar">
//                                                 {r.nameRepr.charAt(0).toUpperCase()}
//                                             </div>
//                                             <div className="waiting-card-info">
//                                                 <div className="waiting-card-name">{r.nameRepr}</div>
//                                                 <span className="badge badge-waiting">ממתין לאישור</span>
//                                             </div>
//                                             <div className="waiting-card-actions">
//                                                 <button
//                                                     className="btn-approve"
//                                                     onClick={() => handleApprove(r.idRepresentative)}
//                                                     disabled={actionLoadingId === r.idRepresentative}
//                                                 >
//                                                     {actionLoadingId === r.idRepresentative ? '...' : '✅ אשר'}
//                                                 </button>
//                                                 <button
//                                                     className="btn-deny"
//                                                     onClick={() => handleDeny(r.idRepresentative)}
//                                                     disabled={actionLoadingId === r.idRepresentative}
//                                                 >
//                                                     {actionLoadingId === r.idRepresentative ? '...' : '❌ דחה'}
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )
//                         )}
//                     </section>
//                 )}

//                 {/* ── Customers ─────────────────────────────────────────── */}
//                 {activeTab === 'customers' && (
//                     <section className="tab-section">
//                         <div className="section-header">
//                             <h2 className="section-title">לקוחות</h2>
//                             <span className="section-count">{customers.length} לקוחות</span>
//                         </div>
//                         {customersLoading ? <Spinner /> : (
//                             <table className="admin-table">
//                                 <thead>
//                                     <tr>
//                                         <th>#</th><th>שם</th><th>אימייל</th>
//                                         <th>סטטוס</th><th>מחובר?</th><th>פעולות</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {customers.length === 0
//                                         ? <tr><td colSpan={6} className="td-empty">אין לקוחות במערכת</td></tr>
//                                         : customers.map((c: CustomerChat) => (
//                                             <tr key={c.idCustomer}>
//                                                 <td className="td-id">{c.idCustomer}</td>
//                                                 <td className="td-name">{c.nameCust}</td>
//                                                 <td className="td-email">{c.emailCust}</td>
//                                                 <td>
//                                                     <span className={`badge ${(c as any).statusCust !== false ? 'badge-active' : 'badge-cancelled'}`}>
//                                                         {(c as any).statusCust !== false ? 'פעיל' : 'מושבת'}
//                                                     </span>
//                                                 </td>
//                                                 <td>{c.isOnline ? '🟢 כן' : '⭕ לא'}</td>
//                                                 <td className="td-actions">
//                                                     <button className="btn-delete" onClick={() => setConfirmDelete({ type: 'customer', id: c.idCustomer })}>
//                                                         🗑️ מחיקה
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     }
//                                 </tbody>
//                             </table>
//                         )}
//                     </section>
//                 )}

//                 {/* ── Sessions ──────────────────────────────────────────── */}
//                 {activeTab === 'sessions' && (
//                     <section className="tab-section">
//                         <div className="section-header">
//                             <h2 className="section-title">שיחות</h2>
//                             <span className="section-count">{sessions.length} שיחות</span>
//                         </div>
//                         {sessionsLoading ? <Spinner /> : (
//                             <table className="admin-table">
//                                 <thead>
//                                     <tr>
//                                         <th>#</th><th>לקוח</th><th>נציג</th>
//                                         <th>נושא</th><th>סטטוס</th><th>המתנה (דק׳)</th><th>נפתח</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {sessions.length === 0
//                                         ? <tr><td colSpan={7} className="td-empty">אין שיחות במערכת</td></tr>
//                                         : sessions.map((s: ChatSession) => {
//                                             const { label, cls } = sessionStatusLabel(s.statusChat);
//                                             return (
//                                                 <tr key={s.sessionID}>
//                                                     <td className="td-id">{s.sessionID}</td>
//                                                     <td>{s.idCustomer}</td>
//                                                     <td>{s.idRepresentative ?? '—'}</td>
//                                                     <td>{s.idTopic}</td>
//                                                     <td><span className={`badge ${cls}`}>{label}</span></td>
//                                                     <td>{s.estimatedWaitTime.toFixed(1)}</td>
//                                                     <td className="td-date">
//                                                         {new Date(s.startTimestamp).toLocaleString('he-IL')}
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })
//                                     }
//                                 </tbody>
//                             </table>
//                         )}
//                     </section>
//                 )}
//             </main>

//             {/* ── Topic modal ───────────────────────────────────────────── */}
//             {topicDialogOpen && (
//                 <div className="modal-overlay" onClick={() => setTopicDialogOpen(false)}>
//                     <div className="modal-card" onClick={e => e.stopPropagation()}>
//                         <h3 className="modal-title">
//                             {editingTopicId !== null ? '✏️ עריכת נושא' : '➕ הוספת נושא חדש'}
//                         </h3>
//                         <div className="modal-field">
//                             <label>שם הנושא *</label>
//                             <input
//                                 type="text"
//                                 value={topicForm.nameTopic}
//                                 onChange={e => setTopicForm({ ...topicForm, nameTopic: e.target.value })}
//                                 placeholder="לדוגמה: תמיכה טכנית"
//                                 autoFocus
//                             />
//                         </div>
//                         <div className="modal-field">
//                             <label>זמן טיפול ממוצע (דקות)</label>
//                             <input
//                                 type="number" min={1} max={120}
//                                 value={topicForm.averageTreatTime}
//                                 onChange={e => setTopicForm({ ...topicForm, averageTreatTime: Number(e.target.value) })}
//                             />
//                         </div>
//                         <div className="modal-field">
//                             <label>עדיפות (1–5)</label>
//                             <input
//                                 type="number" min={1} max={5} step={0.1}
//                                 value={topicForm.priorityTopics}
//                                 onChange={e => setTopicForm({ ...topicForm, priorityTopics: Number(e.target.value) })}
//                             />
//                             <span className="field-hint">1 = נמוכה, 5 = גבוהה</span>
//                         </div>
//                         <div className="modal-actions">
//                             <button className="btn-primary-modal" onClick={handleSaveTopic}>
//                                 {editingTopicId !== null ? 'שמור שינויים' : 'הוסף נושא'}
//                             </button>
//                             <button className="btn-cancel-modal" onClick={() => setTopicDialogOpen(false)}>ביטול</button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ── Confirm delete modal ──────────────────────────────────── */}
//             {confirmDelete && (
//                 <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
//                     <div className="modal-card modal-card-danger" onClick={e => e.stopPropagation()}>
//                         <div className="danger-icon">⚠️</div>
//                         <h3 className="modal-title">אישור מחיקה</h3>
//                         <p className="modal-body-text">האם אתה בטוח? פעולה זו אינה ניתנת לביטול.</p>
//                         <div className="modal-actions">
//                             <button className="btn-danger-modal" onClick={handleConfirmDelete}>כן, מחק</button>
//                             <button className="btn-cancel-modal" onClick={() => setConfirmDelete(null)}>ביטול</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdminDashboard;