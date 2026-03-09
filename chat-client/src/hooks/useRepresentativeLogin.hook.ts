import { useState } from 'react';
import { loginRepresentative } from '../services/representative.service';
import { RepresentativeLogin} from '../types/representative.types';

export const useCustomerAuth = () => {
    const [formData, setFormData] = useState<RepresentativeLogin>({
        emailRepr: '',
        passwordRepr: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            const user = await loginRepresentative(formData);
            if(user.token) {
                localStorage.setItem('representativeToken', user.token);
                // console.log("Token stored in localStorage:", user.token);
            }   
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
                alert(`שלום ${user.nameRepr}, ברוך הבא!`);
            }
        } catch (err) {
            // הלוגיקה של השגיאה מנוהלת בתוך ה-Hook (משתנה error)
            console.error("Login failed", err);
        }
    };

    return { formData, setFormData, error, loading, handleSubmit };
};