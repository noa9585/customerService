import axios from './axios';
import type { CustomerChat,CustomerLogin,CustomerRegister } from '../types/customer.types'; 

const url = 'customers';
export const getCustomers = async (): Promise<CustomerChat[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
    }
};

// הרשמת לקוח חדש (Register)
export const registerCustomer = async (customerData: CustomerRegister): Promise<CustomerChat> => {
    try {
        // שולח POST ל-api/customers
        const response = await axios.post(url, customerData);
        return response.data;
    } catch (error) {
        console.error("Error registering customer:", error);
        throw error;
    }
};

// התחברות לקוח (Login)
export const loginCustomer = async (credentials: CustomerLogin): Promise<CustomerChat> => {
    try {
        // שולח POST ל-api/customers/login (ודאי שזה הנתיב ב-Controller שלך)
        const response = await axios.post(`${url}/login`, credentials);
        return response.data;
    } catch (error) {
        console.error("Error during customer login:", error);
        throw error;
    }
};

// שליפת לקוח ספציפי לפי ID
export const getCustomerById = async (id: number): Promise<CustomerChat> => {
    try {
        const response = await axios.get(`${url}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching customer with ID ${id}:`, error);
        throw error;
    }
};

// עדכון פרטי לקוח
export const updateCustomer = async (id: number, customerData: Partial<CustomerRegister>): Promise<void> => {
    try {
        await axios.put(`${url}/${id}`, customerData);
    } catch (error) {
        console.error(`Error updating customer with ID ${id}:`, error);
        throw error;
    }
};