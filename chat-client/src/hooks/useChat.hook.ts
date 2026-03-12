import { useState, useEffect, useCallback } from 'react';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { getHistory, sendMessage } from '../services/chatMessage.service'; // ייבוא ה-Service
import { ChatMessageSend } from '../types/chatMessage.types';

export const useChat = (sessionId: number, senderType: 0|1) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [connection, setConnection] = useState<HubConnection | null>(null);

    // טעינת היסטוריה דרך ה-Service
    const loadHistory = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getHistory(sessionId);
            setMessages(data);
        } catch (err) {
            console.error("Failed to load history", err);
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    // חיבור SignalR
    useEffect(() => {
        if (!sessionId) return;

        const newConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:7260/chatHub")
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, [sessionId]);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    connection.invoke("JoinChat", sessionId);

                    connection.on("ReceiveMessage", (message) => {
                        setMessages(prev => {
                            if (prev.find(m => m.messageID === message.messageID)) return prev;
                            return [...prev, message];
                        });
                    });

                    loadHistory();
                })
                .catch(e => console.error("SignalR Connection Error: ", e));
        }
        return () => { connection?.stop(); };
    }, [connection, sessionId, loadHistory]);

    // שליחת הודעה דרך ה-Service
    const handleSendMessage = async (content: string) => {
        const dto = {
            message: content,
            idSession: sessionId,
            timestamp: new Date().toISOString(),
            messageType: senderType,
        };

        try {
            // קריאה ל-Service במקום ישירות ל-axios
            await sendMessage(dto as ChatMessageSend);
        } catch (err) {
            console.error("Error sending message", err);
        }
    };

    return { messages, loading, sendMessage: handleSendMessage };
};












// import { useState, useEffect } from 'react';
// import { ChatMessageSend } from '../types/chatMessage.types';
// import { getMessageBySessionId, addMessage } from '../services/chatMessage.service';
// export const useChat = (sessionId: number, senderType: 0| 1) => {
//     const [messages, setMessages] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [sending, setSending] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     // 1. טעינת היסטוריית ההודעות
//     const loadHistory = async () => {
//         try {
//             setLoading(true);
//             const response = await getMessageBySessionId(sessionId);
//             setMessages(response);
//         } catch (err) {
//             setError("נכשלה טעינת היסטוריית ההודעות.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // 2. שליחת הודעה חדשה
//     const sendMessage = async (content: string) => {
//         if (!content.trim()) return;

//         try {
//             setSending(true);
//             const dto = {
//                 message: content,
//                 idSession: sessionId,
//                 timestamp: new Date().toISOString(),
//                 messageType: senderType,

//             };

//             const response = await addMessage(dto as ChatMessageSend);

//             // עדכון הרשימה המקומית עם ההודעה שחזרה מהשרת
//             setMessages(prev => [...prev, response]);
//         } catch (err) {
//             setError("שליחת ההודעה נכשלה.");
//         } finally {
//             setSending(false);
//         }
//     };

//     useEffect(() => {
//         if (sessionId) loadHistory();
//     }, [sessionId]);

//     return { messages, loading, sending, error, sendMessage, reloadHistory: loadHistory };
// };