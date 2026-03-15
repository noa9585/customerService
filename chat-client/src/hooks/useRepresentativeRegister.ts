// useRepresentativeRegister.hook.ts — קצר, משתמש ב-Redux
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store/index';
import { setCredentials } from '../store/slices/authSlice';
import { registerRepresentative } from '../services/representative.service';
import { RepresentativeRegister as RepresentativeRegisterType } from '../types/representative.types';
import { setTokenRep } from '../utils/auth';

export const useRepresentativeRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RepresentativeRegisterType>({
    nameRepr: '',
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
      const newUser = await registerRepresentative(formData);

      if (newUser.token) {
        setTokenRep(newUser.token);
        localStorage.setItem('representativeUser', JSON.stringify(newUser));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      // שמירה ב-Redux Store
      dispatch(setCredentials({ user: newUser, userType: 'representative' }));

      navigate('/representative-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'אירעה שגיאה בהרשמה.');
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, error, loading, handleSubmit };
};








// import { useState } from 'react';
// import { registerRepresentative } from '../services/representative.service';
// import { RepresentativeRegister as RepresentativeRegisterType } from '../types/representative.types';
// import{setTokenRep} from '../utils/auth'
// export const useCustomerAuth = () => {
//     const [formData, setFormData] = useState<RepresentativeRegisterType>({
//         nameRepr: '',
//         emailRepr: '',
//         passwordRepr: ''
//     });

//     const [error, setError] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);
//         setLoading(true);

//         try {
//             const newUser = await registerRepresentative(formData);
//              if(newUser.token) {
//                 // localStorage.setItem('representativeToken', newUser.token);
//                 // console.log("Token stored in localStorage:", newUser.token);
//                 setTokenRep(newUser.token)
//             }   
//             console.log("הרשמה הצליחה:", newUser);
//             alert(`ברוך הבא, ${newUser.nameRepr}!`);
//         } catch (err: any) {
//             const errorMessage = err.response?.data?.message || "אירעה שגיאה בהרשמה.";
//             setError(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };
//     return { formData, setFormData, error, loading, handleSubmit };

// };