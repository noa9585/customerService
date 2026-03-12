import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat.hook';
import { SenderType } from '../types/chatMessage.types';
import ChatSection from '../sections/Chat/Chat.section';

const RepresentativeChatPage: React.FC =  () => {
    const location = useLocation();
    const navigate = useNavigate();
    const sessionId = location.state?.sessionId;

    const { messages, loading, sendMessage, customerName, representativeName,closeSession} = useChat(sessionId, SenderType.Representative);

   

    if (!sessionId) return <div>שיחה לא נמצאה...</div>;

    return (
        <ChatSection 
            messages={messages}
            onSendMessage={sendMessage}
            onCloseChat={closeSession}
            myType={SenderType.Representative} // הנציג רואה את עצמו כ-Representative
            myName={representativeName}
            otherPartyName={customerName }
            isRepresentative={true}
        />
    );
};





export default RepresentativeChatPage;