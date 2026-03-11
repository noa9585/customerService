import axios from './axios';
import type { ChatSession, ChatSessionCreate, ChatSessionUpdate } from '../types/chatSession.types';

const url = 'ChatSession';

// ממשק עזר לתשובה שחוזרת מיצירת שיחה
interface CreateSessionResponse {
    session: ChatSession;
    estimatedWaitMinutes: number;
}

// 1. שליפת כל הסשנים
export const getAllSessions = async (): Promise<ChatSession[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching all sessions:", error);
        throw error;
    }
};

// 2. שליפת סשן לפי ID
export const getSessionById = async (id: number): Promise<ChatSession> => {
    try {
        const response = await axios.get(`${url}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching session ${id}:`, error);
        throw error;
    }
};

// 3. יצירת סשן חדש (מחזיר גם זמן המתנה)
export const createSession = async (createDto: ChatSessionCreate): Promise<ChatSession> => {
    try {
        const response = await axios.post(url, createDto);
        return response.data; // השרת מחזיר כעת את ה-ChatSession ישירות
    } catch (error) {
        console.error("Error creating session:", error);
        throw error;
    }
};

// 4. שליפת זמן המתנה משוער
export const getWaitTimeEstimate = async (id: number): Promise<number> => {
    try {
        const response = await axios.get(`${url}/estimate/${id}`);
        return response.data;
    } catch (error) {
        // כאן השגיאה יכולה להיות "אין נציגים מחוברים" (400)
        console.error("Error getting wait time:", error);
        throw error;
    }
};

// 5. עדכון סשן
export const updateSession = async (id: number, updateDto: ChatSessionUpdate): Promise<void> => {
    try {
        await axios.put(`${url}/${id}`, updateDto);
    } catch (error) {
        console.error(`Error updating session ${id}:`, error);
        throw error;
    }
};

// 6. מחיקת סשן
export const deleteSession = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${id}`);
    } catch (error) {
        console.error(`Error deleting session ${id}:`, error);
        throw error;
    }
};

// 7. משיכת הלקוח הבא מהתור (עבור נציג)
export const getNextClient = async (repId: number): Promise<ChatSession> => {
    try {
        const response = await axios.post(`${url}/get-next-client/${repId}`);
        return response.data;
    } catch (error) {
        // כאן השגיאה יכולה להיות "התור ריק" (404)
        console.error("Error getting next client:", error);
        throw error;
    }
};

