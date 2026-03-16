import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store/index';
import { setCredentials } from '../store/slices/authSlice';
import { setToken, setTokenRep } from '../utils/auth';

type UserType = 'customer' | 'representative';

interface UseAuthFormOptions<T> {
  initialValues: T;
  userType: UserType;
  navigateTo: string;
  onSubmit: (data: T) => Promise<any>;
}

export const useAuthForm = <T>({
  initialValues,
  userType,
  navigateTo,
  onSubmit,
}: UseAuthFormOptions<T>) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<T>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await onSubmit(formData);

      if (response.token) {
        if (userType === 'customer') {
          setToken(response.token);
          localStorage.setItem('user', JSON.stringify(response));
          localStorage.removeItem('representativeToken');
          localStorage.removeItem('representativeUser');
        } else {
          setTokenRep(response.token);
          localStorage.setItem('representativeUser', JSON.stringify(response));
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      dispatch(setCredentials({ user: response, userType }));
      navigate(navigateTo);
    } catch (err: any) {
      setError(err.response?.data?.message || 'אירעה שגיאה. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, error, loading, handleSubmit };
};