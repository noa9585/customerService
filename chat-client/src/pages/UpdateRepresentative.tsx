import React from 'react';
import { useUpdateRepresentative } from '../hooks/useUpdateRepresentative.hook';
import UpdateProfileForm from '../component/UpdateProfileForm';

const UpdateRepresentative: React.FC = () => {
  const { formData, handleChange, handleSubmit, handleCancel, loading, error } = useUpdateRepresentative();

  return (
    <UpdateProfileForm
      title="עדכון פרטים אישיים"
      subtitle="ערוך את פרטי ההתחברות שלך למערכת הנציגים"
      fields={[
        { name: 'nameRepr', label: 'שם מלא', type: 'text', value: formData.nameRepr || '', placeholder: 'הזן את שמך המלא', required: true },
        { name: 'emailRepr', label: 'כתובת אימייל', type: 'email', value: formData.emailRepr || '', placeholder: 'example@email.com', required: true },
        { name: 'passwordRepr', label: 'סיסמה חדשה', type: 'password', value: formData.passwordRepr || '', placeholder: 'אם אין ברצונך לשנות סיסמה, השאר ריק' },
      ]}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={loading}
      error={error}
    />
  );
};

export default UpdateRepresentative;







// // UpdateRepresentative.tsx - מותאם לדאשבורד, אייקון מוצמד לצד ונקי לחלוטין
// import React, { useState } from 'react';
// import '../styles/UpdateRepresentative.css';
// import { useUpdateRepresentative } from '../hooks/useUpdateRepresentative.hook';

// const UpdateRepresentative: React.FC = () => {
//     const {
//         formData,
//         handleChange,
//         handleSubmit,
//         handleCancel,
//         loading,
//         error
//     } = useUpdateRepresentative();

//     // סטייט לניהול תצוגת הסיסמה
//     const [showPassword, setShowPassword] = useState(false);

//     return (
//         <div className="update-rep-page">
//             <div className="update-rep-container">

//                 <header className="update-rep-header">
//                     <div className="header-icon">⚙️</div>
//                     <div className="header-texts">
//                         <h1>עדכון פרטים אישיים</h1>
//                         <p>ערוך את פרטי ההתחברות שלך למערכת הנציגים</p>
//                     </div>
//                 </header>

//                 <main className="update-control-panel">
//                     {error && <div className="update-error-msg">⚠️ {error}</div>}

//                     <form onSubmit={handleSubmit}>
//                         <div className="form-grid">

//                             <div className="input-group">
//                                 <label className="input-label">שם מלא</label>
//                                 <input
//                                     type="text"
//                                     name="nameRepr"
//                                     className="rep-input"
//                                     value={formData.nameRepr || ''}
//                                     onChange={handleChange}
//                                     placeholder="הזן את שמך המלא"
//                                     required
//                                 />
//                             </div>

//                             <div className="input-group">
//                                 <label className="input-label">כתובת אימייל</label>
//                                 <input
//                                     type="email"
//                                     name="emailRepr"
//                                     className="rep-input"
//                                     value={formData.emailRepr || ''}
//                                     onChange={handleChange}
//                                     placeholder="example@email.com"
//                                     required
//                                     dir="ltr"
//                                 />
//                             </div>

//                             {/* --- שדה הסיסמה המעודכן עם העינית הנקייה והמוצמדת --- */}

//                             {/* --- שדה הסיסמה המעודכן --- */}
//                             <div className="input-group full-width">
//                                 <label className="input-label">סיסמה חדשה</label>
//                                 <div className="password-input-wrapper">
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         name="passwordRepr"
//                                         className="rep-input"
//                                         value={formData.passwordRepr || ''}
//                                         onChange={handleChange}
//                                         placeholder="אם אין ברצונך לשנות סיסמה, השאר את השדה ריק"
//                                         dir="ltr"
//                                     />
//                                     <button
//                                         type="button"
//                                         className="toggle-password-btn"
//                                         onClick={(e) => {
//                                             e.preventDefault(); // מונע ריענון דף בטעות
//                                             setShowPassword(!showPassword);
//                                         }}
//                                     >
//                                         {showPassword ? '👁️' : '🔒'}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="update-action-buttons">
//                             <button
//                                 type="submit"
//                                 className="btn-update-action btn-save"
//                                 disabled={loading}
//                             >
//                                 {loading ? 'שומר שינויים...' : '💾 שמור עדכונים'}
//                             </button>

//                             <button
//                                 type="button"
//                                 className="btn-update-action btn-cancel"
//                                 onClick={handleCancel}
//                                 disabled={loading}
//                             >
//                                 ביטול וחזרה
//                             </button>
//                         </div>
//                     </form>
//                 </main>

//             </div>
//         </div>
//     );
// };

// export default UpdateRepresentative;