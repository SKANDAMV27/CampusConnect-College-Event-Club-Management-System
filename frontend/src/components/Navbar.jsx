import { Link, useLocation } from "react-router-dom";

function Navbar() {

  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  return (
    <nav className="border-b bg-white">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-indigo-600"
        >
          CampusConnect
        </Link>

        {/* Navigation */}
        {!isLoginPage && (
          <div className="flex items-center gap-6">

            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600"
            >
              Home
            </Link>

            <Link
              to="/events"
              className="text-gray-700 hover:text-indigo-600"
            >
              Events
            </Link>

            <Link
              to="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Sign In
            </Link>

          </div>
        )}

      </div>

    </nav>
  );
}

export default Navbar;