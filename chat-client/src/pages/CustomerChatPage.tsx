import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat.hook';
import ChatSection from '../sections/Chat/Chat.section';

const CustomerChatPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // הלקוח בדרך כלל מקבל את ה-sessionId אחרי שהוא פותח פנייה חדשה
    const sessionId = location.state?.sessionId;

    const { messages, loading, sendMessage } = useChat(sessionId, 'Customer');

    if (!sessionId) {
        return <div style={{padding: '20px', textAlign: 'center'}}>טוען שיחה...</div>;
    }

    return (
        <ChatSection 
            messages={messages}
            onSendMessage={sendMessage}
            myType="Customer" // הלקוח רואה את עצמו כ-Customer
            otherPartyName="נציג שירות"
            isRepresentative={false} // אין לו כפתור סגירת שיחה
        />
    );
};

export default CustomerChatPage;