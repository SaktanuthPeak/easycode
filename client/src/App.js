import "./App.css";
import HomePage from "./ClientPage/HomePage";
import Login from "./ClientPage/LoginPage";
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
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </Router>
  );
}
export default App;
