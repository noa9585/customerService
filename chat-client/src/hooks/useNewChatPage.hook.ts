import { useCallback, useEffect, useState } from 'react';

import { getAllTopics } from '../services/topic.service'
import { Topic } from '../types/chat';
import { ChatMessage } from '../types/chatMessage.types'
import parseJwt from '../utils/jwt';
import { createSession } from '../services/chatSession.service'
import { addMessage } from '../services/chatMessage.service'
import { useNavigate } from 'react-router-dom';

export const useNewChatPage = (onSuccess?: (data: any) => void) => {
  const navigate = useNavigate();
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


  const openSession = useCallback(async (e?: React.FormEvent) => {
    if (e)
      e.preventDefault();
    setError(null)
    const messageContent = form.message;
    if (!messageContent || !selectedTopic) {
      setError('אנא מלא את כל השדות הנדרשים');
      return;
    }

    if (!decodedToken || !decodedToken.sub) {
      setError("שגיאת אימות אנא התחבר מחדש");
      return;
    }
    setLoading(true)
    try {

      const newSession = await createSession({
        idCustomer: Number(decodedToken.sub),
        idTopic: Number(selectedTopic),
      })
      //const sessionId = newSession.session.sessionID
      const newMessage = addMessage({
        message: messageContent,
        idSession: newSession.sessionID,
        timestamp: new Date().toISOString(),
        messageType: 0
      })
      navigate('/waiting-room', { 
                state: { 
                    sessionId: newSession.sessionID,
                    initialWait: newSession.estimatedWaitTime 
                } 
            });
      if (onSuccess) onSuccess(newSession)
      setForm(prev => ({ ...prev, message: '' }))
      setSelectedTopic('')

    }

    catch (err: any) {
      // אם השרת החזיר BadRequest עם { message: "..." }, זה יוצג למשתמש
      console.error('Failed to open session or send message', err)

      const serverMessage = err.response?.data?.message;
      setError(serverMessage || 'אירעה שגיאה בחיבור. נסה שוב מאוחר יותר.');
    }
    finally {
      setLoading(false)
    }

  }, [form.message, selectedTopic, decodedToken,navigate, onSuccess]); // חשוב להוסיף את התלויות כאן כדי שהערכים יהיו מעודכנים

  return {
    form,
    setForm,
    loading,
    error,
    handleChange,
    topics,
    selectedTopic,
    setSelectedTopic,
    topicsError,
    decodedToken,
    openSession,
  };
};
