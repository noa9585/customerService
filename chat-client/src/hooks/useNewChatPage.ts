import { useCallback, useEffect, useState } from 'react';

import{getAllTopics}from '../services/topic.service'
import { Topic } from '../types/chat';
import{ChatMessage}from '../types/chatMessage.types'
import parseJwt from '../utils/jwt';

// type Form = {
//   fullName: string;
//   email: string;
//   subject: string;
//   message: string;
// };

export const useNewChatPage = (onSuccess?: (data: ChatMessage) => void) => {
  const [form, setForm] = useState<ChatMessage>({ messageID: 0, idSession: 0, message: '', timestamp: new Date(), idSend: 0, messageType: 0, statusMessage: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | string>('');
  const [topicsError, setTopicsError] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<any | null>(null);

  useEffect(() => {
    // decode token from localStorage (if present) so pages can access user info
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = parseJwt(token);
        setDecodedToken(decoded);
      }
    } catch (e) {
      console.warn('No token to decode or decode failed', e);
    }

    let mounted = true;
    getAllTopics()
      .then(res => {
        if (!mounted) return;
        if (Array.isArray(res)) {
          setTopics(res);
        } else {
          console.error('Unexpected topics response:', res);
          setTopicsError('נתוני הנושאים לא הגיעו בפורמט תקין');
        }
      })
      .catch(err => {
        console.error('Error loading topics', err);
        setTopicsError('לא ניתן להתחבר לשרת. ודא שה-Backend רץ ושכתובת ה-API נכונה.');
      });

    return () => { mounted = false; };
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // TODO: replace with real API call (e.g., chatService.createSession)
      await new Promise(res => setTimeout(res, 800));
      if (onSuccess) onSuccess(form);
      setForm({ messageID: 0, idSession: 0, message: '', timestamp: new Date(), idSend: 0, messageType: 0, statusMessage: false });
    } catch (err) {
      console.error('Submit error', err);
      setError('אירעה שגיאה בשליחה. נסה שנית.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [form, onSuccess]);

  return {
    form,
    setForm,
    loading,
    error,
    handleChange,
    handleSubmit,
    topics,
    selectedTopic,
    setSelectedTopic,
    topicsError,
    decodedToken,
  };
};
