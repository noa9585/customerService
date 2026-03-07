import axios from './axios';
import type { Topic, TopicAdd } from '../types/topic.types'; // ודאי שזה שם הקובץ אצלך

const url = 'topic';

// שליפת כל הנושאים (HttpGet)
export const getAllTopics = async (): Promise<Topic[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching topics:", error);
        throw error;
    }
};

// שליפת נושא לפי ID (HttpGet("{id}"))
export const getTopicById = async (id: number): Promise<Topic> => {
    try {
        const response = await axios.get(`${url}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching topic with ID ${id}:`, error);
        throw error;
    }
};

// הוספת נושא חדש (HttpPost)
export const addTopic = async (topicData: TopicAdd): Promise<Topic> => {
    try {
        const response = await axios.post(url, topicData);
        return response.data;
    } catch (error) {
        console.error("Error adding topic:", error);
        throw error;
    }
};

// עדכון נושא קיים (HttpPut("{id}"))
export const updateTopic = async (id: number, topicData: TopicAdd): Promise<void> => {
    try {
        // ב-Controller שלך הפונקציה מחזירה NoContent (204)
        await axios.put(`${url}/${id}`, topicData);
    } catch (error) {
        console.error(`Error updating topic ${id}:`, error);
        throw error;
    }
};

// מחיקת נושא (HttpDelete("{id}"))
export const deleteTopic = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${id}`);
    } catch (error) {
        console.error(`Error deleting topic ${id}:`, error);
        throw error;
    }
};