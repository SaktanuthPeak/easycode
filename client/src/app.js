import {
  Routes,
  Route,
  Navigate,
  BrowserRouter,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useRef } from "react";
import axios from "axios";
import AdminHomePage from "./adminPage/adminHomepage";
import Login from "./clientPage/loginPage";
import SignUp from "./clientPage/signUpPage";
import ClientHomePage from "./clientPage/clientHomePage";
import categoryPage from "./clientPage/categoryPage";
import CartPage from "./clientPage/cartPage";
import ProfilePage from "./clientPage/profilePage";
import learningPage from "./clientPage/learningPage";
import Nav from "./component/navbarPreview";
import NavbarLogin from "./component/navbarLogin";
import WebFooter from "./component/webFooter";
import WebDevPage from "./coursePage/webdevPage";
import iotPage from "./coursePage/iotPage";
import dataSciPage from "./coursePage/dataSciPage";
import cyberSecPage from "./coursePage/cyberSecPage";
import gameDevPage from "./coursePage/gameDevPage";
import aiPage from "./coursePage/aiPage";
import { CSSTransition, TransitionGroup } from "react-transition-group";

axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const nodeRef = useRef(null);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate("/clienthome");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    console.log("User has logged out");
    window.location.href = "/";
    localStorage.clear();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header>
        {isAuthenticated ? <NavbarLogin onLogout={handleLogout} /> : <Nav />}
      </header>
      {/* Main Content */}
      <main className="flex-grow">
        <TransitionGroup>
          <CSSTransition
            in={true}
            timeout={500}
            classNames="fade"
            unmountOnExit
            nodeRef={nodeRef}
          >
            <div ref={nodeRef}>
              <Routes>
                <Route path="/adminhome" element={<AdminHomePage />} />
                <Route path="/clienthome" element={<ClientHomePage />} />
                <Route path="/category-page" element={<categoryPage />} />
                <Route path="/my-learning" element={<learningPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/clienthome/web-dev" element={<WebDevPage />} />
                <Route path="/clienthome/data-sci" element={<dataSciPage />} />
                <Route
                  path="/clienthome/cyber-security"
                  element={<cyberSecPage />}
                />
                <Route path="/clienthome/ai" element={<aiPage />} />
                <Route
                  path="/clienthome/internet-of-things"
                  element={<iotPage />}
                />
                <Route path="/clienthome/game-dev" element={<gameDevPage />} />
                <Route
                  path="/login"
                  element={<Login onLoginSuccess={handleLoginSuccess} />}
                />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="*" element={<Navigate to="/clienthome" />} />
                cd ..
              </Routes>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </main>
      <WebFooter />
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
