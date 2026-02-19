import { type FC, type ChangeEvent } from 'react';
import './AuthInput.css';

interface AuthInputProps {
  id: string;
  label: string;
  type: 'text' | 'password';
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

export const AuthInput: FC<AuthInputProps> = ({ id, label, type, value, onChange, required }) => {
  return (
    <div className="auth-input-group">
      <label htmlFor={id} className="auth-label">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        className="auth-field"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        required={required}
        autoComplete={type === 'password' ? 'current-password' : 'username'}
      />
    </div>
  );
};