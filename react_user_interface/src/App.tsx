import { useEffect } from 'react'; 
import axios from 'axios'; 
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useAppDispatch } from "./store/hook"; 
import { setUser } from "./store/slices/userSlice"; 
import { HomePage, PrincipalitiesPage, PrincipalityPage, LoginPage, RegisterPage, PopulationDraftPage, ProfilePage, PopulationsPage, PopulationDetailsPage } from "./pages";
import { Header } from "./components/Header/Header"; 
import { BreadCrumbs } from "./components/BreadCrumbs/BreadCrumbs";
import { ROUTES } from './Routes';
import './index.css';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/me", {
          withCredentials: true
        });
        
        if (response.data) {
          dispatch(setUser({
            login: response.data.login,
            is_admin: response.data.is_admin
          }));
        }
      } catch (e) {
        console.log("Пользователь не авторизован");
      }
    };

    initAuth();
  }, [dispatch]);

  return (
    <HashRouter>
      <Header />

      <main className="content-wrapper">
          <div className="container"> 
            <BreadCrumbs /> 
          </div>

          <Routes>
             <Route path="/" element={<HomePage />} />
             <Route path={ROUTES.SERVICES} element={<PrincipalitiesPage />} />
             <Route path={ROUTES.SERVICE_DETAIL} element={<PrincipalityPage />} />
             <Route path={ROUTES.LOGIN} element={<LoginPage />} />
             <Route path={ROUTES.REGISTER} element={<RegisterPage />} /> 
             <Route path={ROUTES.POPULATION_DRAFT} element={<PopulationDraftPage />} />
             <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
             <Route path={ROUTES.REQUESTS} element={<PopulationsPage />} />
             <Route path={ROUTES.REQUEST_DETAIL} element={<PopulationDetailsPage />} />
          </Routes>
      </main>
    </HashRouter>
  );
}

export default App;