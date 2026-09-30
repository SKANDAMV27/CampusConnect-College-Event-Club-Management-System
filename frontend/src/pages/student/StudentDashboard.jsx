import { useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  UserRound,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { getStudentDashboard } from "../../api/studentApi";

function StudentDashboard() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const response =
          await getStudentDashboard();

        setData(response);

      } catch (error) {

        console.error(error);

        Swal.fire({
          icon: "error",
          title: "Unable to load dashboard",
          text: error.message,
        });

      } finally {

        setLoading(false);
      }
    };

    loadDashboard();

  }, []);

  if (loading) {

    return (
      <div className="p-8 text-center text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-900">
          Welcome, {data?.studentName}
        </h1>

        <p className="mt-1 text-slate-500">
          Manage your events and registrations.
        </p>

      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* EVENTS */}

        <div className="rounded-2xl border border-slate-300 bg-white p-7 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Available Events
              </p>

              <p className="mt-3 text-4xl font-bold text-slate-900">
                {data?.totalEvents ?? 0}
              </p>

            </div>

            <div className="rounded-xl bg-blue-100 p-3">
              <CalendarDays
                className="h-7 w-7 text-blue-600"
              />
            </div>

          </div>

          <Link
            to="/events"
            className="mt-8 flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
          >
            Browse Events
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

        {/* REGISTRATIONS */}

        <div className="rounded-2xl border border-slate-300 bg-white p-7 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-500">
                My Registrations
              </p>

              <p className="mt-3 text-4xl font-bold text-slate-900">
                {data?.myRegistrations ?? 0}
              </p>

            </div>

            <div className="rounded-xl bg-green-100 p-3">
              <ClipboardList
                className="h-7 w-7 text-green-600"
              />
            </div>

          </div>

          <Link
            to="/my-registrations"
            className="mt-8 flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
          >
            View Registrations
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

        {/* PROFILE */}

        <div className="rounded-2xl border border-slate-300 bg-white p-7 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-500">
                My Profile
              </p>

              <p className="mt-3 text-xl font-semibold text-slate-900">
                Account Details
              </p>

            </div>

            <div className="rounded-xl bg-purple-100 p-3">
              <UserRound
                className="h-7 w-7 text-purple-600"
              />
            </div>

          </div>

          <Link
            to="/profile"
            className="mt-8 flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
          >
            View Profile
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;