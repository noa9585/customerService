import React, { useEffect, useState } from 'react';
import { Topic, ChatSession } from '../types/chat';
import { chatService } from '../services/chatService';
import '../App.css';


const LandingPage: React.FC = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<number | string>('');
    const [session, setSession] = useState<ChatSession | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // טעינת נושאים בטעינת הדף
    useEffect(() => {
        chatService.getTopics()
            .then(res => {
                // בדיקה שהנתונים הם אכן מערך לפני שמעדכנים
                if (Array.isArray(res.data)) {
                    setTopics(res.data);
                } else {
                    console.error("השרת לא החזיר מערך:", res.data);
                    setError("נתוני הנושאים לא הגיעו בפורמט תקין");
                }
            })
            .catch(err => {
                console.error("שגיאה בתקשורת עם השרת:", err);
                setError("לא ניתן להתחבר לשרת. ודא שה-Backend רץ ושכתובת ה-API נכונה.");
            });
    }, []);

    // פונקציית Polling - עדכון זמן המתנה כל 15 שניות
    useEffect(() => {
        let interval: number;
        if (session && session.statusChat === 'Waiting') {
            interval = window.setInterval(() => {
                chatService.getWaitTime(session.sessionID)
                    .then(res => setSession(res.data))
                    .catch(err => console.error("Polling error", err));
            }, 15000);
        }
        return () => clearInterval(interval);
    }, [session]);

    const handleStartChat = async () => {
        if (!selectedTopic) return alert("נא לבחור נושא שיחה");
        setLoading(true);
        try {
            // לקוח לדוגמה מזהה 1
            const res = await chatService.startChat(1, Number(selectedTopic));
            setSession(res.data);
        } catch (err) {
            alert("שגיאה בחיבור לשרת");
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="chat-card">
        {/* לוגו */}
        <div className="logo-container">
            <div className="logo-icon">💬</div>
            <h1>SmartConnect</h1>
        </div>

        {!session ? (
            <>
                <p>בחר נושא שיחה ונחבר אותך לנציג המתאים ביותר עבורך תוך רגעים ספורים.</p>
                <div className="select-wrapper">
                    <select 
                        value={selectedTopic} 
                        onChange={(e) => setSelectedTopic(e.target.value)}
                    >
                        <option value="">בחר נושא פנייה...</option>
                        {topics.map(t => (
                            <option key={t.idTopic} value={t.idTopic}>
                                {t.nameTopic}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={handleStartChat} disabled={loading}>
                    {loading && <div className="spinner"></div>}
                    {loading ? 'מתחבר...' : 'הצטרפות לתור'}
                </button>
            </>
        ) : (
            <div className="waiting-room">
                <p>התחברת בהצלחה! הנציגים שלנו מעודכנים על פנייתך.</p>
                <div className="wait-time-container">
                    <span className="wait-number">{session.estimatedWaitTime}</span>
                    <span style={{color: '#64748b', fontWeight: 600}}>דקות המתנה משוערות</span>
                </div>
                <div className="status-indicator">
                    <div className="dot"></div>
                    ממתין למענה אנושי...
                </div>
            </div>
        )}
    </div>
);
};

export default LandingPage;