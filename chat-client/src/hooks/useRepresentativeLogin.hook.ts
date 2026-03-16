// useRepresentativeLogin_hook.ts — מטפל ב-WAITING / DENIED
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store/index';
import { setCredentials } from '../store/slices/authSlice';
import { setTokenRep } from '../utils/auth';
import { loginRepresentative } from '../services/representative.service';
import { RepresentativeLogin } from '../types/representative.types';

export const useRepresentativeAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RepresentativeLogin>({
    emailRepr: '',
    passwordRepr: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginRepresentative(formData);

      if (response.token) {
        setTokenRep(response.token);
        localStorage.setItem('representativeUser', JSON.stringify(response));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      dispatch(setCredentials({ user: response, userType: 'representative' }));
      navigate('/representative-dashboard');

    } catch (err: any) {
      // ✅ השרת מחזיר 403 עם { code, message } לנציגים שלא אושרו
      const data = err.response?.data;
      if (err.response?.status === 403 && data?.code === 'WAITING') {
        setError(data.message);
      } else if (err.response?.status === 403 && data?.code === 'DENIED') {
        setError(data.message);
      } else {
        setError('אימייל או סיסמה שגויים. נסה שוב.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, error, loading, handleSubmit };
};

// import { useState } from 'react';
// import { loginRepresentative } from '../services/representative.service';
// import { RepresentativeLogin } from '../types/representative.types';
// import { setTokenRep } from '../utils/auth'
// import { useDispatch } from 'react-redux';
// import { setCredentials } from '../store/slices/authSlice';
// export const useRepresentativeAuth = () => {
//     const [formData, setFormData] = useState<RepresentativeLogin>({
//         emailRepr: '',
//         passwordRepr: ''
//     });
//     const dispatch = useDispatch();
//     const [error, setError] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);

//     const handleLogin = async () => {
//         setError(null);
//         setLoading(true);
//         try {
//             const user = await loginRepresentative(formData);
//             if (user.token) {
//                 // localStorage.setItem('representativeToken', user.token);
//                 setTokenRep(user.token)
//                 dispatch(setCredentials({
//                     user: user,
//                     userType: 'representative'
//                 }));
//             }
//             return user;
//         } catch (err) {
//             setError("אימייל או סיסמה שגויים. נסה שוב.");
//             throw err;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             const user = await handleLogin();
//             if (user) {
//                 alert(`שלום ${user.nameRepr}, ברוך הבא!`);
//             }
//         } catch (err) {
//             // הלוגיקה של השגיאה מנוהלת בתוך ה-Hook (משתנה error)
//             console.error("Login failed", err);
//         }
//     };

//     return { formData, setFormData, error, loading, handleSubmit };
// };