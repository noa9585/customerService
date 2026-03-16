import React, { useState } from 'react';
import '../styles/UpdateRepresentative.css';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  placeholder?: string;
  required?: boolean;
}

interface UpdateProfileFormProps {
  title: string;
  subtitle: string;
  fields: Field[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
}

const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  title,
  subtitle,
  fields,
  onChange,
  onSubmit,
  onCancel,
  loading,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="update-rep-page">
      <div className="update-rep-container">
        <header className="update-rep-header">
          <div className="header-icon">⚙️</div>
          <div className="header-texts">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </header>

        <main className="update-control-panel">
          {error && <div className="update-error-msg">⚠️ {error}</div>}

          <form onSubmit={onSubmit}>
            <div className="form-grid">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={`input-group ${field.type === 'password' ? 'full-width' : ''}`}
                >
                  <label className="input-label">{field.label}</label>
                  {field.type === 'password' ? (
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name={field.name}
                        className="rep-input"
                        value={field.value}
                        onChange={onChange}
                        placeholder={field.placeholder}
                        dir="ltr"
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? '👁️' : '🔒'}
                      </button>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      className="rep-input"
                      value={field.value}
                      onChange={onChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      dir={field.type === 'email' ? 'ltr' : undefined}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="update-action-buttons">
              <button
                type="submit"
                className="btn-update-action btn-save"
                disabled={loading}
              >
                {loading ? 'שומר שינויים...' : '💾 שמור עדכונים'}
              </button>
              <button
                type="button"
                className="btn-update-action btn-cancel"
                onClick={onCancel}
                disabled={loading}
              >
                ביטול וחזרה
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default UpdateProfileForm;