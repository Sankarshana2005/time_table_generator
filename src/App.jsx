import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import TimetableGenerator from "./components/TimetableGenerator";

/* Protect Admin Dashboard */
function ProtectedAdmin({children}){

const isAdmin = localStorage.getItem("adminAuth");

return isAdmin ? children : <Navigate to="/admin" />;

}

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* User login */}
        <Route path="/" element={<Login />} />

        {/* User signup */}
        <Route path="/signup" element={<Signup />} />

        {/* Timetable generator */}
        <Route path="/dashboard" element={<TimetableGenerator />} />

        {/* Admin login */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Admin dashboard protected */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedAdmin>
              <AdminPanel />
            </ProtectedAdmin>
          } 
        />

      </Routes>

    </BrowserRouter>
  );

}

export default App;