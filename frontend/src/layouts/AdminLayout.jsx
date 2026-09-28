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
} from "lucide-react";
import Swal from "sweetalert2";

function AdminLayout() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
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
    {
      name: "Profile",
      path: "/admin/profile",
      icon: UserCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white fixed left-0 top-0 bottom-0 flex flex-col">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-700">
          <GraduationCap size={32} className="mr-3 text-blue-400" />

          <div>
            <h1 className="font-bold text-lg">CampusConnect</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Admin info */}
        <div className="p-4 border-t border-slate-700">
          <div className="mb-3">
            <p className="text-sm font-semibold">
              {user.name || "Administrator"}
            </p>

            <p className="text-xs text-slate-400">
              {user.email || ""}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 min-h-screen">
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Administration
            </h2>

            <p className="text-sm text-gray-500">
              Manage CampusConnect
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <UserCircle className="text-blue-600" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                {user.name || "Admin"}
              </p>

              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;