import "./App.css";
import ClientHomePage from "./ClientPage/ClientHomePage";
import AdminHomePage from "./AdminPage/AdminHomepage";
import Login from "./ClientPage/LoginPage";
import SignUp from "./ClientPage/SignUpPage";
import Nav from "./Component/NavbarPreview";
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Nav />
      </div>
      <Routes>
        <Route path="/ClientHome" element={<ClientHomePage />} />
        <Route path="/AdminHome" element={<AdminHomePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </BrowserRouter>

  );
}
export default App;
