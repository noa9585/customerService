import axios from './axios';
import type { 
    RepresentativeChat, 
    Representative, 
    RepresentativeLogin, 
    RepresentativeRegister,
    RepresentativeUpdate 
} from '../types/representative.types'; 

const url = 'representative';

// שליפת כל הנציגים
export const getAllRepresentatives = async (): Promise<RepresentativeChat[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching representatives:", error);
        throw error;
    }
};

// שליפת נציג לפי ID
export const getRepresentativeById = async (id: number): Promise<RepresentativeChat> => {
    try {
        const response = await axios.get(`${url}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching representative with ID ${id}:`, error);
        throw error;
    }
};

// הוספה/רישום נציג חדש
export const registerRepresentative = async (data: RepresentativeRegister): Promise<Representative> => {
    try {
        const response = await axios.post(`${url}/register`, data);
        return response.data;
    } catch (error) {
        console.error("Error registering representative:", error);
        throw error;
    }
};

// התחברות נציג
export const loginRepresentative = async (credentials: RepresentativeLogin): Promise<Representative> => {
    try {
        const response = await axios.post(`${url}/login`, credentials);
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

// התנתקות נציג
export const logoutRepresentative = async (id: number): Promise<{ message: string }> => {
    try {
        const response = await axios.post(`${url}/logout/${id}`);
        return response.data;
    } catch (error) {
        console.error("Logout failed:", error);
        throw error;
    }
};

// עדכון פרטי נציג
export const updateRepresentative = async (id: number, data: RepresentativeRegister): Promise<void> => {
    try {
        await axios.put(`${url}/${id}`, data);
    } catch (error) {
        console.error(`Error updating representative ${id}:`, error);
        throw error;
    }
};

// מחיקת נציג
export const deleteRepresentative = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${id}`);
    } catch (error) {
        console.error(`Error deleting representative ${id}:`, error);
        throw error;
    }
};

// יציאה להפסקה (ToggleBreak)
export const toggleBreak = async (id: number): Promise<{ message: string }> => {
    try {
        const response = await axios.put(`${url}/ToggleBreak/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error toggling break:", error);
        throw error;
    }
};

// חזרה מהפסקה
export const returnFromBreak = async (id: number): Promise<{ message: string }> => {
    try {
        const response = await axios.put(`${url}/return-from-break/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error returning from break:", error);
        throw error;
    }
};