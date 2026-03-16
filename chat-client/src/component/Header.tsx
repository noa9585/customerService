import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/index';
import { logout } from '../store/slices/authSlice';
import { CustomerChat } from '../types/customer.types';
import { Representative } from '../types/representative.types';
import '../styles/Header.css';
import { logoutCustomer } from '../services/customer.service';
import { logoutRepresentative } from '../services/representative.service';

const Header: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isAuthenticated, userType, user } = useSelector((state: RootState) => state.auth);

    const userName = userType === 'customer'
        ? (user as CustomerChat)?.nameCust
        : (user as Representative)?.nameRepr;

    const handleLogout = async () => {
        try {
            if (userType === 'customer') {
                const cust = user as CustomerChat;
                if (cust?.idCustomer) await logoutCustomer(cust.idCustomer);
            } else if (userType === 'representative') {
                const rep = user as Representative;
                if (rep?.idRepresentative) await logoutRepresentative(rep.idRepresentative);
            }

            // מגיע לכאן רק אם השרת הצליח
            dispatch(logout());
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('representativeToken');
            localStorage.removeItem('representativeUser');
            navigate('/login');

        } catch (e) {
            console.error('Logout failed', e);
            alert('ההתנתקות נכשלה. אנא נסה שוב.');
        }
    };

    return (
        <header className="header">
            <div className="header-inner">

                {/* לוגו */}
                <Link to="/" className="header-logo">
                    <span className="header-logo-icon">💬</span>
                    <span className="header-logo-text">QuickChat</span>
                </Link>

                {/* ניווט */}
                {isAuthenticated && (
                    <nav className="header-nav">
                        {userType === 'customer' && (
                            <>
                                <Link to="/new-chat" className="header-link">פתח שיחה חדשה</Link>
                                <Link to="/contact-us" className="header-link">עוד עלינו</Link>
                                <Link to="/update-customer" className="header-link">עדכון פרטים</Link>
                            </>
                        )}
                        {userType === 'representative' && (
                            <>
                                <Link to="/representative-dashboard" className="header-link">לוח מחוונים</Link>
                                <Link to="/update-representative" className="header-link">עדכון פרטים</Link>
                            </>
                        )}
                        {/* {userType === 'admin' && (
                            <Link to="/admin" className="header-link">ניהול</Link>
                        )} */}
                    </nav>
                )}

                {/* משתמש + התנתקות */}
                <div className="header-actions">
                    {isAuthenticated ? (
                        <>
                            <span className="header-username">שלום, {userName}</span>
                            <button className="header-logout-btn" onClick={handleLogout}>
                                התנתקות
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="header-login-btn">התחברות</Link>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Header;