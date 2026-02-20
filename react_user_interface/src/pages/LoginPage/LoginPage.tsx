import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { setUser, authStart, authError, clearUserError } from "../../store/slices/userSlice"; // Новые экшены
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
      dispatch(resetFilters());
      navigate(ROUTES.SERVICES);
    }
    return () => {
      dispatch(clearUserError());
    };
  }, [isAuth, navigate, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (login && password) {
      dispatch(authStart());

      try {
        const response = await axios.post(
          "http://localhost:8080/api/users/login",
          { login, password },
          { withCredentials: true }
        );

        const userData = response.data.user;

        dispatch(
          setUser({
            login: userData.login,
            is_admin: userData.is_admin,
          })
        );

        localStorage.setItem("userLogin", userData.login);
        if (userData.is_admin) {
          localStorage.setItem("userRole", "admin");
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || "Неверный логин или пароль";
        dispatch(authError(errorMessage));
      }
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
            <span className="auth-link" onClick={() => navigate(ROUTES.REGISTER)}>
              Зарегистрироваться
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};