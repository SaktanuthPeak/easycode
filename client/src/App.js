import { Routes, Route, Navigate, BrowserRouter, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ClientHomePage from "./ClientPage/ClientHomePage";
import AdminHomePage from "./AdminPage/AdminHomepage";
import Login from "./ClientPage/LoginPage";
import SignUp from "./ClientPage/SignUpPage";
import Nav from "./Component/NavbarPreview";
import NavbarLogin from "./Component/navbarLogin";
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
    setIsAuthenticated(false);
    navigate('/Login');
    console.log('User has logged out');
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
