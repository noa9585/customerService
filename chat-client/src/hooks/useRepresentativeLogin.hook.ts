// useRepresentativeLogin.hook.ts — קצר, משתמש ב-Redux
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store/index';
import { setCredentials } from '../store/slices/authSlice';
import { loginRepresentative } from '../services/representative.service';
import { RepresentativeLogin } from '../types/representative.types';
import { setTokenRep } from '../utils/auth';

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
      const user = await loginRepresentative(formData);

      if (user.token) {
        setTokenRep(user.token);
        localStorage.setItem('representativeUser', JSON.stringify(user));
        // ניקוי טוקן לקוח קודם אם קיים
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      // שמירה ב-Redux Store
      dispatch(setCredentials({ user, userType: 'representative' }));

      navigate('/representative-dashboard');
    } catch {
      setError('אימייל או סיסמה שגויים. נסה שוב.');
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