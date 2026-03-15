import React from 'react';
import '../styles/NewChat.css';
import { useNewChatPage } from '../hooks/useNewChatPage.hook';

const NewChat: React.FC = () => {
  const {
    message, setMessage,
    loading, error,
    topics, selectedTopic, setSelectedTopic,
    topicsError, currentUser, openSession,
  } = useNewChatPage();

  return (
    <div className="newchat-page">
      <div className="newchat-container">
        <h1 className="nc-title">פתח שיחה חדשה</h1>
        <p className="nc-sub">מלא את הפרטים ונחבר אותך לנציג בהקדם</p>

        {currentUser && (
          <div style={{ marginBottom: 12 }}>
            <strong>:מזוהה כ</strong> {currentUser.nameCust || 'שם לא זמין'}
          </div>
        )}

        <form className="nc-card" onSubmit={openSession} dir="rtl">
          <div className="nc-row two-cols">

            {/* ✅ שם ואימייל — קריאה בלבד, מגיעים מ-Redux */}
            <label className="nc-label">
              שם מלא
              <input
                value={currentUser?.nameCust || ''}
                readOnly
                placeholder="שם לא זמין"
              />
            </label>

            <label className="nc-label">
              אימייל
              <input
                type="email"
                value={currentUser?.emailCust || ''}
                readOnly
                placeholder="אימייל לא זמין"
              />
            </label>
          </div>

          {/* נושא הפנייה */}
          <label className="nc-label">
            נושא הפנייה
            <div className="select-wrapper">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                required
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

          {/* ✅ הודעה — message + setMessage במקום form.message + handleChange */}
          <label className="nc-label">
            הודעה (אופציונלי)
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="תאר בקצרה את הפנייה שלך..."
            />
          </label>

          {topicsError && <p style={{ color: 'red', fontSize: 14 }}>{topicsError}</p>}
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






// import React from 'react';
// import '../styles/NewChat.css';
// import { useNewChatPage } from '../hooks/useNewChatPage.hook';
// // import { getNameFromPayload } from '../utils/jwt';



// const NewChat: React.FC = () => {
//     const { form, loading, error, handleChange, topics, selectedTopic, setSelectedTopic, topicsError, decodedToken ,openSession} = useNewChatPage((data) => {
//         alert('הבקשה נשלחה — נציג יחזור אליך בהקדם');
//     });
// // console.log(decodedToken);
//     // const nameFromToken = decodedToken ? getNameFromPayload(decodedToken) : null;

//     return (
//         <div className="newchat-page">
//             <div className="newchat-container">
//                 <h1 className="nc-title">פתח שיחה חדשה</h1>
//                 <p className="nc-sub">מלא את הפרטים ונחבר אותך לנציג בהקדם</p>

//                 {decodedToken && (
//                     <div style={{ marginBottom: 12 }}>
//                          {decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'שם לא זמין'}<strong>:מזוהה כ</strong>
//                     </div>
//                 )}

//                 <form className="nc-card" onSubmit={openSession} dir="rtl">
//                     <div className="nc-row two-cols">
//                         <label className="nc-label">
//                             שם מלא
//                             <input name="fullName" value={decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||'שם לא זמין'} onChange={handleChange} placeholder="הזן את שמך" required />
//                         </label>

//                         <label className="nc-label">
//                             אימייל
//                             <input name="email" type="email" value={ decodedToken?.email||'' } onChange={handleChange} placeholder="your@email.com" required />
//                         </label>
//                     </div>

//                     <label className="nc-label">
//                         נושא הפנייה
                        
//                         <div className="select-wrapper">
//                     <select 
//                         value={selectedTopic} 
//                         onChange={(e) => setSelectedTopic(e.target.value)}
//                     >
//                         <option value="">בחר נושא פנייה...</option>
//                         {topics.map(t => (
//                             <option key={t.idTopic} value={t.idTopic}>
//                                 {t.nameTopic}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                     </label>

//                     <label className="nc-label">
//                         הודעה (אופציונלי)
//                         <textarea name="message" value={form.message} onChange={handleChange} placeholder="תאר בקצרה את הפנייה שלך..." />
//                     </label>

//                     {error && <p style={{ color: 'red', fontSize: 14 }}>{error}</p>}

//                     <button className="nc-submit" type="submit" disabled={loading} >
//                         {loading ? 'שולח...' : 'הצטרף לתור ✉️'} 
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default NewChat;
