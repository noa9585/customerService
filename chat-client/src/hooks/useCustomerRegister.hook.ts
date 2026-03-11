
import { useState } from 'react';
import { registerCustomer } from '../services/customer.service';
import { CustomerRegister as CustomerRegisterType } from '../types/customer.types';
import{setToken}from '../utils/auth'
export const useCustomerRegister = () => {

    const [formData, setFormData] = useState<CustomerRegisterType>({
        nameCust: '',
        emailCust: '',
        passwordCust: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const newUser = await registerCustomer(formData);
            //const { idCustomer, nameCust, role, isOnline, emailCust, token } = newUser;
            if (newUser.token) {
                // localStorage.setItem('token', newUser.token);
                setToken(newUser.token)
                console.log('Token stored:', newUser.token);
            }
            console.log("הרשמה הצליחה:", newUser);
            alert(`ברוך הבא, ${newUser.nameCust}!`);
            return newUser;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "אירעה שגיאה בהרשמה.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }

    };
    return { formData, setFormData, error, loading, handleSubmit };

};



