import { Routes, Route, Navigate, BrowserRouter, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ClientHomePage from "./clientPage/clientHomePage";
import AdminHomePage from "./adminPage/AdminHomepage";
import Login from "./clientPage/loginPage";
import SignUp from "./clientPage/signUpPage";
import Nav from "./component/navbarPreview";
import NavbarLogin from "./component/navbarLogin";
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:1337";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/ClientHome');
  };

  const handleLogout = () => {
    // setIsAuthenticated(false);
    // navigate('/Login');
    // console.log('User has logged out');
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div>
      {isAuthenticated ? (
        <NavbarLogin onLogout={handleLogout} />
      ) : (
        <Nav />
      )}
      <Routes>
        <Route path="/ClientHome" element={<ClientHomePage />} />
        <Route path="/AdminHome" element={<AdminHomePage />} />
        <Route path="/Login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/Login" />} /> {/* Default route */}
      </Routes>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
