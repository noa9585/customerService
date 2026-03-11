import axios from './axios';
import type { ChatMessage, ChatMessageSend, ChatMessageChatDto } from '../types/chatMessage.types';

const url = 'ChatMessage'; // שם הקונטרולר ב-C#

// 1. שליפת כל ההודעות
export const getAllMessages = async (): Promise<ChatMessage[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching all messages:", error);
        throw error;
    }
};

// 2. שליפת הודעה לפי ID
export const getMessageById = async (id: number): Promise<ChatMessageChatDto> => {
    try {
        const response = await axios.get(`${url}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching message with ID ${id}:`, error);
        throw error;
    }
};
export const getMessageBySessionId = async (sessionId: number): Promise<ChatMessage[]> => {

    try {
        const response = await axios.get(`${url}/history/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching messages for session ID ${sessionId}:`, error);
        throw error;
    }
}

// 3. הוספת הודעה חדשה
export const addMessage = async (messageData: ChatMessageSend): Promise<ChatMessage> => {
    try {
        // שולח POST ל-api/ChatMessage
        const response = await axios.post(url, messageData);
        return response.data;
    } catch (error) {
        console.error("Error adding message:", error);
        throw error;
    }
};

// 4. עדכון הודעה קיימת
// ה-Controller מצפה ל-ID בנתיב, ל-Body (DTO) ול-Query Parameter (statusMessage)
export const updateMessage = async (
    id: number,
    messageDto: ChatMessageChatDto,
    statusMessage: boolean
): Promise<void> => {
    try {
        await axios.put(`${url}/${id}`, messageDto, {
            params: { statusMessage } // הוספת ה-Query Parameter
        });
    } catch (error) {
        console.error(`Error updating message with ID ${id}:`, error);
        throw error;
    }
};

// 5. מחיקת הודעה
export const deleteMessage = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${id}`);
    } catch (error) {
        console.error(`Error deleting message with ID ${id}:`, error);
        throw error;
    }
};