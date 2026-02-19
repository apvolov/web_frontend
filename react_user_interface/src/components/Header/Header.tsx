import { type FC } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { logoutUser } from "../../store/slices/userSlice";
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

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(resetDraft());
    dispatch(resetFilters());
    navigate(ROUTES.LOGIN);
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

              {isAdmin ? (
                <Link 
                  to={ROUTES.REQUESTS} 
                  className={`my-requests-link ${isHistoryActive}`}
                >
                  Реестр всех заявок
                </Link>
              ) : (
                <>
                  <Link 
                    to={ROUTES.REQUESTS} 
                    className={`my-requests-link ${isHistoryActive}`}
                  >
                    Мои заявки
                  </Link>
                </>
              )}
              
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