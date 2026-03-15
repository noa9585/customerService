import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat.hook';
import { SenderType } from '../types/chatMessage.types';
import ChatSection from '../sections/Chat/Chat.section';
import { RootState, AppDispatch } from '../store/index';
import { CustomerChat } from '../types/customer.types';
import { fetchRepresentativeByIdForChat } from '../store/slices/Representative.slice';
import { fetchSessionById } from '../store/slices/Chatsession.slice';

const CustomerChatPage: React.FC = () => {
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const sessionId = location.state?.sessionId;

    const { messages, sendMessage } = useChat(sessionId, SenderType.Customer);

    // ✅ שליפת ה-session כדי לדעת מי הנציג
    useEffect(() => {
        if (sessionId) dispatch(fetchSessionById(sessionId));
    }, [sessionId, dispatch]);

    // שם הלקוח מה-Store
    const { user } = useSelector((state: RootState) => state.auth);
    const cust = user as CustomerChat | null;
    const customerName = cust?.nameCust || 'אתה';

    // שם הנציג — שליפה אחרי שה-session הגיע
    const { activeSession } = useSelector((state: RootState) => state.chatSession);
    const { selectedRepresentative } = useSelector((state: RootState) => state.representative);

    useEffect(() => {
        if (activeSession?.idRepresentative) {
            dispatch(fetchRepresentativeByIdForChat(activeSession.idRepresentative));
        }
    }, [activeSession?.idRepresentative, dispatch]);

    const representativeName = selectedRepresentative?.nameRepr || 'נציג שירות';

    if (!sessionId) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>טוען שיחה...</div>;
    }

    return (
        <ChatSection
            messages={messages}
            onSendMessage={sendMessage}
            myType={SenderType.Customer}
            myName={customerName}
            otherPartyName={representativeName}
            isRepresentative={false}
        />
    );
};

export default CustomerChatPage;