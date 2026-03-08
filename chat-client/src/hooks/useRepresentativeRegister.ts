import { useState } from 'react';
import { registerRepresentative } from '../services/representative.service';
import { RepresentativeRegister as RepresentativeRegisterType } from '../types/representative.types';

export const useCustomerAuth = () => {
    const [formData, setFormData] = useState<RepresentativeRegisterType>({
        nameRepr: '',
        emailRepr: '',
        passwordRepr: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const newUser = await registerRepresentative(formData);
             if(newUser.token) {
                localStorage.setItem('representativeToken', newUser.token);
                console.log("Token stored in localStorage:", newUser.token);
            }   
            console.log("הרשמה הצליחה:", newUser);
            alert(`ברוך הבא, ${newUser.nameRepr}!`);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "אירעה שגיאה בהרשמה.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    return { formData, setFormData, error, loading, handleSubmit };

};