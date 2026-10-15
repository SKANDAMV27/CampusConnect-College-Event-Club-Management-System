
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminRegister from "./pages/AdminRegister";

// Password pages
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Student layout and pages
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import Events from "./pages/student/Events";
import EventDetails from "./pages/student/EventDetails";
import MyRegistrations from "./pages/student/MyRegistrations";
import Profile from "./pages/student/Profile";
import Feedback from "./pages/student/Feedback";
import MyMarks from "./pages/student/MyMarks";

// Placement pages
import StudentPlacements from "./pages/placements/StudentPlacements";

// Authentication and protection
import ProtectedRoute from "./components/ProtectedRoute";

// Admin layout and pages
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminClubs from "./pages/admin/AdminClubs";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminPlacements from "./pages/placements/AdminPlacements";
import AdminMarks from "./pages/admin/AdminMarks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* DEFAULT ROUTE */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* AUTHENTICATION ROUTES */}
        <Route path="/login" element={<Login />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
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

        {/* PUBLIC ROUTES */}
        <Route
          path="/home"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        {/* ================================== */}
        {/* STUDENT ROUTES */}
        {/* ================================== */}
        <Route element={<ProtectedRoute role="STUDENT" />}>
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
              path="/events/:eventId/feedback"
              element={<Feedback />}
            />

            <Route
              path="/my-registrations"
              element={<MyRegistrations />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* Student placements */}
            <Route
              path="/placements"
              element={<StudentPlacements />}
            />

            {/* Student marks */}
            <Route
              path="/my-marks"
              element={<MyMarks />}
            />
          </Route>
        </Route>

        {/* ================================== */}
        {/* ADMIN ROUTES */}
        {/* ================================== */}
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
              path="/admin/feedback"
              element={<AdminFeedback />}
            />

            <Route
              path="/admin/announcements"
              element={<AdminAnnouncements />}
            />

            <Route
              path="/admin/profile"
              element={<AdminProfile />}
            />

            {/* Admin placements */}
            <Route
              path="/admin/placements"
              element={<AdminPlacements />}
            />

            {/* Admin marks management */}
            <Route
              path="/admin/marks"
              element={<AdminMarks />}
            />
          </Route>
        </Route>

        {/* UNKNOWN ROUTES */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
