import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  MapPin,
  Clock,
  XCircle,
  Search,
  ClipboardList,
  MessageSquareText,
  CheckCircle2,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import {
  getMyRegistrations,
  cancelRegistration,
} from "../../api/studentApi";

function MyRegistrations() {
  const navigate = useNavigate();

  const [registrations, setRegistrations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  /* =========================================================
     LOAD REGISTRATIONS
  ========================================================= */

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      setLoading(true);

      const data =
        await getMyRegistrations();

      setRegistrations(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {
      console.error(
        "Failed to load registrations:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Unable to load registrations",
        text:
          error?.message ||
          "Something went wrong.",
        confirmButtonColor: "#4f46e5",
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
        cancelButtonColor: "#64748b",
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

      console.error(
        "Failed to cancel registration:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Unable to cancel",
        text:
          error?.message ||
          "Something went wrong.",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  /* =========================================================
     OPEN FEEDBACK
  ========================================================= */

  const handleFeedback = (
    eventId
  ) => {

    if (!eventId) {
      Swal.fire({
        icon: "error",
        title: "Invalid Event",
        text:
          "Unable to open feedback for this event.",
        confirmButtonColor: "#4f46e5",
      });

      return;
    }

    navigate(
      `/events/${eventId}/feedback`
    );
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    try {

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

    } catch {
      return date;
    }
  };

  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime = (time) => {

    if (!time) {
      return "-";
    }

    try {

      const [
        hours,
        minutes,
      ] = time.split(":");

      const date =
        new Date();

      date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
      );

      return date.toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    } catch {
      return time;
    }
  };

  /* =========================================================
     FORMAT REGISTERED DATE
  ========================================================= */

  const formatRegisteredDate = (
    date
  ) => {

    if (!date) {
      return "-";
    }

    try {

      return new Date(
        date
      ).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    } catch {
      return date;
    }
  };

  /* =========================================================
     CHECK EVENT COMPLETED

     This is a frontend fallback.

     Backend should preferably return:
       eventCompleted
       feedbackSubmitted
  ========================================================= */

  const isEventCompleted = (
    registration
  ) => {

    /*
     * Use backend value when available.
     */
    if (
      typeof registration.eventCompleted ===
      "boolean"
    ) {
      return registration.eventCompleted;
    }

    /*
     * Fallback based on event date/time.
     */

    if (!registration.eventDate) {
      return false;
    }

    try {

      const eventDate =
        registration.eventDate;

      const endTime =
        registration.endTime ||
        registration.startTime;

      if (!endTime) {

        const endOfDay =
          new Date(
            `${eventDate}T23:59:59`
          );

        return (
          new Date() >
          endOfDay
        );
      }

      const eventEnd =
        new Date(
          `${eventDate}T${endTime}`
        );

      return (
        new Date() >
        eventEnd
      );

    } catch {
      return false;
    }
  };

  /* =========================================================
     CHECK FEEDBACK SUBMITTED
  ========================================================= */

  const isFeedbackSubmitted = (
    registration
  ) => {

    return (
      registration.feedbackSubmitted ===
      true
    );
  };

  /* =========================================================
     SEARCH FILTER
  ========================================================= */

  const filteredRegistrations =
    useMemo(() => {

      const searchValue =
        search
          .trim()
          .toLowerCase();

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
          flex
          min-h-[500px]
          items-center
          justify-center
          text-slate-500
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <span
            className="
              h-5
              w-5
              animate-spin
              rounded-full
              border-2
              border-slate-300
              border-t-indigo-600
            "
          />

          Loading registrations...

        </div>

      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div
      className="
        mx-auto
        max-w-[1400px]
      "
    >

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
            placeholder="
              Search registrations by event, venue, status or date...
            "
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

            <span
              className="
                font-semibold
              "
            >
              {filteredRegistrations.length}
            </span>

            {" "}of{" "}

            <span
              className="
                font-semibold
              "
            >
              {registrations.length}
            </span>

            {" "}registrations

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

      ) : filteredRegistrations.length === 0 ? (

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

            No registration matches{" "}

            "<span
              className="font-medium"
            >
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

        <div
          className="
            space-y-4
          "
        >

          {filteredRegistrations.map(
            (registration) => {

              const cancelled =
                String(
                  registration.status ||
                  ""
                ).toUpperCase() ===
                "CANCELLED";

              const completed =
                isEventCompleted(
                  registration
                );

              const feedbackSubmitted =
                isFeedbackSubmitted(
                  registration
                );

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

                  {/* =================================================
                      EVENT INFORMATION + ACTIONS
                  ================================================= */}

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

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >

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

                        {/* REGISTRATION STATUS */}

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

                        {/* EVENT COMPLETED */}

                        {!cancelled &&
                          completed && (

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-full
                                bg-blue-100
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-blue-700
                              "
                            >

                              <CheckCircle2
                                size={13}
                              />

                              Event Completed

                            </span>

                          )}

                      </div>


                      {/* =================================================
                          EVENT DETAILS
                      ================================================= */}

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

                        {/* DATE */}

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


                        {/* TIME */}

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

                          {registration.endTime && (
                            <>
                              {" - "}
                              {formatTime(
                                registration.endTime
                              )}
                            </>
                          )}

                        </span>


                        {/* VENUE */}

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
                        ACTIONS
                    ================================================= */}

                    <div
                      className="
                        flex
                        shrink-0
                        flex-col
                        gap-2
                        sm:flex-row
                        md:flex-col
                        lg:flex-row
                      "
                    >

                      {/* =================================================
                          FEEDBACK SUBMITTED
                      ================================================= */}

                      {!cancelled &&
                        completed &&
                        feedbackSubmitted && (

                          <div
                            className="
                              inline-flex
                              items-center
                              justify-center
                              gap-2
                              rounded-lg
                              bg-green-50
                              px-4
                              py-2.5
                              text-sm
                              font-medium
                              text-green-700
                            "
                          >

                            <CheckCircle2
                              className="h-4 w-4"
                            />

                            Feedback Submitted

                          </div>

                        )}


                      {/* =================================================
                          GIVE FEEDBACK
                      ================================================= */}

                      {!cancelled &&
                        completed &&
                        !feedbackSubmitted && (

                          <button
                            type="button"
                            onClick={() =>
                              handleFeedback(
                                registration.eventId
                              )
                            }
                            className="
                              inline-flex
                              shrink-0
                              items-center
                              justify-center
                              gap-2
                              rounded-lg
                              bg-indigo-600
                              px-4
                              py-2.5
                              text-sm
                              font-medium
                              text-white
                              transition
                              hover:bg-indigo-700
                              focus:outline-none
                              focus:ring-2
                              focus:ring-indigo-500
                              focus:ring-offset-2
                            "
                          >

                            <MessageSquareText
                              className="h-4 w-4"
                            />

                            Give Feedback

                          </button>

                        )}


                      {/* =================================================
                          CANCEL REGISTRATION

                          Only show if:
                          - Not cancelled
                          - Event not completed
                      ================================================= */}

                      {!cancelled &&
                        !completed && (

                          <button
                            type="button"
                            onClick={() =>
                              handleCancel(
                                registration.registrationId
                              )
                            }
                            className="
                              inline-flex
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
                              focus:outline-none
                              focus:ring-2
                              focus:ring-red-500
                              focus:ring-offset-2
                            "
                          >

                            <XCircle
                              className="h-4 w-4"
                            />

                            Cancel Registration

                          </button>

                        )}

                    </div>

                  </div>


                  {/* =================================================
                      FEEDBACK INFORMATION
                  ================================================= */}

                  {!cancelled &&
                    completed &&
                    !feedbackSubmitted && (

                      <div
                        className="
                          mt-5
                          rounded-lg
                          border
                          border-indigo-100
                          bg-indigo-50
                          px-4
                          py-3
                        "
                      >

                        <div
                          className="
                            flex
                            items-start
                            gap-3
                          "
                        >

                          <MessageSquareText
                            className="
                              mt-0.5
                              h-4
                              w-4
                              shrink-0
                              text-indigo-600
                            "
                          />

                          <div>

                            <p
                              className="
                                text-sm
                                font-medium
                                text-indigo-900
                              "
                            >
                              Event completed
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                leading-5
                                text-indigo-700
                              "
                            >
                              Please take a moment
                              to rate your experience
                              and share your feedback.
                            </p>

                          </div>

                        </div>

                      </div>

                    )}


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

                      {formatRegisteredDate(
                        registration.registeredAt
                      )}

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