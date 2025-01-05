import "./App.css";
import HomePage from "./ClientPage/HomePage";
import Login from "./ClientPage/LoginPage";
import SignUp from "./ClientPage/SignUpPage";
import Nav from "./Component/NavbarPreview";
import {
  BrowserRouter as Router,
  Routes,
  Navigate,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/Home" element={<HomePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </Router>
  );
}
export default App;
