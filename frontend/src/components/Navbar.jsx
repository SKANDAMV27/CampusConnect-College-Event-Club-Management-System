import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-indigo-600"
        >
          <CalendarDays size={28} />
          CampusConnect
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-indigo-600"
          >
            Home
          </Link>

          <Link
            to="/events"
            className="text-gray-600 hover:text-indigo-600"
          >
            Events
          </Link>

          <Link
            to="/login"
            className="rounded-lg border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-indigo-50"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Register
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;