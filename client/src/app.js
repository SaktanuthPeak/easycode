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
import CategoryPage from "./coursePage/categoryPage";
// Import components
import NavbarLogin from "./component/navbarLogin";
import NavbarPreview from "./component/navbarPreview";

const RouteAfterLogin = ({ homePath }) => {
  return (
    <Routes>
      {homePath && <Route path="*" element={<Navigate to={homePath} />} />}
      <Route path="/client-home" element={<ClientHomePage />} />
      <Route path="/admin-home" element={<AdminHomePage />} />
      <Route path="/client-home/:categoryId" element={<CategoryPage />} />
    </Routes>
  );
};

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

          if (role === "admin") {
            setHomePath("/admin-home");
          } else {
            setHomePath("/client-home");
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
          <RouteAfterLogin homePath={homePath} />
        </>
      ) : (
        <>
          <NavbarPreview />
          <Routes>
            <Route path="*" element={<Navigate to="/home-preview" />} />
            <Route path="/home-preview" element={<ClientHomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </>
      )}
    </Router>
  );
};

export default App;
