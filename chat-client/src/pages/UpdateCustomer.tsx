import React from 'react';
import { useUpdateCustomer } from '../hooks/useUpdateCustomer.hook';
import UpdateProfileForm from '../component/UpdateProfileForm';

const UpdateCustomer: React.FC = () => {
  const { formData, handleChange, handleSubmit, handleCancel, loading, error } = useUpdateCustomer();

  return (
    <UpdateProfileForm
      title="עדכון פרטים אישיים"
      subtitle="ערוך את פרטי ההתחברות שלך למערכת"
      fields={[
        { name: 'nameCust', label: 'שם מלא', type: 'text', value: formData.nameCust || '', placeholder: 'הזן את שמך המלא', required: true },
        { name: 'emailCust', label: 'כתובת אימייל', type: 'email', value: formData.emailCust || '', placeholder: 'example@email.com', required: true },
        { name: 'passwordCust', label: 'סיסמה חדשה', type: 'password', value: formData.passwordCust || '', placeholder: 'אם אין ברצונך לשנות סיסמה, השאר ריק' },
      ]}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={loading}
      error={error}
    />
  );
};

export default UpdateCustomer;









// import React, { useState } from 'react';
// import '../styles/UpdateRepresentative.css';
// import { useUpdateCustomer } from '../hooks/useUpdateCustomer.hook';

// const UpdateCustomer: React.FC = () => {
//     const {
//         formData,
//         handleChange,
//         handleSubmit,
//         handleCancel,
//         loading,
//         error
//     } = useUpdateCustomer();

//     // סטייט לניהול תצוגת הסיסמה
//     const [showPassword, setShowPassword] = useState(false);

//     return (
//         <div className="update-rep-page">
//             <div className="update-rep-container">

//                 <header className="update-rep-header">
//                     <div className="header-icon">⚙️</div>
//                     <div className="header-texts">
//                         <h1>עדכון פרטים אישיים</h1>
//                         <p>ערוך את פרטי ההתחברות שלך למערכת </p>
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
//                                     name="nameCust"
//                                     className="rep-input"
//                                     value={formData.nameCust || ''}
//                                     onChange={handleChange}
//                                     placeholder="הזן את שמך המלא"
//                                     required
//                                 />
//                             </div>

//                             <div className="input-group">
//                                 <label className="input-label">כתובת אימייל</label>
//                                 <input
//                                     type="email"
//                                     name="emailCust"
//                                     className="rep-input"
//                                     value={formData.emailCust || ''}
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
//                                         name="passwordCust"
//                                         className="rep-input"
//                                         value={formData.passwordCust || ''}
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

// export default UpdateCustomer;