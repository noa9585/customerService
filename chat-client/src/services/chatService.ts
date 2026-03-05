import axios from 'axios';
import { ChatSession, Topic } from '../types/chat';

// יצירת מופע של axios
const apiClient = axios.create({
    // החליפי את XXXX בפורט שבו ה-API שלך רץ (למשל 5001 או 7245)
    baseURL: 'https://localhost:7260/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

export const chatService = {
    // קבלת רשימת הנושאים

getTopics: () => apiClient.get<Topic[]>('/Topic'),
    // פתיחת שיחה חדשה
    startChat: (customerId: number, topicId: number) => 
        apiClient.post<ChatSession>('/ChatSession', { 
            idCustomer: customerId, 
            idTopic: topicId 
        }),

    // קבלת זמן המתנה מעודכן
    getWaitTime: (sessionId: number) => 
        apiClient.get<ChatSession>(`/ChatSession/estimate/${sessionId}`),

    // משיכת לקוח הבא (לנציג)
    getNextClient: (repId: number) => 
        apiClient.post<ChatSession>(`/ChatSession/get-next-client/${repId}`)
};