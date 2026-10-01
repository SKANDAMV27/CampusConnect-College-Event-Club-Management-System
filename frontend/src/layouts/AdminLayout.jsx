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
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

function AdminLayout() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
      localStorage.clear();

      await Swal.fire({
        icon: "success",
        title: "Logged out",
        text: "You have been logged out successfully.",
        showConfirmButton: false,
        timer: 1200,
      });

      navigate("/login");
    }
  };

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
      name: "Registrations",
      path: "/admin/registrations",
      icon: ClipboardList,
    },
    {
      name: "Announcements",
      path: "/admin/announcements",
      icon: Megaphone,
    },
//     {
//       name: "Profile",
//       path: "/admin/profile",
//       icon: UserCircle,
//     },
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex-col z-40">

        {/* Logo */}
        <div className="h-20 px-6 flex items-center border-b border-gray-200">

          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
            <GraduationCap size={24} className="text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900">
              CampusConnect
            </h1>

            <p className="text-xs text-gray-500">
              Admin Panel
            </p>
          </div>

        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-5 overflow-y-auto">

          <p className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Administration
          </p>

          <div className="space-y-1">

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
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
            })}

          </div>

        </nav>

        {/* Admin Section */}
        <div className="p-4 border-t border-gray-200">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <UserCircle
                size={22}
                className="text-blue-600"
              />
            </div>

            <div className="min-w-0">

              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.name || "Administrator"}
              </p>

              <p className="text-xs text-gray-500 truncate">
                {user.email || ""}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </aside>


      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}


      {/* =====================================================
          MOBILE SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 lg:hidden ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Mobile Logo */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-gray-200">

          <div className="flex items-center">

            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
              <GraduationCap
                size={24}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-900">
                CampusConnect
              </h1>

              <p className="text-xs text-gray-500">
                Admin Panel
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Mobile Navigation */}
        <nav className="px-4 py-5">

          <p className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Administration
          </p>

          <div className="space-y-1">

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
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
            })}

          </div>

        </nav>

        {/* Mobile User */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <UserCircle
                size={22}
                className="text-blue-600"
              />
            </div>

            <div className="min-w-0">

              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.name || "Administrator"}
              </p>

              <p className="text-xs text-gray-500 truncate">
                {user.email || ""}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="lg:ml-64 min-h-screen">

        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-30">

          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
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

            {/* User */}
            <div className="flex items-center gap-3 ml-auto">

              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                <UserCircle
                  size={21}
                  className="text-blue-600"
                />
              </div>

              <div className="hidden sm:block">

                <p className="text-sm font-semibold text-gray-900">
                  {user.name || "Admin"}
                </p>

                <p className="text-xs text-gray-500">
                  Administrator
                </p>

              </div>

            </div>

          </div>

        </header>


        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default AdminLayout;