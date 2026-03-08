import React from 'react';
import '../styles/NewChat.css';
import { useNewChatPage } from '../hooks/useNewChatPage';


const NewChat: React.FC = () => {
    const { form, loading, error, handleChange, handleSubmit, topics, selectedTopic, setSelectedTopic, topicsError, decodedToken } = useNewChatPage((data) => {
        alert('הבקשה נשלחה — נציג יחזור אליך בהקדם');
    });
console.log(decodedToken);

    return (
        <div className="newchat-page">
            <div className="newchat-container">
                <h1 className="nc-title">פתח שיחה חדשה</h1>
                <p className="nc-sub">מלא את הפרטים ונחבר אותך לנציג בהקדם</p>

                {decodedToken && (
                    <div style={{ marginBottom: 12 }}>
                        <strong>מזוהה כ:</strong> {decodedToken.nameCust || decodedToken.name || decodedToken.email || decodedToken.sub}
                    </div>
                )}

                <form className="nc-card" onSubmit={handleSubmit} dir="rtl">
                    <div className="nc-row two-cols">
                        <label className="nc-label">
                            שם מלא
                            <input name="fullName" value={form.idSend} onChange={handleChange} placeholder="הזן את שמך" required />
                        </label>

                        <label className="nc-label">
                            אימייל
                            <input name="email" type="email" value={form.idSend} onChange={handleChange} placeholder="your@email.com" required />
                        </label>
                    </div>

                    <label className="nc-label">
                        נושא הפנייה
                        
                        <div className="select-wrapper">
                    <select 
                        value={selectedTopic} 
                        onChange={(e) => setSelectedTopic(e.target.value)}
                    >
                        <option value="">בחר נושא פנייה...</option>
                        {topics.map(t => (
                            <option key={t.idTopic} value={t.idTopic}>
                                {t.nameTopic}
                            </option>
                        ))}
                    </select>
                </div>
                    </label>

                    <label className="nc-label">
                        הודעה (אופציונלי)
                        <textarea name="message" value={form.message} onChange={handleChange} placeholder="תאר בקצרה את הפנייה שלך..." />
                    </label>

                    {error && <p style={{ color: 'red', fontSize: 14 }}>{error}</p>}

                    <button className="nc-submit" type="submit" disabled={loading}>
                        {loading ? 'שולח...' : 'הצטרף לתור ✉️'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewChat;
