import './App.css';
import HomePage from './AdminPage/Homepage';
import Login from './ClientPage/LoginPage';
import { BrowserRouter as Router, Routes, Navigate, Route } from 'react-router-dom';



function App() {


  return (
    <Router>
      <Routes>
        <Route
          path="/Home"
          element={

            <HomePage />

          }
        />
        <Route
          path="/Login"
          element={

            <Login />
          }
        />


      </Routes>
    </Router>




  );
}
export default App;