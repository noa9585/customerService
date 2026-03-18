// useRepresentativeRegister.ts
// אחרי הרשמה מוצלחת — לא מנווטים, מציגים הודעת "ממתין לאישור"
import { useState } from 'react';
import { registerRepresentative } from '../services/representative.service';
import { RepresentativeRegister as RepresentativeRegisterType } from '../types/representative.types';

export const useRepresentativeRegister = () => {
  const [formData, setFormData] = useState<RepresentativeRegisterType>({
    nameRepr: '',
    emailRepr: '',
    passwordRepr: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // ✅ מוצג אחרי הרשמה מוצלחת — לא מנווטים
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.passwordRepr.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }
    setLoading(true);

    try {
      await registerRepresentative(formData);
      setRegistered(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'אירעה שגיאה בהרשמה.';
      setError(typeof msg === 'string' ? msg : 'אירעה שגיאה בהרשמה.');
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, error, loading, handleSubmit, registered };
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