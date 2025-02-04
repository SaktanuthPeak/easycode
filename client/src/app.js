// import axios from "axios";
import { useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/Auth.context";
import ax from "./conf/ax";

// Import pages
import AdminHomePage from "./adminPage/adminHomepage";
import LoginForm from "./authenticationPage/login";
import ClientHomePage from "./clientPage/clientHomePage";
import Signup from "./authenticationPage/signup";

// Import components
import NavbarLogin from "./component/navbarLogin";
import NavbarPreview from "./component/navbarPreview";

const App = () => {
  const { state } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [homePath, setHomePath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("isLoggedIn:", state.isLoggedIn);

    if (state.isLoggedIn) {
      const fetchRole = async () => {
        try {
          const result = await ax.get("users/me?populate=role");
          const role = result.data.role.type;
          setUserRole(role);

          // Redirect based on role
          if (role === "client") {
            setHomePath("/client-home");
          } else if (role === "admin") {
            setHomePath("/admin-home");
          } else {
            setUserRole(null);
          }
        } catch (error) {
          console.error("Error fetching role:", error);
          setUserRole(null);
        } finally {
          setLoading(false);
        }
      };

      fetchRole();
    } else {
      setLoading(false);
    }
  }, [state.isLoggedIn]);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      {state.isLoggedIn ? (
        <>
          <NavbarLogin />
          {homePath && <Navigate to={homePath} replace />}
          <Routes>

            <Route path="/client-home" element={<ClientHomePage />} />
            <Route path="/admin-home" element={<AdminHomePage />} />

          </Routes>
        </>
      ) : (
        <>
          <NavbarPreview />
          <Routes>

            <Route path="/home-preview" element={<ClientHomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/sign-up" element={<Signup />} />

          </Routes>
        </>
      )}
    </Router>
  );
};


export default App;