
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Building2,
  ClipboardList,
  Megaphone,
  UserCircle,
  LogOut,
  GraduationCap,
  MessageSquareText,
  BookOpenCheck,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";
import Swal from "sweetalert2";

function AdminLayout() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    console.error("Unable to read admin user information:", error);
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      await Swal.fire({
        icon: "success",
        title: "Logged out",
        text: "You have been logged out successfully.",
        showConfirmButton: false,
        timer: 1200,
      });

      navigate("/login", { replace: true });
    }
  };

  // Shared navigation for desktop and mobile
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Events",
      path: "/admin/events",
      icon: CalendarDays,
    },
    {
      name: "Clubs",
      path: "/admin/clubs",
      icon: Building2,
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: Users,
    },
    {
      name: "Placements",
      path: "/admin/placements",
      icon: GraduationCap,
    },
    {
      name: "Registrations",
      path: "/admin/registrations",
      icon: ClipboardList,
    },
    {
      name: "Marks Management",
      path: "/admin/marks",
      icon: BookOpenCheck,
    },
    {
      name: "Feedback",
      path: "/admin/feedback",
      icon: MessageSquareText,
    },
    {
      name: "Announcements",
      path: "/admin/announcements",
      icon: Megaphone,
    },
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const renderNavigation = (isMobile = false) =>
    menuItems.map((item) => {
      const Icon = item.icon;

      return (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={isMobile ? closeMobileMenu : undefined}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`
          }
        >
          <Icon size={19} />
          <span>{item.name}</span>
        </NavLink>
      );
    });

  const AdminUser = ({ mobile = false }) => (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
        <UserCircle size={22} className="text-blue-600" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900">
          {user.name || "Administrator"}
        </p>

        <p className="truncate text-xs text-gray-500">
          {mobile ? user.email || "" : user.email || "Administrator"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center border-b border-gray-200 px-6">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <GraduationCap size={24} className="text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900">
              CampusConnect
            </h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Administration
          </p>

          <div className="space-y-1">{renderNavigation()}</div>
        </nav>

        {/* Desktop User and Logout */}
        <div className="shrink-0 border-t border-gray-200 p-4">
          <div className="mb-4">
            <AdminUser />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* MOBILE SIDEBAR */}
      <aside
        id="admin-mobile-sidebar"
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Admin navigation"
        aria-hidden={!mobileMenuOpen}
      >
        {/* Mobile Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-gray-200 px-5">
          <div className="flex items-center">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <GraduationCap size={24} className="text-white" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-900">
                CampusConnect
              </h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Administration
          </p>

          <div className="space-y-1">{renderNavigation(true)}</div>
        </nav>

        {/* Mobile User and Logout */}
        <div className="shrink-0 border-t border-gray-200 p-4">
          <div className="mb-4">
            <AdminUser mobile />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="min-h-screen lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-20 border-b border-gray-200 bg-white">
          <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              aria-label="Open navigation menu"
              aria-controls="admin-mobile-sidebar"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={22} />
            </button>

            {/* Header Title */}
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold text-gray-900">
                Administration
              </h2>
              <p className="text-sm text-gray-500">
                Manage CampusConnect
              </p>
            </div>

            {/* Current Admin */}
            <div className="ml-auto flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                <UserCircle size={21} className="text-blue-600" />
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Routed Page Content */}
        <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
