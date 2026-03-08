import React, { useState } from 'react';
import '../styles/NewChat.css';

const NewChat: React.FC = () => {
  const [form, setForm] = useState({ fullName: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // For now just simulate
    setTimeout(() => {
      setLoading(false);
      alert('הבקשה נשלחה — נציג יחזור אליך בהקדם');
    }, 800);
  };

  return (
    <div className="newchat-page">
      <div className="newchat-container">
        <h1 className="nc-title">פתח שיחה חדשה</h1>
        <p className="nc-sub">מלא את הפרטים ונחבר אותך לנציג בהקדם</p>

        <form className="nc-card" onSubmit={handleSubmit} dir="rtl">
          <div className="nc-row two-cols">
            <label className="nc-label">
              שם מלא
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="הזן את שמך" required />
            </label>

            <label className="nc-label">
              אימייל
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
            </label>
          </div>

          <label className="nc-label">
            נושא הפנייה
            <select name="subject" value={form.subject} onChange={handleChange} required>
              <option value="">בחר נושא...</option>
              <option value="support">תמיכה</option>
              <option value="sales">מכירות</option>
              <option value="other">אחר</option>
            </select>
          </label>

          <label className="nc-label">
            הודעה (אופציונלי)
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="תאר בקצרה את הפנייה שלך..." />
          </label>

          <button className="nc-submit" type="submit" disabled={loading}>
            {loading ? 'שולח...' : 'הצטרף לתור ✉️'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewChat;
