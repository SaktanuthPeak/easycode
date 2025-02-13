import { useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "./context/Auth.context";
import { CartProvider } from "./context/Cart.context";
import ax from "./conf/ax";

// Import pages
import LoginForm from "./authenticationPage/login";
import ClientHomePage from "./clientPage/clientHomePage";
import Signup from "./authenticationPage/signup";
import CategoryPage from "./clientPage/categoryPage";
import CoursePage from "./clientPage/coursePage";
import CategoryPreviewPage from "./homePreviewPage/categoryPreviewPage";
import HomePreviewPage from "./homePreviewPage/homePreviewPage";
import CartPage from "./clientPage/cartPage";
import CoursePreviewPage from "./homePreviewPage/coursePreviewPage";
import PaymentQRPage from "./clientPage/paymantQrPage";
import MyLearningPage from "./clientPage/myLearningPage";
import CourseLearningPage from "./clientPage/courseLearningPage";

//Import admin pages
import Dashboard from "./admin/adminPage/dashboard";
import Courses from "./admin/adminPage/courses";
import Profile from "./admin/adminPage/profile";
import Support from "./admin/adminPage/support";
import Teacher from "./admin/adminPage/teacher";
import TeacherSupport from "./admin/adminPage/teacherSupport";
import Order from "./admin/adminPage/order";

// Import components
import NavbarLogin from "./component/navbarLogin";
import NavbarPreview from "./component/navbarPreview";
import NavbarAdmin from "./admin/component/navbarAdmin";

const RouteAfterLogin = ({ homePath, userRole }) => {
  if (!homePath) {
    return <div>Loading...</div>;
  }
  console.log(userRole);
  if (userRole === "admin") {
    return (
      <Routes>
        {homePath && <Route path="*" element={<Navigate to={homePath} />} />}
        <Route path="/" element={<NavbarAdmin />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/teacher-support" element={<TeacherSupport />} />
          <Route path="/support" element={<Support />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/order" element={<Order />} />
        </Route>
      </Routes>
    );
  } else {
    return (
      <Routes>
        {homePath && <Route path="*" element={<Navigate to={homePath} />} />}
        <Route path="/client-home" element={<ClientHomePage />} />
        <Route path="/client-home/:categoryId" element={<CategoryPage />} />
        <Route
          path="/client-home/:categoryId/:courseId"
          element={<CoursePage />}
        />
        <Route path="/client-home/cart" element={<CartPage />} />
        <Route path="/client-home/cart/payment" element={<PaymentQRPage />} />
        <Route path="/client-home/my-learning" element={<MyLearningPage />} />
        <Route
          path="/client-home/my-learning/:courseId"
          element={<CourseLearningPage />}
        />
      </Routes>
    );
  }
};

const App = () => {
  const { state, dispatch } = useContext(AuthContext); // Get Auth context
  const [userRole, setUserRole] = useState(null);
  const [homePath, setHomePath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("isLoggedIn:", state.isLoggedIn);

    if (state.isLoggedIn) {
      toast.success("Login Success!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      const fetchRole = async () => {
        try {
          const result = await ax.get("users/me?populate=role");
          const role = result.data.role.type;
          setUserRole(role);

          setHomePath(role === "admin" ? "/dashboard" : "/client-home");
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

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" }); // Update Auth context

    // Show logout success notification
    toast.info("Logout Success!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  if (loading) return <div>Loading...</div>;
  return (
    <Router>
      <CartProvider>
        <ToastContainer />
        {state.isLoggedIn ? (
          <>
            {userRole === "admin" ? (
              <></>
            ) : (
              <>
                <NavbarLogin />
              </>
            )}
            <RouteAfterLogin homePath={homePath} userRole={userRole} />
          </>
        ) : (
          <>
            <NavbarPreview />
            <Routes>
              <Route path="*" element={<Navigate to="/home-preview" />} />
              <Route path="/home-preview" element={<HomePreviewPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/home-preview/:categoryId"
                element={<CategoryPreviewPage />}
              />
              <Route
                path="/home-preview/:categoryId/:courseId"
                element={<CoursePreviewPage />}
              />
            </Routes>
          </>
        )}
      </CartProvider>
    </Router>
  );
};

export default App;
