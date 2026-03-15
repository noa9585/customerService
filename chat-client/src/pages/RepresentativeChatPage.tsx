import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useChat } from '../hooks/useChat.hook';
import { SenderType } from '../types/chatMessage.types';
import ChatSection from '../sections/Chat/Chat.section';
import { RootState, AppDispatch } from '../store/index';
import { Representative } from '../types/representative.types';
import { fetchCustomerById } from '../store/slices/Customerslice';

const RepresentativeChatPage: React.FC = () => {
    const location = useLocation();
    const sessionId = location.state?.sessionId;
    const dispatch = useDispatch<AppDispatch>();

    const { messages, loading, sendMessage, closeSession } = useChat(sessionId, SenderType.Representative);

    // שם הנציג מה-Store
    const { user } = useSelector((state: RootState) => state.auth);
    const rep = user as Representative | null;
    const representativeName = rep?.nameRepr || 'אתה';

    // שליפת שם הלקוח האמיתי מהשרת לפי ID
    const { activeSession } = useSelector((state: RootState) => state.chatSession);
    const { selectedCustomer } = useSelector((state: RootState) => state.customer);

    useEffect(() => {
        if (activeSession?.idCustomer) {
            dispatch(fetchCustomerById(activeSession.idCustomer));
        }
    }, [activeSession?.idCustomer, dispatch]);

    const customerName = selectedCustomer?.nameCust || 'הלקוח';

    if (!sessionId) return <div>שיחה לא נמצאה...</div>;

    return (
        <ChatSection
            messages={messages}
            onSendMessage={sendMessage}
            onCloseChat={closeSession}
            myType={SenderType.Representative}
            myName={representativeName}
            otherPartyName={customerName}
            isRepresentative={true}
        />
    );
};

export default RepresentativeChatPage;