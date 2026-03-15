// useContactUs_hook.ts — משתמש ב-Redux במקום localStorage
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';

export const useContactActions = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleStart = useCallback(() => {
    // ✅ קורא מ-Redux במקום localStorage.getItem('token')
    if (isAuthenticated) {
      navigate('/new-chat');
    } else {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);

  return { handleStart };
};