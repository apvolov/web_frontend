import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { HomePage, PrincipalitiesPage, PrincipalityPage } from "./pages";
import { BreadCrumbs } from "./components/BreadCrumbs"; // 1. Не забудь импортировать!
import defaultMainLogo from "./assets/main_logo.png";
import { ROUTES } from './Routes';

function App() {
  return (
    <BrowserRouter>
      <Navbar bg="white" className="main-header shadow-none"> 
        <div className="header-container"> 
          <Link to="/" className="header-logo-link">
            <img src={defaultMainLogo} className="header-logo" alt="Logo" />
          </Link>
        </div>
      </Navbar>

      <main className="content-wrapper">
         <div className="container"> 
           <BreadCrumbs /> 
         </div>

         <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path={ROUTES.SERVICES} element={<PrincipalitiesPage />} />
            <Route path={ROUTES.SERVICE_DETAIL} element={<PrincipalityPage />} />
         </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;