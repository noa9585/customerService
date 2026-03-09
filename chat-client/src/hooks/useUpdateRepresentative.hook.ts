import { useCallback, useEffect, useState } from "react";
import parseJwt from '../utils/jwt';
import { useNavigate } from "react-router-dom";
import { 
    getRepresentativeById, 
    getRepresentativeByIdToUpdate, 
    updateRepresentative 
} from "../services/representative.service";
import { RepresentativeUpdate } from "../types/representative.types";

export const useUpdateRepresentative = () => {
    // מזהה הנציג נשמר כדי שנוכל להשתמש בו ב-Submit
    const [repId, setRepId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // הגדרת הטופס ההתחלתי (ריק)
    const [formData, setFormData] = useState<RepresentativeUpdate>({        
        nameRepr: '',
        emailRepr: '',
        passwordRepr: ''
    });

    // פונקציית הטעינה
    const loadData = useCallback(async () => {
        try {
            const token = localStorage.getItem('representativeToken');
            if (!token) {
                navigate('/RepresentativeLogin');
                return;
            }

            const decoded = parseJwt(token);
            if (!decoded || !decoded.sub) throw new Error("Token invalid");

            const id = Number(decoded.sub);
            setRepId(id);

            // שולפים את נתוני הנציג מהשרת
            const representative = await getRepresentativeById(id);
            
            // 💡 התיקון המרכזי: עדכון ה-formData מיד כשהנתונים מגיעים
            setFormData({
                nameRepr: representative.nameRepr || '',
                emailRepr: representative.emailRepr || '',
                passwordRepr: '' // לא נהוג למשוך סיסמה מהשרת, נשאיר ריק. אם הוא מקליד, נעדכן.
            });

        } catch (err) {
            console.error(err);
            navigate('/RepresentativeLogin');
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
            if (!repId) throw new Error("לא נמצא מזהה משתמש");

            // שולח לשרת. אם השאיר סיסמה ריקה, אל תשלח אותה!
            const  dataToUpdate = { ...formData };
            if (!dataToUpdate.passwordRepr || dataToUpdate.passwordRepr.trim() === '') {
                 dataToUpdate.passwordRepr = (await getRepresentativeByIdToUpdate(repId)).passwordRepr;
            }

            await updateRepresentative(repId, dataToUpdate as RepresentativeUpdate);
            
            // אחרי הצלחה - חזור לדאשבורד
            alert("הפרטים עודכנו בהצלחה!");
            navigate('/representative-dashboard');

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "אירעה שגיאה בעדכון הפרטים.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/representative-dashboard');
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