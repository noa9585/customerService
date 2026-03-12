import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat.hook';
import { SenderType } from '../types/chatMessage.types';
import ChatSection from '../sections/Chat/Chat.section';

const CustomerChatPage: React.FC =  () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // הלקוח בדרך כלל מקבל את ה-sessionId אחרי שהוא פותח פנייה חדשה
    const sessionId = location.state?.sessionId;

    const { messages, loading, sendMessage,  customerName, representativeName} = useChat(sessionId, SenderType.Customer);

    if (!sessionId) {
        return <div style={{padding: '20px', textAlign: 'center'}}>טוען שיחה...</div>;
    }

    return (
        <ChatSection 
            messages={messages}
            onSendMessage={sendMessage}
            myType={SenderType.Customer} // הלקוח רואה את עצמו כ-Customer
            myName={customerName}
            otherPartyName={representativeName }
            isRepresentative={false} // אין לו כפתור סגירת שיחה
        />
    );
};

export default CustomerChatPage;