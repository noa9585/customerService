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
    <div className="nc-page" dir="rtl">

      {/* ── Background ─────────────────────────────────────────────── */}
      <div className="nc-bg">
        <div className="nc-orb nc-orb-1" />
        <div className="nc-orb nc-orb-2" />
      </div>

      <div className="nc-wrapper">

        {/* ── Right: Info panel ───────────────────────────────────── */}
        <div className="nc-info">
          <div className="nc-info-badge">
            <span className="nc-badge-dot" />
            נציגים זמינים עכשיו
          </div>
          <h1 className="nc-info-title">
            פתח שיחה<br />
            <span className="nc-info-accent">חדשה</span>
          </h1>
          <p className="nc-info-sub">
            מלא את הפרטים ונחבר אותך לנציג
            המתאים ביותר תוך דקות ספורות.
          </p>

          <div className="nc-info-steps">
            {[
              { icon: '📝', text: 'מלא את הטופס' },
              { icon: '⏳', text: 'המתן בתור החכם' },
              { icon: '💬', text: 'שוחח עם נציג' },
            ].map((s, i) => (
              <div key={i} className="nc-info-step">
                <span className="nc-step-icon">{s.icon}</span>
                <span>{s.text}</span>
              </div>
            ))}
          </div>

          {currentUser && (
            <div className="nc-user-chip">
              <div className="nc-user-avatar">
                {currentUser.nameCust?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <div className="nc-user-name">{currentUser.nameCust}</div>
                <div className="nc-user-email">{currentUser.emailCust}</div>
              </div>
            </div>
          )}
        </div>

        {/* ── Left: Form ──────────────────────────────────────────── */}
        <div className="nc-form-wrap">
          <form className="nc-form" onSubmit={openSession}>

            <div className="nc-form-header">
              <h2>פרטי הפנייה</h2>
              <p>כל השדות המסומנים ב-* חובה</p>
            </div>

            {/* שם ואימייל */}
            <div className="nc-row-2">
              <div className="nc-field">
                <label className="nc-field-label">שם מלא</label>
                <div className="nc-input-wrap nc-input-readonly">
                  <span className="nc-input-icon">👤</span>
                  <input
                    value={currentUser?.nameCust || ''}
                    readOnly
                    placeholder="שם לא זמין"
                  />
                </div>
              </div>
              <div className="nc-field">
                <label className="nc-field-label">אימייל</label>
                <div className="nc-input-wrap nc-input-readonly">
                  <span className="nc-input-icon">✉️</span>
                  <input
                    type="email"
                    value={currentUser?.emailCust || ''}
                    readOnly
                    placeholder="אימייל לא זמין"
                  />
                </div>
              </div>
            </div>

            {/* נושא */}
            <div className="nc-field">
              <label className="nc-field-label">נושא הפנייה *</label>
              <div className="nc-select-wrap">
                <span className="nc-input-icon">📋</span>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  required
                  className={selectedTopic ? 'nc-selected' : ''}
                >
                  <option value="">בחר נושא פנייה...</option>
                  {topics.map(t => (
                    <option key={t.idTopic} value={t.idTopic}>
                      {t.nameTopic}
                    </option>
                  ))}
                </select>
                <span className="nc-select-arrow">›</span>
              </div>
            </div>

            {/* הודעה */}
            <div className="nc-field">
              <label className="nc-field-label">
                תיאור הבעיה *
                <span className="nc-optional"></span>
              </label>
              <div className="nc-textarea-wrap">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="תאר בקצרה את הפנייה שלך — ככל שתפרט יותר, כך הנציג יוכל לעזור טוב יותר..."
                  rows={4}
                />
                <span className="nc-textarea-count">
                  {message.length} / 500
                </span>
              </div>
            </div>

            {/* שגיאות */}
            {(topicsError || error) && (
              <div className="nc-error">
                ⚠️ {topicsError || error}
              </div>
            )}

            {/* כפתור */}
            <button className="nc-submit-btn" type="submit" disabled={loading || !selectedTopic}>
              {loading ? (
                <span className="nc-spinner" />
              ) : (
                <>
                  <span>הצטרף לתור</span>
                  <span className="nc-submit-arrow">←</span>
                </>
              )}
            </button>

            <p className="nc-disclaimer">
              בלחיצה על הכפתור אתה מסכים לתנאי השימוש שלנו
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewChat;






// import React from 'react';
// import '../styles/NewChat.css';
// import { useNewChatPage } from '../hooks/useNewChatPage.hook';

// const NewChat: React.FC = () => {
//   const {
//     message, setMessage,
//     loading, error,
//     topics, selectedTopic, setSelectedTopic,
//     topicsError, currentUser, openSession,
//   } = useNewChatPage();

//   return (
//     <div className="newchat-page">
//       <div className="newchat-container">
//         <h1 className="nc-title">פתח שיחה חדשה</h1>
//         <p className="nc-sub">מלא את הפרטים ונחבר אותך לנציג בהקדם</p>

//         {currentUser && (
//           <div style={{ marginBottom: 12 }}>
//             <strong>:מזוהה כ</strong> {currentUser.nameCust || 'שם לא זמין'}
//           </div>
//         )}

//         <form className="nc-card" onSubmit={openSession} dir="rtl">
//           <div className="nc-row two-cols">

//             {/* ✅ שם ואימייל — קריאה בלבד, מגיעים מ-Redux */}
//             <label className="nc-label">
//               שם מלא
//               <input
//                 value={currentUser?.nameCust || ''}
//                 readOnly
//                 placeholder="שם לא זמין"
//               />
//             </label>

//             <label className="nc-label">
//               אימייל
//               <input
//                 type="email"
//                 value={currentUser?.emailCust || ''}
//                 readOnly
//                 placeholder="אימייל לא זמין"
//               />
//             </label>
//           </div>

//           {/* נושא הפנייה */}
//           <label className="nc-label">
//             נושא הפנייה
//             <div className="select-wrapper">
//               <select
//                 value={selectedTopic}
//                 onChange={(e) => setSelectedTopic(e.target.value)}
//                 required
//               >
//                 <option value="">בחר נושא פנייה...</option>
//                 {topics.map(t => (
//                   <option key={t.idTopic} value={t.idTopic}>
//                     {t.nameTopic}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </label>

//           {/* ✅ הודעה — message + setMessage במקום form.message + handleChange */}
//           <label className="nc-label">
//             הודעה (אופציונלי)
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="תאר בקצרה את הפנייה שלך..."
//             />
//           </label>

//           {topicsError && <p style={{ color: 'red', fontSize: 14 }}>{topicsError}</p>}
//           {error && <p style={{ color: 'red', fontSize: 14 }}>{error}</p>}

//           <button className="nc-submit" type="submit" disabled={loading}>
//             {loading ? 'שולח...' : 'הצטרף לתור ✉️'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NewChat;






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
