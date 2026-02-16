import { useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { HomePage, PrincipalitiesPage, PrincipalityPage } from "./pages";
import { BreadCrumbs } from "./components/BreadCrumbs";
import defaultMainLogo from "./assets/main_logo.png";
import { ROUTES } from './Routes';
import { invoke } from "@tauri-apps/api/core";

function App() {
  useEffect(() => {
    invoke('tauri', { cmd: 'create' })
      .then(() => { console.log("Tauri launched") })
      .catch(() => { console.log("Tauri not launched (running in browser)") });

    return () => {
      invoke('tauri', { cmd: 'close' })
        .then(() => { console.log("Tauri closed") })
        .catch(() => { console.log("Error on close") });
    };
  }, []);

  return (
    <HashRouter>
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
    </HashRouter>
  );
}

export default App;