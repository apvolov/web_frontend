import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { registerUser, clearUserError } from "../../store/slices/userSlice";
import { ROUTES } from "../../Routes";
import { AuthInput } from "../../components/AuthInput/AuthInput";
import { resetFilters } from "../../store/slices/filterSlice";
import "../LoginPage/LoginPage.css";
import "./RegisterPage.css";

export const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuth, isLoading, error } = useAppSelector((state) => state.user);
  
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuth) {
      dispatch(resetFilters());
      navigate(ROUTES.SERVICES);
    }
    return () => {
      dispatch(clearUserError());
    };
  }, [isAuth, navigate, dispatch]);

  const handleFieldChange = (setter: (val: string) => void) => (value: string) => {
    setter(value);
    if (validationError) setValidationError(null);
    if (error) dispatch(clearUserError());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError("Пароли не совпадают");
      return;
    }

    if (login && password) {
      dispatch(registerUser({ login, password }));
    }
  };

  return (
    <div className="login-container">
      <div className="auth-card">
        <h2 className="auth-title">Регистрация</h2>
        
        <form onSubmit={handleSubmit}>
          <AuthInput
            id="login"
            label="Логин"
            type="text"
            value={login}
            onChange={handleFieldChange(setLogin)}
            required
          />

          <AuthInput
            id="password"
            label="Пароль"
            type="password"
            value={password}
            onChange={handleFieldChange(setPassword)}
            required
          />

          <AuthInput
            id="confirmPassword"
            label="Подтвердите пароль"
            type="password"
            value={confirmPassword}
            onChange={handleFieldChange(setConfirmPassword)}
            required
          />

          {(error || validationError) && (
            <div className="auth-error">
              {validationError || error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-auth" 
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "Создать аккаунт"}
          </button>
        </form>
      </div>
    </div>
  );
};