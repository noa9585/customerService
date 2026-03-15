// useCustomerLogin.hook.ts — קצר, משתמש ב-Redux
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store/index';
import { setCredentials } from '../store/slices/authSlice';
import { loginCustomer } from '../services/customer.service';
import { CustomerLogin as CustomerLoginType } from '../types/customer.types';
import { setToken } from '../utils/auth';

export const useCustomerAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CustomerLoginType>({
    emailCust: '',
    passwordCust: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await loginCustomer(formData);

      if (response.token) {
        setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response));
        // ניקוי טוקן נציג קודם אם קיים
        localStorage.removeItem('representativeToken');
        localStorage.removeItem('representativeUser');
      }

      // שמירה ב-Redux Store
      dispatch(setCredentials({ user: response, userType: 'customer' }));

      navigate('/contact-us');
    } catch {
      setError('אימייל או סיסמה שגויים. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, error, loading, handleSubmit };
};



// import { useState } from 'react';
// import { loginCustomer } from '../services/customer.service';
// import { CustomerLogin as CustomerLoginType } from '../types/customer.types';
// import { setToken } from '../utils/auth'
// import { useDispatch } from 'react-redux';
// import { setCredentials } from '../store/slices/authSlice';
// export const useCustomerAuth = () => {
//     const [formData, setFormData] = useState<CustomerLoginType>({
//         emailCust: '',
//         passwordCust: ''
//     });
//     const dispatch = useDispatch();
//     const [error, setError] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);

//     const handleLogin = async () => {
//         setError(null);
//         setLoading(true);
//         try {
//             const response = await loginCustomer(formData);
//             // Assuming response includes user and token
//             //const { idCustomer, nameCust, role,isOnline,emailCust, token } = response;
//             if (response.token) {
//                 // localStorage.setItem('token', response.token);
//                 setToken(response.token)
//                 dispatch(setCredentials({
//                     user: response,
//                     userType: 'customer'
//                 }));
//             }
//             return response;
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
//                 alert(`שלום ${user.nameCust}, ברוך הבא!`);
//             }
//         } catch (err) {
//             // הלוגיקה של השגיאה מנוהלת בתוך ה-Hook (משתנה error)
//             console.error("Login failed", err);
//         }
//     };


//     return { formData, setFormData, error, loading, handleSubmit };
// };