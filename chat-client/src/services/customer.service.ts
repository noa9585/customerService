import axios from './axios';
import type { CustomerChat, CustomerLogin, CustomerRegister } from '../types/customer.types'; 

// שים לב: ב-Controller ה-Route הוא "api/[controller]", לכן ה-url הוא 'customer'
const url = 'customer';

// שליפת כל הלקוחות (HttpGet)
export const getCustomers = async (): Promise<CustomerChat[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
    }
};

// שליפת לקוח לפי ID (HttpGet("{id}"))
export const getCustomerById = async (id: number): Promise<CustomerChat> => {
    try {
        const response = await axios.get(`${url}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching customer with ID ${id}:`, error);
        throw error;
    }
};


export const getCustomerByIdToUpdate = async (id: number): Promise<CustomerRegister> => {
    try {
        const response = await axios.get(`${url}/updateByID/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching customer with ID ${id}:`, error);
        throw error;
    }
};
// הוספת לקוח חדש (HttpPost - הפונקציה Add בקונטרולר)
export const addCustomer = async (customerData: CustomerRegister): Promise<CustomerChat> => {
    try {
        const response = await axios.post(url, customerData);
        return response.data;
    } catch (error) {
        console.error("Error adding customer:", error);
        throw error;
    }
};

// עדכון לקוח (HttpPut("{id}"))
export const updateCustomer = async (id: number, customerData: CustomerRegister): Promise<void> => {
    try {
        await axios.put(`${url}/${id}`, customerData);
    } catch (error) {
        console.error(`Error updating customer ${id}:`, error);
        throw error;
    }
};

// מחיקת לקוח (HttpDelete("{id}"))
export const deleteCustomer = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${id}`);
    } catch (error) {
        console.error(`Error deleting customer ${id}:`, error);
        throw error;
    }
};

// התחברות (HttpPost("login"))
export const loginCustomer = async (credentials: CustomerLogin): Promise<CustomerChat> => {
    try {
        const response = await axios.post(`${url}/login`, credentials);
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

// הרשמה (HttpPost("register"))
export const registerCustomer = async (customerData: CustomerRegister): Promise<CustomerChat> => {
    try {
        const response = await axios.post(`${url}/register`, customerData);
        return response.data;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
};

// התנתקות (HttpPut("logout/{id}"))
export const logoutCustomer = async (id: number): Promise<{ message: string }> => {
    try {
        // שים לב שבקונטרולר הגדרת את זה כ-HttpPut
        const response = await axios.put(`${url}/logout/${id}`);
        return response.data;
    } catch (error) {
        console.error("Logout failed:", error);
        throw error;
    }
};