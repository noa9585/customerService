import { useState } from 'react';
import { loginCustomer } from '../services/customer.service';
import { CustomerLogin as CustomerLoginType } from '../types/customer.types';

export const useCustomerAuth = () => {
    const [formData, setFormData] = useState<CustomerLoginType>({
        emailCust: '',
        passwordCust: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            const user = await loginCustomer(formData);
            return user;
        } catch (err) {
            setError("אימייל או סיסמה שגויים. נסה שוב.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user = await handleLogin();
            if (user) {
                alert(`שלום ${user.nameCust}, ברוך הבא!`);
            }
        } catch (err) {
            // הלוגיקה של השגיאה מנוהלת בתוך ה-Hook (משתנה error)
            console.error("Login failed", err);
        }
    };

    return { formData, setFormData, error, loading, handleSubmit };
};