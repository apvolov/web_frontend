import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomePage, PrincipalitiesPage, PrincipalityPage, LoginPage, RegisterPage, PopulationDraftPage, ProfilePage, PopulationsPage, PopulationDetailsPage } from "./pages";
import { Header } from "./components/Header/Header"; 
import { BreadCrumbs } from "./components/BreadCrumbs/BreadCrumbs";
import { ROUTES } from './Routes';
import './index.css';

function App() {
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