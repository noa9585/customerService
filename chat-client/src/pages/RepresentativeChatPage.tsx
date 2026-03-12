import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat.hook';
import ChatSection from '../sections/Chat/Chat.section';

const RepresentativeChatPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const sessionId = location.state?.sessionId;

    const { messages, loading, sendMessage } = useChat(sessionId, 'Representative');

    const handleCloseChat = async () => {
        // כאן תוסיפי קריאה לשרת לסגירת שיחה (עדכון סטטוס ל-Closed)
        if(window.confirm("האם אתה בטוח שברצונך לסגור את השיחה?")) {
            // _chatSessionService.updateStatus(sessionId, 'Closed');
            navigate('/dashboard');
        }
    };

    if (!sessionId) return <div>שיחה לא נמצאה...</div>;

    return (
        <ChatSection 
            messages={messages}
            onSendMessage={sendMessage}
            onCloseChat={handleCloseChat}
            myType="Representative" // הנציג רואה את עצמו כ-Representative
            otherPartyName="לקוח"
            isRepresentative={true}
        />
    );
};

export default RepresentativeChatPage;