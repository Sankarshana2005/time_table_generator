import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminPanel from "./pages/AdminPanel";
import TimetableGenerator from "./components/TimetableGenerator";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Login page first */}
        <Route path="/" element={<Login />} />

        {/* Signup */}
        <Route path="/signup" element={<Signup />} />

        {/* Timetable after login */}
        <Route path="/dashboard" element={<TimetableGenerator />} />

        {/* Admin panel */}
        <Route path="/admin" element={<AdminPanel />} />

      </Routes>

    </BrowserRouter>
  );

}

export default App;