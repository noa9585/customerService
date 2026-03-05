import { useEffect, useState } from 'react';
import { Topic, ChatSession } from '../types/chat';
import { chatService } from '../services/chatService';

const CustomerPage = () => {
    // אתחול כרשימה ריקה כדי למנוע את שגיאת ה-map
    const [topics, setTopics] = useState<Topic[]>([]); 
    const [selectedTopic, setSelectedTopic] = useState<number | string>('');
    const [session, setSession] = useState<ChatSession | null>(null);
    const [error, setError] = useState<string | null>(null);

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

    const handleStartChat = async () => {
        if (!selectedTopic) return alert("נא לבחור נושא");
        try {
            const res = await chatService.startChat(1, Number(selectedTopic));
            setSession(res.data);
        } catch (err) {
            alert("שגיאה בפתיחת השיחה");
        }
    };

    if (error) return <div style={{color: 'red', padding: '20px'}}>{error}</div>;

    return (
        <div style={{ padding: '20px', direction: 'rtl' }}>
            <h1>שירות לקוחות חכם</h1>
            {!session ? (
                <div>
                    <h3>בחר נושא לפנייה:</h3>
                    <select 
                        value={selectedTopic} 
                        onChange={(e) => setSelectedTopic(e.target.value)}
                    >
                        <option value="">-- בחר נושא --</option>
                        {/* שימוש ב-optional chaining כדי למנוע קריסה */}
                        {topics?.map(t => (
                            <option key={t.idTopic} value={t.idTopic}>
                                {t.nameTopic}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleStartChat}>התחל שיחה</button>
                </div>
            ) : (
                <div style={{ border: '1px solid green', padding: '10px' }}>
                    <h2>אתה בתור!</h2>
                    <p>זמן המתנה משוער: {session.estimatedWaitTime} דקות</p>
                </div>
            )}
        </div>
    );
};

export default CustomerPage;