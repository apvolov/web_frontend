import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { authStart, setUser, authError, clearUserError } from "../../store/slices/userSlice";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError("Пароли не совпадают");
      return;
    }

    if (login && password) {
      dispatch(authStart());

      try {
        const response = await axios.post(
          "http://localhost:8080/api/users/register",
          { login, password },
          { withCredentials: true }
        );

        const userData = response.data;

        dispatch(
          setUser({
            login: userData.login,
            is_admin: userData.role === "admin" || userData.is_admin === true,
          })
        );

        localStorage.setItem("userLogin", userData.login);
        if (userData.role === "admin" || userData.is_admin) {
            localStorage.setItem("userRole", "admin");
        }

      } catch (err: any) {
        const errMsg = err.response?.data?.error || "Ошибка при регистрации";
        dispatch(authError(errMsg));
      }
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