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
// import pages
import AdminHomePage from "./adminPage/adminHomepage";
import LoginForm from "./authenticationPage/login";
// import components
import NavbarLogin from "./component/navbarLogin";
import ClientHomePage from "./clientPage/clientHomePage";



// axios.defaults.baseURL =
//   process.env.REACT_APP_BASE_URL || "http://localhost:1337";

const App = () => {
  const { state } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [nav, setNav] = useState(null);
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("isLoggedIn", state.isLoggedIn)
    if (state.isLoggedIn) {
      const fetchRole = async () => {
        try {
          const result = await ax.get("users/me?populate=role");

          const role = result.data.role.type;
          setUserRole(role);
          if (role === "Authenticated") {
            setNav(<NavbarLogin />);
            setHome("/client-home");
          } else if (role === "admin") {
            // setNav(<AdminNavbar />);
            setHome("/admin-home");
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



      <Routes>
        <Route path="" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            state.isLoggedIn ? <Navigate to={home} /> : <LoginForm />
          }
        />
        {/* Student page */}
        <Route
          path="/client-home"
          element={
            state.isLoggedIn && userRole === "Authenticated" ? (
              <ClientHomePage />
            ) : (
              <Navigate to={home || "/login"} />
            )
          }
        />


        {/* Admin page */}
        <Route
          path="/admin-home"
          element={
            state.isLoggedIn && userRole === "admin" ? (
              <AdminHomePage />
            ) : (
              <Navigate to={home || "/login"} />
            )
          }
        />


      </Routes>

    </Router >
  );
};

export default App;