import { useState, useEffect } from 'react';
import { ChatMessageSend } from '../types/chatMessage.types';   
import { getMessageBySessionId, addMessage } from '../services/chatMessage.service';
export const useChat = (sessionId: number, senderType: 0| 1) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. טעינת היסטוריית ההודעות
    const loadHistory = async () => {
        try {
            setLoading(true);
            const response = await getMessageBySessionId(sessionId);
            setMessages(response);
        } catch (err) {
            setError("נכשלה טעינת היסטוריית ההודעות.");
        } finally {
            setLoading(false);
        }
    };

    // 2. שליחת הודעה חדשה
    const sendMessage = async (content: string) => {
        if (!content.trim()) return;

        try {
            setSending(true);
            const dto = {
                message: content,
                idSession: sessionId,
                timestamp: new Date().toISOString(),
                messageType: senderType,

            };

            const response = await addMessage(dto as ChatMessageSend);

            // עדכון הרשימה המקומית עם ההודעה שחזרה מהשרת
            setMessages(prev => [...prev, response]);
        } catch (err) {
            setError("שליחת ההודעה נכשלה.");
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        if (sessionId) loadHistory();
    }, [sessionId]);

    return { messages, loading, sending, error, sendMessage, reloadHistory: loadHistory };
};