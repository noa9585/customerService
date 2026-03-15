// useUpdateRepresentative.hook.ts — קצר, משתמש ב-Slice
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/index';
import { fetchRepresentativeById , updateRepresentativeThunk } from '../store/slices/Representative.slice';
import { Representative, RepresentativeUpdate } from '../types/representative.types';
import { getRepresentativeByIdToUpdate } from '../services/representative.service';

export const useUpdateRepresentative = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);
  const currentRep = user as Representative | null;
  const { representative, loading, error } = useSelector((state: RootState) => state.representative);

  const [formData, setFormData] = useState<RepresentativeUpdate>({
    nameRepr: '', emailRepr: '', passwordRepr: '',
  });

  useEffect(() => {
    if (!currentRep?.idRepresentative) { navigate('/RepresentativeLogin'); return; }
    dispatch(fetchRepresentativeById (currentRep.idRepresentative));
  }, [dispatch, currentRep, navigate]);

  // מילוי הטופס כשהנתונים מגיעים מה-Store
  useEffect(() => {
    if (representative) {
      setFormData({
        nameRepr: representative.nameRepr || '',
        emailRepr: representative.emailRepr || '',
        passwordRepr: '',
      });
    }
  }, [representative]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRep?.idRepresentative) return;

    const dataToUpdate = { ...formData };
    if (!dataToUpdate.passwordRepr?.trim()) {
      dataToUpdate.passwordRepr = (await getRepresentativeByIdToUpdate(currentRep.idRepresentative)).passwordRepr;
    }

    const result = await dispatch(updateRepresentativeThunk({
      id: currentRep.idRepresentative,
      data: dataToUpdate as RepresentativeUpdate,
    }));

    if (updateRepresentativeThunk.fulfilled.match(result)) {
      alert('הפרטים עודכנו בהצלחה!');
      navigate('/representative-dashboard');
    }
  };

  return {
    formData, handleChange, handleSubmit,
    handleCancel: () => navigate('/representative-dashboard'),
    loading, error,
  };
};


// import { useCallback, useEffect, useState } from "react";
// import parseJwt from '../utils/jwt';
// import { useNavigate } from "react-router-dom";
// import {
//     getRepresentativeById,
//     getRepresentativeByIdToUpdate,
//     updateRepresentative
// } from "../services/representative.service";
// import { RepresentativeUpdate } from "../types/representative.types";

// export const useUpdateRepresentative = () => {
//     // מזהה הנציג נשמר כדי שנוכל להשתמש בו ב-Submit
//     const [repId, setRepId] = useState<number | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const navigate = useNavigate();

//     // הגדרת הטופס ההתחלתי (ריק)
//     const [formData, setFormData] = useState<RepresentativeUpdate>({
//         nameRepr: '',
//         emailRepr: '',
//         passwordRepr: ''
//     });

//     // פונקציית הטעינה
//     const loadData = useCallback(async () => {
//         try {
//             const token = localStorage.getItem('representativeToken');
//             if (!token) {
//                 navigate('/RepresentativeLogin');
//                 return;
//             }

//             const decoded = parseJwt(token);
//             if (!decoded || !decoded.sub) throw new Error("Token invalid");

//             const id = Number(decoded.sub);
//             setRepId(id);

//             // שולפים את נתוני הנציג מהשרת
//             const representative = await getRepresentativeById(id);

//             // 💡 התיקון המרכזי: עדכון ה-formData מיד כשהנתונים מגיעים
//             setFormData({
//                 nameRepr: representative.nameRepr || '',
//                 emailRepr: representative.emailRepr || '',
//                 passwordRepr: '' // לא נהוג למשוך סיסמה מהשרת, נשאיר ריק. אם הוא מקליד, נעדכן.
//             });

//         } catch (err) {
//             console.error(err);
//             navigate('/RepresentativeLogin');
//         } finally {
//             setLoading(false);
//         }
//     }, [navigate]);

//     useEffect(() => {
//         loadData();
//     }, [loadData]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);
//         setLoading(true);

//         try {
//             if (!repId) throw new Error("לא נמצא מזהה משתמש");

//             // שולח לשרת. אם השאיר סיסמה ריקה, אל תשלח אותה!
//             const dataToUpdate = { ...formData };
//             if (!dataToUpdate.passwordRepr || dataToUpdate.passwordRepr.trim() === '') {
//                 dataToUpdate.passwordRepr = (await getRepresentativeByIdToUpdate(repId)).passwordRepr;
//             }

//             await updateRepresentative(repId, dataToUpdate as RepresentativeUpdate);

//             // אחרי הצלחה - חזור לדאשבורד
//             alert("הפרטים עודכנו בהצלחה!");
//             navigate('/representative-dashboard');

//         } catch (err: any) {
//             const errorMessage = err.response?.data?.message || "אירעה שגיאה בעדכון הפרטים.";
//             setError(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCancel = () => {
//         navigate('/representative-dashboard');
//     };

//     return {
//         formData,
//         handleChange,
//         handleSubmit,
//         handleCancel,
//         loading,
//         error
//     };
// };