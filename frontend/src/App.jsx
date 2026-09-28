import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminClubs from "./pages/admin/AdminClubs";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminProfile from "./pages/admin/AdminProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
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

        {/* Public */}
        <Route
          path="/home"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        {/* ========================= */}
        {/* STUDENT ROUTES */}
        {/* ========================= */}

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

        {/* ========================= */}
        {/* ADMIN ROUTES */}
        {/* ========================= */}

        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route element={<AdminLayout />}>

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/events"
              element={<AdminEvents />}
            />

            <Route
              path="/admin/clubs"
              element={<AdminClubs />}
            />

            <Route
              path="/admin/students"
              element={<AdminStudents />}
            />

            <Route
              path="/admin/registrations"
              element={<AdminRegistrations />}
            />

            <Route
              path="/admin/announcements"
              element={<AdminAnnouncements />}
            />

            <Route
              path="/admin/profile"
              element={<AdminProfile />}
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;