import { useCallback, useEffect, useState } from "react";
import parseJwt from '../utils/jwt';
import { useNavigate } from "react-router-dom";
import {
    getCustomerById,
    getCustomerByIdToUpdate,
    updateCustomer
} from "../services/customer.service";
import { CustomerRegister } from "../types/customer.types";

export const useUpdateCustomer = () => {
    // מזהה הנציג נשמר כדי שנוכל להשתמש בו ב-Submit
    const [custId, setCustId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // הגדרת הטופס ההתחלתי (ריק)
    const [formData, setFormData] = useState<CustomerRegister>({
        nameCust: '',
        emailCust: '',
        passwordCust: ''
    });

    // פונקציית הטעינה
    const loadData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const decoded = parseJwt(token);
            if (!decoded || !decoded.sub) throw new Error("Token invalid");

            const id = Number(decoded.sub);
            setCustId(id);

            // שולפים את נתוני הלקוח מהשרת
            const customer = await getCustomerById(id);

            // 💡 התיקון המרכזי: עדכון ה-formData מיד כשהנתונים מגיעים
            setFormData({
                nameCust: customer.nameCust || '',
                emailCust: customer.emailCust || '',
                passwordCust: '' // לא נהוג למשוך סיסמה מהשרת, נשאיר ריק. אם הוא מקליד, נעדכן.
            });

        } catch (err) {
            console.error(err);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!custId) throw new Error("לא נמצא מזהה משתמש");

            // שולח לשרת. אם השאיר סיסמה ריקה, אל תשלח אותה!
            const dataToUpdate = { ...formData };
            if (!dataToUpdate.passwordCust || dataToUpdate.passwordCust.trim() === '') {
                dataToUpdate.passwordCust = (await getCustomerByIdToUpdate(custId)).passwordCust;
            }

            await updateCustomer(custId, dataToUpdate as CustomerRegister);

            alert("הפרטים עודכנו בהצלחה!");
            navigate('/contact-us');

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "אירעה שגיאה בעדכון הפרטים.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/contact-us');
    };

    return {
        formData,
        handleChange,
        handleSubmit,
        handleCancel,
        loading,
        error
    };
};