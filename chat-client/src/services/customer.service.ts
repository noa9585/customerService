import axios from './axios';
import type { CustomerChat,CustomerLogin,CustomerRegister } from '../types/customer.types'; 

const url = 'customers';

export const getCustomers = async () => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
    }
};