import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Clock,
  XCircle,
  Search,
  ClipboardList,
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

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadRegistrations();
  }, []);

  /* =========================================================
     LOAD REGISTRATIONS
  ========================================================= */

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
        text:
          error.message ||
          "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     CANCEL REGISTRATION
  ========================================================= */

  const handleCancel = async (
    registrationId
  ) => {
    const confirmation =
      await Swal.fire({
        title: "Cancel registration?",
        text:
          "You can register again later if seats are available.",
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
        text:
          "Your registration has been cancelled.",
        confirmButtonColor: "#4f46e5",
      });

      await loadRegistrations();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to cancel",
        text:
          error.message ||
          "Something went wrong.",
      });
    }
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

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

  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

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

  /* =========================================================
     SEARCH FILTER
  ========================================================= */

  const filteredRegistrations =
    useMemo(() => {
      const searchValue =
        search.trim().toLowerCase();

      if (!searchValue) {
        return registrations;
      }

      return registrations.filter(
        (registration) => {
          const eventTitle =
            registration.eventTitle ||
            "";

          const venue =
            registration.venue ||
            "";

          const status =
            registration.status ||
            "";

          const eventDate =
            registration.eventDate ||
            "";

          return (
            eventTitle
              .toLowerCase()
              .includes(searchValue) ||
            venue
              .toLowerCase()
              .includes(searchValue) ||
            status
              .toLowerCase()
              .includes(searchValue) ||
            eventDate
              .toLowerCase()
              .includes(searchValue)
          );
        }
      );
    }, [
      registrations,
      search,
    ]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div
        className="
          min-h-[500px]
          flex
          items-center
          justify-center
          text-slate-500
        "
      >
        Loading registrations...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px]">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div
        className="
          mb-7
          flex
          flex-col
          gap-2
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-semibold
              text-slate-900
              sm:text-3xl
            "
          >
            My Registrations
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
              sm:text-base
            "
          >
            View and manage your event
            registrations.
          </p>

        </div>

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-500
          "
        >
          <ClipboardList
            size={18}
          />

          {registrations.length}{" "}
          registration
          {registrations.length !== 1
            ? "s"
            : ""}
        </div>

      </div>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div
        className="
          mb-6
          rounded-xl
          border
          border-slate-300
          bg-white
          p-4
        "
      >

        <div
          className="
            relative
            max-w-xl
          "
        >

          <Search
            size={19}
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search registrations by event, venue, status or date..."
            className="
              h-11
              w-full
              rounded-lg
              border
              border-slate-300
              bg-white
              pl-10
              pr-10
              text-sm
              text-slate-800
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-indigo-500
              focus:ring-1
              focus:ring-indigo-500
            "
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-slate-400
                hover:text-slate-700
              "
              aria-label="Clear search"
            >
              <XCircle
                size={18}
              />
            </button>
          )}

        </div>

        {search && (
          <p
            className="
              mt-3
              text-xs
              text-slate-500
            "
          >
            Showing{" "}
            <span className="font-semibold">
              {filteredRegistrations.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
              {registrations.length}
            </span>{" "}
            registrations
          </p>
        )}

      </div>


      {/* =====================================================
          NO REGISTRATIONS
      ===================================================== */}

      {registrations.length === 0 ? (

        <div
          className="
            rounded-xl
            border
            border-dashed
            border-slate-300
            bg-white
            p-12
            text-center
          "
        >

          <CalendarDays
            className="
              mx-auto
              h-12
              w-12
              text-slate-300
            "
          />

          <h2
            className="
              mt-4
              text-xl
              font-semibold
              text-slate-800
            "
          >
            No registrations yet
          </h2>

          <p
            className="
              mt-2
              text-slate-500
            "
          >
            Browse events and register
            for one.
          </p>

          <Link
            to="/events"
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-indigo-600
              px-5
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-indigo-700
            "
          >
            Browse Events

            <CalendarDays
              size={17}
            />
          </Link>

        </div>

      ) : filteredRegistrations.length ===
        0 ? (

        /* ===================================================
           NO SEARCH RESULTS
        =================================================== */

        <div
          className="
            rounded-xl
            border
            border-slate-300
            bg-white
            p-12
            text-center
          "
        >

          <Search
            className="
              mx-auto
              h-12
              w-12
              text-slate-300
            "
          />

          <h2
            className="
              mt-4
              text-xl
              font-semibold
              text-slate-800
            "
          >
            No registrations found
          </h2>

          <p
            className="
              mt-2
              text-slate-500
            "
          >
            No registration matches
            "<span className="font-medium">
              {search}
            </span>".
          </p>

          <button
            type="button"
            onClick={() =>
              setSearch("")
            }
            className="
              mt-5
              rounded-lg
              bg-indigo-600
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              hover:bg-indigo-700
            "
          >
            Clear Search
          </button>

        </div>

      ) : (

        /* ===================================================
           REGISTRATION LIST
        =================================================== */

        <div className="space-y-4">

          {filteredRegistrations.map(
            (registration) => {

              const cancelled =
                registration.status ===
                "CANCELLED";

              return (
                <div
                  key={
                    registration.registrationId
                  }
                  className="
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    p-5
                    transition
                    hover:border-slate-400
                  "
                >

                  <div
                    className="
                      flex
                      flex-col
                      justify-between
                      gap-5
                      md:flex-row
                      md:items-start
                    "
                  >

                    {/* =================================================
                        EVENT INFORMATION
                    ================================================= */}

                    <div className="min-w-0">

                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-3
                        "
                      >

                        <Link
                          to={`/events/${registration.eventId}`}
                          className="
                            text-lg
                            font-semibold
                            text-slate-900
                            transition
                            hover:text-indigo-600
                          "
                        >
                          {registration.eventTitle}
                        </Link>


                        <span
                          className={`
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            ${
                              cancelled
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }
                          `}
                        >
                          {registration.status}
                        </span>

                      </div>


                      {/* EVENT DETAILS */}

                      <div
                        className="
                          mt-4
                          flex
                          flex-wrap
                          gap-x-6
                          gap-y-3
                          text-sm
                          text-slate-600
                        "
                      >

                        <span
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <CalendarDays
                            className="
                              h-4
                              w-4
                              text-indigo-500
                            "
                          />

                          {formatDate(
                            registration.eventDate
                          )}

                        </span>


                        <span
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <Clock
                            className="
                              h-4
                              w-4
                              text-indigo-500
                            "
                          />

                          {formatTime(
                            registration.startTime
                          )}

                        </span>


                        <span
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <MapPin
                            className="
                              h-4
                              w-4
                              text-indigo-500
                            "
                          />

                          {registration.venue ||
                            "-"}

                        </span>

                      </div>

                    </div>


                    {/* =================================================
                        CANCEL BUTTON
                    ================================================= */}

                    {!cancelled && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCancel(
                            registration.registrationId
                          )
                        }
                        className="
                          flex
                          shrink-0
                          items-center
                          justify-center
                          gap-2
                          rounded-lg
                          border
                          border-red-200
                          px-4
                          py-2.5
                          text-sm
                          font-medium
                          text-red-600
                          transition
                          hover:bg-red-50
                        "
                      >

                        <XCircle
                          className="h-4 w-4"
                        />

                        Cancel Registration

                      </button>
                    )}

                  </div>


                  {/* =================================================
                      REGISTERED DATE
                  ================================================= */}

                  <div
                    className="
                      mt-5
                      border-t
                      border-slate-100
                      pt-4
                      text-xs
                      text-slate-500
                    "
                  >

                    Registered on:{" "}

                    <span
                      className="
                        font-medium
                        text-slate-600
                      "
                    >
                      {registration.registeredAt
                        ? new Date(
                            registration.registeredAt
                          ).toLocaleString(
                            "en-IN"
                          )
                        : "-"}
                    </span>

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