import React, { useEffect, useState } from 'react';
import '../styles/NewChat.css';
import { useNewChatForm } from '../hooks/useNewChatForm';
import { chatService } from '../services/chatService';
import { Topic } from '../types/chat';


const NewChat: React.FC = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [error1, setError] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<number | string>('');

    const { form, loading, error, handleChange, handleSubmit } = useNewChatForm((data) => {
        // optional place for success side-effects (analytics, navigate, toast...)
        alert('הבקשה נשלחה — נציג יחזור אליך בהקדם');
    });

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
    return (
        <div className="newchat-page">
            <div className="newchat-container">
                <h1 className="nc-title">פתח שיחה חדשה</h1>
                <p className="nc-sub">מלא את הפרטים ונחבר אותך לנציג בהקדם</p>

                <form className="nc-card" onSubmit={handleSubmit} dir="rtl">
                    <div className="nc-row two-cols">
                        <label className="nc-label">
                            שם מלא
                            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="הזן את שמך" required />
                        </label>

                        <label className="nc-label">
                            אימייל
                            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                        </label>
                    </div>

                    <label className="nc-label">
                        נושא הפנייה
                        
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
                    </label>

                    <label className="nc-label">
                        הודעה (אופציונלי)
                        <textarea name="message" value={form.message} onChange={handleChange} placeholder="תאר בקצרה את הפנייה שלך..." />
                    </label>

                    {error && <p style={{ color: 'red', fontSize: 14 }}>{error}</p>}

                    <button className="nc-submit" type="submit" disabled={loading}>
                        {loading ? 'שולח...' : 'הצטרף לתור ✉️'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewChat;
