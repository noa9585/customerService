import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Hook to encapsulate ContactUs actions (navigation based on token)
export const useContactActions = () => {
  const navigate = useNavigate();

  const handleStart = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/new-chat');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return { handleStart };
};
