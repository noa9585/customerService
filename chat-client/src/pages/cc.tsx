import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat.hook'; // וודא שהנתיב נכון
import ChatSection from './c'; // וודא שהנתיב נכון
import './c.css';

const ChatPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. שליפת ה-sessionId שעבר ב-navigate מהדאשבורד
    const sessionId = location.state?.sessionId;

    // 2. הפעלת ה-Hook (אנחנו מציינים שזה ה-Representative כי זה דף הנציג)
    const { messages, loading, sending, error, sendMessage } = useChat(sessionId, 0);

    // הגנה: אם אין sessionId (למשל ריענון דף), נחזור לדאשבורד
    if (!sessionId) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>לא נמצאה שיחה פעילה.</p>
                <button onClick={() => navigate('/dashboard')}>חזרה לדאשבורד</button>
            </div>
        );
    }

    return (
        <div className="chat-page-wrapper">
            <header className="chat-header">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>←</button>
                <h2>צ'אט עם לקוח (שיחה #{sessionId})</h2>
            </header>

            {loading ? (
                <div className="loader">טוען הודעות...</div>
            ) : error ? (
                <div className="error-msg">{error}</div>
            ) : (
                <ChatSection 
                    messages={messages} 
                    onSendMessage={sendMessage} 
                    sending={sending}
                    currentUserType="Representative"
                />
            )}
        </div>
    );
};

export default ChatPage;