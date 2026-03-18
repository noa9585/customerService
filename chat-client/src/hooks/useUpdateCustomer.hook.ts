// useUpdateCustomer.hook.ts — קצר, משתמש ב-Slice
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/index';
import { fetchCustomerById, updateCustomerThunk } from '../store/slices/Customerslice';
import { CustomerChat, CustomerRegister } from '../types/customer.types';
import { getCustomerByIdToUpdate } from '../services/customer.service';

export const useUpdateCustomer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const currentUser = user as CustomerChat | null;
  const { selectedCustomer, loading, error } = useSelector((state: RootState) => state.customer);

  const [formData, setFormData] = useState<CustomerRegister>({
    nameCust: '', emailCust: '', passwordCust: '',
  });

  useEffect(() => {
    if (!currentUser?.idCustomer) { navigate('/login'); return; }
    dispatch(fetchCustomerById(currentUser.idCustomer));
  }, [dispatch, currentUser, navigate]);

  // מילוי הטופס כשהנתונים מגיעים מה-Store
  useEffect(() => {
    if (selectedCustomer) {
      setFormData({
        nameCust: selectedCustomer.nameCust || '',
        emailCust: selectedCustomer.emailCust || '',
        passwordCust: '',
      });
    }
  }, [selectedCustomer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!currentUser?.idCustomer) return;
    if (formData.passwordCust.length > 0 && formData.passwordCust.length < 6) {
      setLocalError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }
    const dataToUpdate = { ...formData };
    if (!dataToUpdate.passwordCust?.trim()) {
      dataToUpdate.passwordCust = (await getCustomerByIdToUpdate(currentUser.idCustomer)).passwordCust;
    }

    const result = await dispatch(updateCustomerThunk({
      id: currentUser.idCustomer,
      data: dataToUpdate as CustomerRegister,
    }));

    if (updateCustomerThunk.fulfilled.match(result)) {
      alert('הפרטים עודכנו בהצלחה!');
      navigate('/contact-us');
    }
  };

  return {
    formData, handleChange, handleSubmit,
    handleCancel: () => navigate('/contact-us'),
    loading, error: localError || error,
  };
};







// import { useCallback, useEffect, useState } from "react";
// import parseJwt from '../utils/jwt';
// import { useNavigate } from "react-router-dom";
// import {
//     getCustomerById,
//     getCustomerByIdToUpdate,
//     updateCustomer
// } from "../services/customer.service";
// import { CustomerRegister } from "../types/customer.types";

// export const useUpdateCustomer = () => {
//     // מזהה הנציג נשמר כדי שנוכל להשתמש בו ב-Submit
//     const [custId, setCustId] = useState<number | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const navigate = useNavigate();

//     // הגדרת הטופס ההתחלתי (ריק)
//     const [formData, setFormData] = useState<CustomerRegister>({
//         nameCust: '',
//         emailCust: '',
//         passwordCust: ''
//     });

//     // פונקציית הטעינה
//     const loadData = useCallback(async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 navigate('/login');
//                 return;
//             }

//             const decoded = parseJwt(token);
//             if (!decoded || !decoded.sub) throw new Error("Token invalid");

//             const id = Number(decoded.sub);
//             setCustId(id);

//             // שולפים את נתוני הלקוח מהשרת
//             const customer = await getCustomerById(id);

//             // 💡 התיקון המרכזי: עדכון ה-formData מיד כשהנתונים מגיעים
//             setFormData({
//                 nameCust: customer.nameCust || '',
//                 emailCust: customer.emailCust || '',
//                 passwordCust: '' // לא נהוג למשוך סיסמה מהשרת, נשאיר ריק. אם הוא מקליד, נעדכן.
//             });

//         } catch (err) {
//             console.error(err);
//             navigate('/login');
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
//             if (!custId) throw new Error("לא נמצא מזהה משתמש");

//             // שולח לשרת. אם השאיר סיסמה ריקה, אל תשלח אותה!
//             const dataToUpdate = { ...formData };
//             if (!dataToUpdate.passwordCust || dataToUpdate.passwordCust.trim() === '') {
//                 dataToUpdate.passwordCust = (await getCustomerByIdToUpdate(custId)).passwordCust;
//             }

//             await updateCustomer(custId, dataToUpdate as CustomerRegister);

//             alert("הפרטים עודכנו בהצלחה!");
//             navigate('/contact-us');

//         } catch (err: any) {
//             const errorMessage = err.response?.data?.message || "אירעה שגיאה בעדכון הפרטים.";
//             setError(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCancel = () => {
//         navigate('/contact-us');
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