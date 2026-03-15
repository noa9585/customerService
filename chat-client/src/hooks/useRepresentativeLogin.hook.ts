import { useState } from 'react';
import { loginRepresentative } from '../services/representative.service';
import { RepresentativeLogin } from '../types/representative.types';
import { setTokenRep } from '../utils/auth'
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
export const useRepresentativeAuth = () => {
    const [formData, setFormData] = useState<RepresentativeLogin>({
        emailRepr: '',
        passwordRepr: ''
    });
    const dispatch = useDispatch();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            const user = await loginRepresentative(formData);
            if (user.token) {
                // localStorage.setItem('representativeToken', user.token);
                setTokenRep(user.token)
                dispatch(setCredentials({
                    user: user,
                    userType: 'representative'
                }));
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