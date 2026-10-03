import { useState } from "react";
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
} from "lucide-react";

import CampusChatbot from "../components/chatbot";

function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const navigate = useNavigate();

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login");
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */

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

  /* =========================================================
     USER INFORMATION
  ========================================================= */

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error(
      "Unable to read user information",
      error
    );
  }

  const userName =
    user?.name ||
    "Student";

  const userEmail =
    user?.email ||
    "student@example.com";

  const userInitial =
    userName
      ?.charAt(0)
      ?.toUpperCase() ||
    "S";

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          MOBILE HEADER
      ===================================================== */}

      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-40
          flex
          h-16
          items-center
          justify-between
          border-b
          border-slate-200
          bg-white
          px-4
          lg:hidden
        "
      >

        {/* MENU */}

        <button
          type="button"
          onClick={() =>
            setSidebarOpen(
              (previous) => !previous
            )
          }
          className="
            rounded-lg
            p-2
            text-slate-600
            hover:bg-slate-100
            hover:text-indigo-600
          "
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>


        {/* LOGO */}

        <div
          className="
            flex
            items-center
            gap-2
            text-lg
            font-bold
            text-indigo-600
          "
        >
          <CalendarDays size={22} />

          CampusConnect
        </div>


        {/* USER */}

        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-indigo-100
            text-sm
            font-semibold
            text-indigo-600
          "
        >
          {userInitial}
        </div>

      </header>


      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/30
            lg:hidden
          "
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          bottom-0
          left-0
          top-0
          z-50
          w-64
          border-r
          border-slate-200
          bg-white
          transition-transform
          duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >

        {/* ===================================================
            LOGO
        =================================================== */}

        <div
          className="
            flex
            h-16
            items-center
            border-b
            border-slate-200
            px-6
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              text-xl
              font-bold
              text-indigo-600
            "
          >

            <CalendarDays
              size={25}
            />

            CampusConnect

          </div>

        </div>


        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <nav
          className="
            space-y-1
            p-4
          "
        >

          {navItems.map(
            (item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className={({
                    isActive,
                  }) =>
                    `
                      flex
                      items-center
                      gap-3
                      rounded-lg
                      px-4
                      py-3
                      text-sm
                      font-medium
                      transition
                      ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                      }
                    `
                  }
                >

                  <Icon size={20} />

                  {item.name}

                </NavLink>
              );
            }
          )}

        </nav>


        {/* ===================================================
            LOGOUT
        =================================================== */}

        <div
          className="
            absolute
            bottom-4
            left-4
            right-4
          "
        >

          <button
            type="button"
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-4
              py-3
              text-sm
              font-medium
              text-red-600
              transition
              hover:bg-red-50
            "
          >

            <LogOut size={20} />

            Logout

          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main
        className="
          min-h-screen
          lg:ml-64
        "
      >

        {/* ===================================================
            DESKTOP HEADER
        =================================================== */}

        <header
          className="
            hidden
            h-16
            items-center
            justify-between
            border-b
            border-slate-200
            bg-white
            px-8
            lg:flex
          "
        >

          {/* TITLE */}

          <div>

            <h1
              className="
                text-lg
                font-semibold
                text-slate-900
              "
            >
              Student Portal
            </h1>

            <p
              className="
                mt-0.5
                text-xs
                text-slate-500
              "
            >
              CampusConnect
            </p>

          </div>


          {/* USER */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                text-right
              "
            >

              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                {userName}
              </p>

              <p
                className="
                  max-w-[220px]
                  truncate
                  text-xs
                  text-slate-500
                "
              >
                {userEmail}
              </p>

            </div>


            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-indigo-100
                font-semibold
                text-indigo-600
              "
            >
              {userInitial}
            </div>

          </div>

        </header>


        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <div
          className="
            min-h-screen
            p-4
            pt-20
            sm:p-6
            lg:p-8
            lg:pt-8
          "
        >

          <Outlet />

        </div>

      </main>


      {/* =====================================================
          CAMPUSCONNECT CHATBOT
      ===================================================== */}

      <CampusChatbot />

    </div>
  );
}

export default StudentLayout;