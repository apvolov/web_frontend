import { type FC, useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { updateCurrentUser } from "../../store/slices/userSlice"; // Убедись, что путь верный
import "./ProfilePage.css";
import userIcon from "../../assets/icon_user.svg";

export const ProfilePage: FC = () => {
  const dispatch = useAppDispatch();
  const { login, isLoading, error } = useAppSelector((state) => state.user);
  const [mode, setMode] = useState<'view' | 'editLogin' | 'editPassword'>('view');
  const [newLogin, setNewLogin] = useState(login ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    setNewLogin(login ?? "");
  }, [login]);

  const handleCancel = () => {
    setMode('view');
    setNewPassword("");
    setNewLogin(login ?? "");
    setMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const updateData = mode === 'editLogin' 
      ? { login: newLogin } 
      : { password: newPassword };

    if (mode === 'editLogin' && !newLogin.trim()) {
        setMessage({ type: 'error', text: 'Логин не может быть пустым' });
        return;
    }

    const result = await dispatch(updateCurrentUser(updateData));

    if (updateCurrentUser.fulfilled.match(result)) {
      setMessage({ type: 'success', text: mode === 'editLogin' ? 'Логин изменен' : 'Пароль изменен' });
      setTimeout(() => {
        setMode('view');
        setMessage(null);
      }, 2000);
      setNewPassword("");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={userIcon} alt="User" className="profile-icon" />
        <h2 className="profile-title">Личный кабинет</h2>

        {(error || message) && (
          <div className={`profile-message ${message?.type || 'error'}`}>
            {message?.text || error}
          </div>
        )}

        {mode === 'view' && (
          <div className="profile-info">
            <div className="info-group">
              <label>Логин:</label>
              <span>{login}</span>
            </div>
            <div className="info-group">
              <label>Пароль:</label>
              <span>********</span>
            </div>
            <div className="profile-actions">
              <button className="btn-change-login" onClick={() => setMode('editLogin')}>
                Поменять логин
              </button>
              <button className="btn-change-password" onClick={() => setMode('editPassword')}>
                Поменять пароль
              </button>
            </div>
          </div>
        )}

        {(mode === 'editLogin' || mode === 'editPassword') && (
          <form className="profile-form" onSubmit={handleSave}>
            <h3>{mode === 'editLogin' ? 'Смена логина' : 'Смена пароля'}</h3>
            
            <input 
              type={mode === 'editLogin' ? "text" : "password"} 
              value={mode === 'editLogin' ? newLogin : newPassword} 
              onChange={(e) => mode === 'editLogin' ? setNewLogin(e.target.value) : setNewPassword(e.target.value)} 
              placeholder={mode === 'editLogin' ? "Новый логин" : "Новый пароль"}
              disabled={isLoading}
            />

            <div className="form-buttons">
              <button type="submit" className="btn-save" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить"}
              </button>
              <button type="button" className="btn-cancel" onClick={handleCancel} disabled={isLoading}>
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};