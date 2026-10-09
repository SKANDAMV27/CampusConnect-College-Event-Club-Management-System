import { useState, useEffect } from "react";
import {
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

import CampusChatbot from "../components/chatbot";

function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const navigate = useNavigate();

  // Apply theme and save preference
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Toggle light/dark mode
  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login");
  };

  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Events",
      path: "/events",
      icon: CalendarDays,
    },
    {
      name: "My Registrations",
      path: "/my-registrations",
      icon: ClipboardList,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  // Read user information
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Unable to read user information", error);
  }

  const userName = user?.name || "Student";
  const userEmail = user?.email || "student@example.com";

  const userInitial = userName.charAt(0).toUpperCase() || "S";

  // Reusable theme toggle button
  const ThemeToggle = () => (
    <button
      type="button"
      onClick={toggleTheme}
      className="
        flex h-10 w-10 shrink-0 items-center justify-center
        rounded-lg border border-slate-200 bg-white
        text-slate-600 transition-colors hover:bg-slate-100
        dark:border-slate-700 dark:bg-slate-800
        dark:text-yellow-400 dark:hover:bg-slate-700
      "
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">

      {/* Mobile Header */}
      <header
        className="
          fixed left-0 right-0 top-0 z-40
          flex h-16 items-center justify-between gap-3
          border-b border-slate-200 bg-white px-4
          dark:border-slate-700 dark:bg-slate-900
          lg:hidden
        "
      >
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={() => setSidebarOpen((previous) => !previous)}
          className="
            rounded-lg p-2 text-slate-600
            hover:bg-slate-100 hover:text-indigo-600
            dark:text-slate-300 dark:hover:bg-slate-800
          "
          aria-label="Toggle menu"
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className="flex min-w-0 items-center gap-2 text-lg font-bold text-indigo-600">
          <CalendarDays size={22} className="shrink-0" />
          <span className="truncate">CampusConnect</span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Avatar */}
        <div
          className="
            flex h-9 w-9 shrink-0 items-center justify-center
            rounded-full bg-indigo-100 text-sm font-semibold
            text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300
          "
          title={userName}
        >
          {userInitial}
        </div>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed bottom-0 left-0 top-0 z-50
          flex w-64 flex-col
          border-r border-slate-200 bg-white
          transition-transform duration-300
          dark:border-slate-700 dark:bg-slate-900
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        {/* Sidebar Logo */}
        <div
          className="
            flex h-16 shrink-0 items-center
            border-b border-slate-200 px-6
            dark:border-slate-700
          "
        >
          <div className="flex items-center gap-2 text-xl font-bold text-indigo-600">
            <CalendarDays size={25} />
            CampusConnect
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `
                    flex items-center gap-3 rounded-lg
                    px-4 py-3 text-sm font-medium
                    transition-colors
                    ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300"
                        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
                    }
                  `
                }
              >
                <Icon size={20} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Bottom Actions */}
        <div className="space-y-2 border-t border-slate-200 p-4 dark:border-slate-700">

          {/* Theme Toggle for Sidebar */}
          <button
            type="button"
            onClick={toggleTheme}
            className="
              flex w-full items-center gap-3 rounded-lg
              px-4 py-3 text-sm font-medium
              text-slate-600 transition-colors
              hover:bg-slate-100 dark:text-slate-300
              dark:hover:bg-slate-800
            "
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex w-full items-center gap-3 rounded-lg
              px-4 py-3 text-sm font-medium text-red-600
              transition-colors hover:bg-red-50
              dark:text-red-400 dark:hover:bg-red-950/40
            "
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-64">

        {/* Desktop Header */}
        <header
          className="
            hidden h-16 items-center justify-between
            border-b border-slate-200 bg-white px-8
            dark:border-slate-700 dark:bg-slate-900
            lg:flex
          "
        >
          {/* Page Title */}
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Student Portal
            </h1>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              CampusConnect
            </p>
          </div>

          {/* Desktop User Information */}
          <div className="flex items-center gap-4">

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Details */}
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {userName}
              </p>

              <p className="max-w-[220px] truncate text-xs text-slate-500 dark:text-slate-400">
                {userEmail}
              </p>
            </div>

            {/* User Avatar */}
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full bg-indigo-100 font-semibold
                text-indigo-600 dark:bg-indigo-950
                dark:text-indigo-300
              "
              title={userName}
            >
              {userInitial}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div
          className="
            min-h-screen bg-slate-50 p-4 pt-20
            transition-colors duration-200
            dark:bg-slate-950
            sm:p-6 sm:pt-20
            lg:p-8 lg:pt-8
          "
        >
          <Outlet />
        </div>
      </main>

      {/* CampusConnect Chatbot */}
      <CampusChatbot />
    </div>
  );
}

export default StudentLayout;