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
import { MessageModalProvider } from "./component/messageModal";

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
import AllCoursePage from "./clientPage/allCoursePage";
import PreviewAllCoursePage from "./homePreviewPage/previewAllCoursePage";
import TeacherDashboard from "./teacher/dashboard";
import CourseDashboard from "./teacher/courseDashboard";
import ProfilePage from "./clientPage/profilePage";
import InstructorSignup from "./clientPage/instructorSignup";
import LikedPage from "./clientPage/likedPage";

//Import admin pages
import Dashboard from "./admin/adminPage/dashboard";
import Courses from "./admin/adminPage/courses";
import Profile from "./admin/adminPage/profile";
import Support from "./admin/adminPage/support";
import Teacher from "./admin/adminPage/teacher";
import TeacherSupport from "./admin/adminPage/teacherSupport";
import Order from "./admin/adminPage/order";
import CreateCourse from "./admin/component/createAndEditCourse";
import Chapters from "./admin/adminPage/chapters";
import CreateAndEditChapter from "./admin/component/createAndEditChapter";
import Chapter from "./admin/adminPage/chapter";
import Coupons from "./admin/adminPage/coupons";
import CreateAndEditCoupon from "./admin/component/createAndEditCoupon";
import TeacherDetailPage from "./admin/adminPage/teacherDetail";
import TeacherStudent from "./admin/adminPage/teacherStudent";
// Import components
import NavbarLogin from "./component/navbarLogin";
import NavbarPreview from "./component/navbarPreview";
import { useMessageModal } from "./component/messageModal";
import { MessageCircle } from "lucide-react";
import NavbarAdmin from "./admin/component/navbarAdmin";
import TeacherNavBar from "./teacher/component/teacherNav";

const FloatingMessageButton = () => {
  const { openModal } = useMessageModal();

  return (
    <button
      onClick={openModal}
      className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
};

const RouteAfterLogin = ({ homePath, userRole }) => {
  if (!homePath) {
    return <div>Loading...</div>;
  }
  console.log(userRole);
  if (userRole === "admin") {
    return (
      <>
        <Routes>
          {homePath && <Route path="*" element={<Navigate to={homePath} />} />}
          <Route path="/" element={<NavbarAdmin />}>
            CreateAndEditCoupon
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order" element={<Order />} />
            <Route path="/teacher" element={<Teacher />} />
            <Route path="/teacher/:id" element={<TeacherDetailPage />} />
            <Route path="/teacher-support" element={<TeacherSupport />} />
            <Route path="/support" element={<Support />} />
            {/*Course*/}
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/create-course" element={<CreateCourse />} />
            <Route
              path="/courses/edit-course/:courseId"
              element={<CreateCourse />}
            />
            <Route path="/courses/:courseId" element={<Chapters />} />
            <Route path="/courses/:courseId/:chapterId" element={<Chapter />} />
            <Route
              path="/courses/:courseId/create-chapter"
              element={<CreateAndEditChapter />}
            />
            <Route
              path="/teacherStudent/:courseId"
              element={<TeacherStudent />}
            />
            <Route
              path="/courses/:courseId/:chapterId/edit"
              element={<CreateAndEditChapter />}
            />
            <Route path="/coupons" element={<Coupons />} />
            <Route
              path="/coupons/:couponId/edit"
              element={<CreateAndEditCoupon />}
            />
            <Route path="/coupons/create" element={<CreateAndEditCoupon />} />
          </Route>
          {/*Coupon */}
        </Routes>
      </>
    );
  } else {
    return (
      <Routes>
        {homePath && <Route path="*" element={<Navigate to={homePath} />} />}
        <Route path="/client-home" element={<ClientHomePage />} />
        <Route path="/client-home/profile-page" element={<ProfilePage />} />
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
        <Route path="/client-home/all-courses" element={<AllCoursePage />} />
        <Route path="/client-home/dashboard" element={<TeacherDashboard />} />
        <Route
          path="/client-home/dashboard/:courseId"
          element={<CourseDashboard />}
        />
        <Route
          path="/client-home/instructor-signup"
          element={<InstructorSignup />}
        />
        <Route
          path="/client-home/liked-page"
          element={<LikedPage />}
        />


      </Routes>
    );
  }
};

const App = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [homePath, setHomePath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userNavBar, setUserNavBar] = useState(<NavbarLogin />);

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
          console.log("role=========", role);
          setUserRole(role);

          setHomePath(role === "admin" ? "/dashboard" : "/client-home");

        } catch (error) {
          console.error("Error fetching role:", error);
          setUserRole(null);
        } finally {
          setLoading(false);
        }
      };
      const fetchInstructor = async () => {
        const result = await ax.get(`/users/me?populate=instructor`)
        console.log("fetch================", result.data.instructor)
        const teacherStatus = result.data.instructor?.statusT
        if (teacherStatus === "confirm") {
          setUserNavBar(<TeacherNavBar handleLogout={handleLogout} />)
        } else {
          setUserNavBar(<NavbarLogin handleLogout={handleLogout} />)
        }

      }

      fetchInstructor();
      fetchRole();
    } else {
      setLoading(false);
    }
  }, [state.isLoggedIn]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });

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
              <RouteAfterLogin homePath={homePath} userRole={userRole} />
            ) : (
              <>
                <MessageModalProvider>
                  {userNavBar}
                  <RouteAfterLogin homePath={homePath} userRole={userRole} />
                  <FloatingMessageButton />
                </MessageModalProvider>
              </>
            )}
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

              <Route
                path="/home-preview/all-courses"
                element={<PreviewAllCoursePage />}
              />
            </Routes>
          </>
        )}
      </CartProvider>
    </Router>
  );
};

export default App;
