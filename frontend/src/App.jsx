import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminRegister from "./pages/AdminRegister";

import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import Events from "./pages/student/Events";
import EventDetails from "./pages/student/EventDetails";
import MyRegistrations from "./pages/student/MyRegistrations";
import Profile from "./pages/student/Profile";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            Landing Page
        ========================== */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* =========================
            Public Routes
        ========================== */}

        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />

        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <Register />
            </>
          }
        />

        <Route
          path="/admin/register"
          element={
            <>
              <Navbar />
              <AdminRegister />
            </>
          }
        />

        {/* =========================
            Home - Optional
        ========================== */}

        <Route
          path="/home"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        {/* =========================
            Student Routes
        ========================== */}

        <Route element={<StudentLayout />}>

          <Route
            path="/dashboard"
            element={<StudentDashboard />}
          />

          <Route
            path="/events"
            element={<Events />}
          />

          <Route
            path="/events/:id"
            element={<EventDetails />}
          />

          <Route
            path="/my-registrations"
            element={<MyRegistrations />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;