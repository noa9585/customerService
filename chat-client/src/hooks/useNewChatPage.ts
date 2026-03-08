import { useCallback, useEffect, useState } from 'react';
import { chatService } from '../services/chatService';
import { Topic } from '../types/chat';

type Form = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

export const useNewChatPage = (onSuccess?: (data: Form) => void) => {
  const [form, setForm] = useState<Form>({ fullName: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | string>('');
  const [topicsError, setTopicsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    chatService.getTopics()
      .then(res => {
        if (!mounted) return;
        if (Array.isArray(res.data)) {
          setTopics(res.data);
        } else {
          console.error('Unexpected topics response:', res.data);
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
      setForm({ fullName: '', email: '', subject: '', message: '' });
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
  };
};
