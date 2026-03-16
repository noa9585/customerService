// RepresentativeRegister.tsx
import React from 'react';
import { useRepresentativeRegister } from '../hooks/useRepresentativeRegister';
import AuthRegisterForm from '../component/AuthRegisterForm';
import { Link } from 'react-router-dom';
import '../styles/CustomerRegister.css';

const RepresentativeRegister: React.FC = () => {
  const { formData, setFormData, error, loading, handleSubmit, registered } = useRepresentativeRegister();

  // ✅ מסך אישור המתנה לאחר הרשמה מוצלחת
  if (registered) {
    return (
      <div className="register-container" dir="rtl">
        <div className="chat-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>⏳</div>
          <h2 style={{ color: '#0f172a', marginBottom: '12px', fontSize: '22px' }}>
            הבקשה נשלחה בהצלחה!
          </h2>
          <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '24px', fontSize: '15px' }}>
            בקשת ההצטרפות שלך התקבלה ומחכה לאישור מנהל המערכת.
            <br />
            לאחר האישור תוכל להתחבר ולהתחיל לעבוד.
          </p>
          <div style={{
            background: '#fef9c3', border: '1px solid #fde047',
            borderRadius: '12px', padding: '14px 20px',
            color: '#713f12', fontSize: '14px', marginBottom: '28px'
          }}>
            💡 שמור את פרטי ההתחברות שלך — תזדקק להם כאשר תאושר
          </div>
          <Link
            to="/RepresentativeLogin"
            style={{
              display: 'inline-block', padding: '12px 32px',
              background: '#1d4ed8', color: '#fff',
              borderRadius: '10px', textDecoration: 'none',
              fontWeight: '600', fontSize: '15px'
            }}
          >
            עבור לדף הכניסה
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthRegisterForm
      title="הצטרפות כנציג"
      fields={[
        { name: 'nameRepr',     label: 'שם מלא',  type: 'text',     value: formData.nameRepr,     placeholder: 'ישראל ישראלי' },
        { name: 'emailRepr',    label: 'אימייל',   type: 'email',    value: formData.emailRepr,    placeholder: 'example@mail.com' },
        { name: 'passwordRepr', label: 'סיסמה',    type: 'password', value: formData.passwordRepr, placeholder: 'לפחות 6 תווים' },
      ]}
      onChange={(field, value) => setFormData({ ...formData, [field]: value })}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      footerText="כבר רשום?"
      footerLinkText="התחבר כאן"
      footerLinkTo="/RepresentativeLogin"
    />
  );
};

export default RepresentativeRegister;




// import React, { useState } from 'react';
// import { registerRepresentative } from '../services/representative.service';
// import { RepresentativeRegister as RepresentativeRegisterType} from '../types/representative.types';
// import '../styles/CustomerRegister.css'; // ייבוא הקובץ שהפרדנו
// import { Link } from 'react-router-dom';
// import { useRepresentativeRegister } from '../hooks/useRepresentativeRegister';
// const RepresentativeRegister: React.FC = () => {
//        const { formData, setFormData, error, loading, handleSubmit } = useRepresentativeRegister();
//     return (
//         <div className="register-container">
//             <div className="chat-card">
//                 <div className="logo-section">
//                     <span className="icon">📝</span>
//                     <h1>יצירת חשבון</h1>
//                 </div>

//                 <form onSubmit={handleSubmit} className="register-form">
//                     <div className="form-item">
//                         <label>שם מלא</label>
//                         <input
//                             type="text"
//                             required
//                             value={formData.nameRepr}
//                             onChange={(e) => setFormData({ ...formData, nameRepr: e.target.value })}
//                             placeholder="ישראל ישראלי"
//                         />
//                     </div>

//                     <div className="form-item">
//                         <label>אימייל</label>
//                         <input
//                             type="email"
//                             required
//                             value={formData.emailRepr}
//                             onChange={(e) => setFormData({ ...formData, emailRepr: e.target.value })}
//                             placeholder="example@mail.com"
//                         />
//                     </div>

//                     <div className="form-item">
//                         <label>סיסמה</label>
//                         <input
//                             type="password"
//                             required
//                             value={formData.passwordRepr}
//                             onChange={(e) => setFormData({ ...formData, passwordRepr: e.target.value })}
//                             placeholder="לפחות 6 תווים"
//                         />
//                     </div>

//                     {error && <div className="error-msg">{error}</div>}

//                     <button type="submit" className="submit-btn" disabled={loading}>
//                         {loading ? <span className="loader"></span> : 'הרשמה למערכת'}
//                     </button>
//                 </form>

//                 <p className="footer-link">
//                     כבר רשום? <Link to="/RepresentativeLogin">התחבר כאן</Link>
//                 </p>


//             </div>
//         </div>
//     );
// };

// export default RepresentativeRegister;