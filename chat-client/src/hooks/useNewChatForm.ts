import { useCallback, useState } from 'react';

type Form = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

export const useNewChatForm = (onSuccess?: (data: Form) => void) => {
  const [form, setForm] = useState<Form>({ fullName: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Simulate API call — replace with real API integration when ready
      await new Promise(res => setTimeout(res, 800));
      if (onSuccess) onSuccess(form);
      // reset form after success
      setForm({ fullName: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('אירעה שגיאה בשליחה. נסה שנית.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [form, onSuccess]);

  return { form, setForm, loading, error, handleChange, handleSubmit };
};
