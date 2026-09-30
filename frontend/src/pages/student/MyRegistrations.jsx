import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Clock,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import {
  getMyRegistrations,
  cancelRegistration,
} from "../../api/studentApi";

function MyRegistrations() {

  const [registrations, setRegistrations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadRegistrations();

  }, []);

  const loadRegistrations = async () => {

    try {

      setLoading(true);

      const data =
        await getMyRegistrations();

      setRegistrations(data || []);

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Unable to load registrations",
        text: error.message,
      });

    } finally {

      setLoading(false);
    }
  };

  const handleCancel = async (
    registrationId
  ) => {

    const confirmation =
      await Swal.fire({
        title: "Cancel registration?",
        text: "You can register again later if seats are available.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, cancel",
        cancelButtonText: "Keep registration",
        confirmButtonColor: "#dc2626",
      });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {

      await cancelRegistration(
        registrationId
      );

      await Swal.fire({
        icon: "success",
        title: "Registration cancelled",
        text: "Your registration has been cancelled.",
      });

      await loadRegistrations();

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Unable to cancel",
        text: error.message,
      });
    }
  };

  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (time) => {

    if (!time) return "-";

    const [hours, minutes] =
      time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes)
    );

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  if (loading) {

    return (
      <div className="py-16 text-center text-slate-500">
        Loading registrations...
      </div>
    );
  }

  return (
    <div>

      <div className="mb-7">

        <h1 className="text-3xl font-bold text-slate-900">
          My Registrations
        </h1>

        <p className="mt-2 text-slate-500">
          View and manage your event registrations.
        </p>

      </div>

      {registrations.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

          <CalendarDays
            className="mx-auto h-12 w-12 text-slate-300"
          />

          <h2 className="mt-4 text-xl font-semibold text-slate-800">
            No registrations yet
          </h2>

          <p className="mt-2 text-slate-500">
            Browse events and register for one.
          </p>

          <Link
            to="/events"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Browse Events
          </Link>

        </div>

      ) : (

        <div className="space-y-4">

          {registrations.map(
            (registration) => {

              const cancelled =
                registration.status ===
                "CANCELLED";

              return (

                <div
                  key={registration.registrationId}
                  className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm"
                >

                  <div className="flex flex-col justify-between gap-5 md:flex-row">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <Link
                          to={`/events/${registration.eventId}`}
                          className="text-xl font-bold text-slate-900 hover:text-blue-600"
                        >
                          {registration.eventTitle}
                        </Link>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            cancelled
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {registration.status}
                        </span>

                      </div>

                      <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-600">

                        <span className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-blue-500" />
                          {formatDate(
                            registration.eventDate
                          )}
                        </span>

                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          {formatTime(
                            registration.startTime
                          )}
                        </span>

                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          {registration.venue}
                        </span>

                      </div>

                    </div>

                    {!cancelled && (

                      <button
                        onClick={() =>
                          handleCancel(
                            registration.registrationId
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel Registration
                      </button>

                    )}

                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-500">

                    Registered on:{" "}

                    {registration.registeredAt
                      ? new Date(
                          registration.registeredAt
                        ).toLocaleString("en-IN")
                      : "-"}

                  </div>

                </div>

              );
            }
          )}

        </div>

      )}

    </div>
  );
}

export default MyRegistrations;