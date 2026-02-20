import { type FC } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { logoutSuccess } from "../../store/slices/userSlice";
import { resetDraft } from "../../store/slices/populationPrincipalityDraftSlice";
import { resetFilters } from '../../store/slices/filterSlice';
import { ROUTES } from '../../Routes';
import defaultMainLogo from "../../assets/main_logo.png";
import userIcon from "../../assets/icon_user.svg";
import './Header.css';

export const Header: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuth, login, isAdmin } = useAppSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/users/logout", 
        {}, 
        { withCredentials: true }
      );
    } catch (e) {
      console.error("Ошибка при логауте на сервере", e);
    } finally {
      localStorage.removeItem('userLogin');
      localStorage.removeItem('userRole');

      dispatch(logoutSuccess());
      dispatch(resetDraft());
      dispatch(resetFilters());
      navigate(ROUTES.LOGIN);
    }
  };

  const isHistoryActive = location.pathname === ROUTES.REQUESTS ? "active-link" : "";

  return (
    <Navbar bg="white" className="main-header shadow-none">
      <div className="header-container">
        <Link to="/" className="header-logo-link">
          <img src={defaultMainLogo} className="header-logo" alt="Logo" />
        </Link>

        <div className="header-auth-block">
          {isAuth ? (
            <>
              <Link to={ROUTES.PROFILE} className="profile-link">
                <img src={userIcon} alt="Profile" className="header-user-icon" />
                <span className="user-name">
                    <strong>{login}</strong>
                </span>
              </Link>

              <Link 
                to={ROUTES.REQUESTS} 
                className={`my-requests-link ${isHistoryActive}`}
              >
                {isAdmin ? "Реестр всех заявок" : "Мои заявки"}
              </Link>
              
              <button className="btn-logout" onClick={handleLogout} style={{ marginLeft: '15px' }}>
                Выйти
              </button>
            </>
          ) : (
            <Link to={ROUTES.LOGIN} className="btn-login">Войти</Link>
          )}
        </div>
      </div>
    </Navbar>
  );
};