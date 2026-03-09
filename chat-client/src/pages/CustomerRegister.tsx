import React, { useState } from 'react';
import { registerCustomer } from '../services/customer.service';
import { CustomerRegister as CustomerRegisterType } from '../types/customer.types';
import '../styles/CustomerRegister.css'; // ייבוא הקובץ שהפרדנו
import { Link } from 'react-router-dom';
import { useCustomerRegister } from '../hooks/useCustomerRegister.hook';
const CustomerRegister: React.FC = () => {
    const { formData, setFormData, error, loading, handleSubmit } = useCustomerRegister();

    return (
        <div className="register-container">
            <div className="chat-card">
                <div className="logo-section">
                    <span className="icon">📝</span>
                    <h1>יצירת חשבון</h1>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-item">
                        <label>שם מלא</label>
                        <input
                            type="text"
                            required
                            value={formData.nameCust}
                            onChange={(e) => setFormData({ ...formData, nameCust: e.target.value })}
                            placeholder="ישראל ישראלי"
                        />
                    </div>

                    <div className="form-item">
                        <label>אימייל</label>
                        <input
                            type="email"
                            required
                            value={formData.emailCust}
                            onChange={(e) => setFormData({ ...formData, emailCust: e.target.value })}
                            placeholder="example@mail.com"
                        />
                    </div>

                    <div className="form-item">
                        <label>סיסמה</label>
                        <input
                            type="password"
                            required
                            value={formData.passwordCust}
                            onChange={(e) => setFormData({ ...formData, passwordCust: e.target.value })}
                            placeholder="לפחות 6 תווים"
                        />
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? <span className="loader"></span> : 'הרשמה למערכת'}
                    </button>
                </form>

                <p className="footer-link">
                    כבר רשום? <Link to="/login">התחבר כאן</Link>
                </p>


            </div>
        </div>
    );
};

export default CustomerRegister;