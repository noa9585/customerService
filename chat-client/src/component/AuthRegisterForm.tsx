import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CustomerRegister.css';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  placeholder?: string;
}

interface AuthRegisterFormProps {
  title: string;
  fields: Field[];
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

const AuthRegisterForm: React.FC<AuthRegisterFormProps> = ({
  title,
  fields,
  onChange,
  onSubmit,
  loading,
  error,
  footerText,
  footerLinkText,
  footerLinkTo,
}) => {
  return (
    <div className="register-container">
      <div className="chat-card">
        <div className="logo-section">
          <span className="icon">📝</span>
          <h1>{title}</h1>
        </div>

        <form onSubmit={onSubmit} className="register-form">
          {fields.map((field) => (
            <div key={field.name} className="form-item">
              <label>{field.label}</label>
              <input
                type={field.type}
                required
                value={field.value}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
              />
            </div>
          ))}

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="loader"></span> : 'הרשמה למערכת'}
          </button>
        </form>

        <p className="footer-link">
          {footerText} <Link to={footerLinkTo}>{footerLinkText}</Link>
        </p>
      </div>
    </div>
  );
};

export default AuthRegisterForm;