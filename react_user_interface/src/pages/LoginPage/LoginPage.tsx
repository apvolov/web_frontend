import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { loginUser, clearUserError } from "../../store/slices/userSlice";
import { ROUTES } from "../../Routes";
import { AuthInput } from "../../components/AuthInput/AuthInput";
import { resetFilters } from "../../store/slices/filterSlice";
import "./LoginPage.css";

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuth, isLoading, error } = useAppSelector((state) => state.user);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuth) {
      dispatch(resetFilters()); // <-- Сбрасываем поиск сразу после входа
      navigate(ROUTES.SERVICES);
    }
    return () => {
      dispatch(clearUserError());
    };
  }, [isAuth, navigate, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login && password) {
      dispatch(loginUser({ login, password }));
    }
  };

  return (
    <div className="login-container">
      <div className="auth-card">
        <h2 className="auth-title">Вход в систему</h2>
        
        <form onSubmit={handleSubmit}>
          <AuthInput
            id="login"
            label="Логин"
            type="text"
            value={login}
            onChange={setLogin}
            required
          />

          <AuthInput
            id="password"
            label="Пароль"
            type="password"
            value={password}
            onChange={setPassword}
            required
          />

          {error && <div className="auth-error">{error}</div>}

          <button 
            type="submit" 
            className="btn-auth" 
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "Войти"}
          </button>

          <div className="auth-footer">
            <span className="auth-footer-text">Новый пользователь?</span>
            <span className="auth-link" onClick={() => navigate(ROUTES.REGISTER)}>Зарегистрироваться</span>
          </div>
        </form>
      </div>
    </div>
  );
};