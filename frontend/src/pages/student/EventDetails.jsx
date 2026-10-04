import { useEffect, useState } from "react";

import {
  CalendarDays,
  MapPin,
  Users,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Loader2,
  Info,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

import {
  getStudentEvent,
  registerForEvent,
} from "../../api/studentApi";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  // =========================================================
  // LOAD EVENT
  // =========================================================

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);

      const data = await getStudentEvent(id);

      setEvent(data);
    } catch (error) {
      console.error("Failed to load event:", error);

      toast.error(
        error?.message ||
          "Unable to load this event."
      );

      setTimeout(() => {
        navigate("/events", {
          replace: true,
        });
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // REGISTER FOR EVENT
  // =========================================================

  const handleRegister = async () => {
    if (registering) {
      return;
    }

    // -------------------------------------------------------
    // CONFIRMATION
    // -------------------------------------------------------

    const confirmation = await Swal.fire({
      title: "Register for this event?",
      text: "You will be added to the event registration list.",
      icon: "question",

      showCancelButton: true,

      confirmButtonText: "Yes, Register",
      cancelButtonText: "Cancel",

      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#64748b",

      reverseButtons: true,

      customClass: {
        popup: "rounded-2xl",
        confirmButton:
          "rounded-lg px-5 py-2.5 font-semibold",
        cancelButton:
          "rounded-lg px-5 py-2.5 font-semibold",
      },
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      setRegistering(true);

      // -----------------------------------------------------
      // API CALL
      // -----------------------------------------------------

      await registerForEvent(id);

      // -----------------------------------------------------
      // SUCCESS TOAST
      // -----------------------------------------------------

      toast.success(
        "You have successfully registered for this event!",
        {
          duration: 3000,
        }
      );

      // -----------------------------------------------------
      // REFRESH EVENT
      // -----------------------------------------------------

      await loadEvent();
    } catch (error) {
      console.error(
        "Event registration failed:",
        error
      );

      toast.error(
        error?.message ||
          "Unable to register for this event.",
        {
          duration: 4000,
        }
      );
    } finally {
      setRegistering(false);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    const [hours, minutes] =
      time.split(":");

    const date = new Date();

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
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
            },
          }}
        />

        <div className="min-h-[600px] bg-slate-50">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

            {/* Back skeleton */}

            <div className="mb-6 h-5 w-32 animate-pulse rounded bg-slate-200" />

            {/* Main skeleton */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="h-64 animate-pulse bg-slate-200 sm:h-72" />

              <div className="space-y-6 p-6 sm:p-8">

                <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />

                <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />

                <div className="grid gap-4 md:grid-cols-2">

                  {Array.from({
                    length: 4,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="h-28 animate-pulse rounded-xl bg-slate-100"
                    />
                  ))}

                </div>

                <div className="h-32 animate-pulse rounded-xl bg-slate-100" />

              </div>

            </div>

          </div>
        </div>
      </>
    );
  }

  // =========================================================
  // EVENT NOT FOUND
  // =========================================================

  if (!event) {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
            },
          }}
        />

        <div className="flex min-h-[500px] items-center justify-center bg-slate-50 px-4">

          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-7 w-7 text-red-500" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Event not found
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              The event you're looking for could not be
              found or may no longer be available.
            </p>

            <Link
              to="/events"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-indigo-600
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-indigo-700
              "
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>

          </div>

        </div>
      </>
    );
  }

  // =========================================================
  // EVENT STATUS
  // =========================================================

  const isFull =
    event.maxParticipants !== null &&
    event.maxParticipants !== undefined &&
    event.registeredCount >=
      event.maxParticipants;

  const isRegistered =
    Boolean(event.registered);

  const remainingSeats =
    event.maxParticipants !== null &&
    event.maxParticipants !== undefined
      ? Math.max(
          event.maxParticipants -
            event.registeredCount,
          0
        )
      : null;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      {/* =====================================================
          TOASTER
      ===================================================== */}

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,

          style: {
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
          },

          success: {
            duration: 3000,
          },

          error: {
            duration: 4000,
          },
        }}
      />

      <div className="min-h-screen bg-slate-50">

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

          {/* =================================================
              BACK LINK
          ================================================= */}

          <Link
            to="/events"
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-slate-600
              transition
              hover:text-indigo-600
            "
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Events
          </Link>

          {/* =================================================
              EVENT CARD
          ================================================= */}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* =================================================
                EVENT IMAGE
            ================================================= */}

            {event.imageUrl ? (
              <div className="relative h-64 overflow-hidden sm:h-80 lg:h-96">

                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-500
                    hover:scale-[1.02]
                  "
                />

                {/* Image overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Published badge */}

                <div className="absolute left-5 top-5">

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-white/20
                      bg-white/95
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-green-700
                      shadow-sm
                      backdrop-blur
                    "
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />

                    Published
                  </span>

                </div>

                {/* Title on image */}

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">

                  <h1
                    className="
                      max-w-4xl
                      text-2xl
                      font-bold
                      leading-tight
                      text-white
                      sm:text-3xl
                      lg:text-4xl
                    "
                  >
                    {event.title}
                  </h1>

                </div>

              </div>
            ) : (
              <div
                className="
                  flex
                  min-h-52
                  items-center
                  justify-center
                  bg-gradient-to-br
                  from-indigo-600
                  to-blue-700
                  px-6
                  sm:min-h-64
                "
              >

                <div className="text-center">

                  <CalendarDays className="mx-auto h-12 w-12 text-white/80" />

                  <h1
                    className="
                      mt-4
                      text-2xl
                      font-bold
                      text-white
                      sm:text-3xl
                    "
                  >
                    {event.title}
                  </h1>

                </div>

              </div>
            )}

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="p-5 sm:p-8 lg:p-10">

              {/* Status */}

              <div className="mb-6 flex flex-wrap items-center gap-2">

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-blue-50
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    text-blue-700
                  "
                >
                  <Info className="h-3.5 w-3.5" />

                  Published
                </span>

                {isRegistered && (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-green-50
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-green-700
                    "
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />

                    Registered
                  </span>
                )}

                {isFull && !isRegistered && (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-red-50
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-red-700
                    "
                  >
                    <AlertCircle className="h-3.5 w-3.5" />

                    Event Full
                  </span>
                )}

              </div>

              {/* Title */}

              {!event.imageUrl && (
                <h1
                  className="
                    mb-8
                    text-3xl
                    font-bold
                    tracking-tight
                    text-slate-900
                    sm:text-4xl
                  "
                >
                  {event.title}
                </h1>
              )}

              {/* =================================================
                  EVENT INFORMATION
              ================================================= */}

              <div className="grid gap-4 sm:grid-cols-2">

                {/* DATE */}

                <div
                  className="
                    group
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-5
                    transition
                    hover:border-indigo-200
                    hover:bg-indigo-50/40
                  "
                >

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-indigo-100
                      text-indigo-600
                    "
                  >
                    <CalendarDays className="h-5 w-5" />
                  </div>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Event Date
                  </p>

                  <p className="mt-1 font-semibold leading-6 text-slate-900">
                    {formatDate(event.eventDate)}
                  </p>

                </div>

                {/* TIME */}

                <div
                  className="
                    group
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-5
                    transition
                    hover:border-indigo-200
                    hover:bg-indigo-50/40
                  "
                >

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-100
                      text-blue-600
                    "
                  >
                    <Clock className="h-5 w-5" />
                  </div>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Time
                  </p>

                  <p className="mt-1 font-semibold leading-6 text-slate-900">
                    {formatTime(event.startTime)}

                    {event.endTime
                      ? ` - ${formatTime(
                          event.endTime
                        )}`
                      : ""}
                  </p>

                </div>

                {/* VENUE */}

                <div
                  className="
                    group
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-5
                    transition
                    hover:border-indigo-200
                    hover:bg-indigo-50/40
                  "
                >

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-purple-100
                      text-purple-600
                    "
                  >
                    <MapPin className="h-5 w-5" />
                  </div>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Venue
                  </p>

                  <p className="mt-1 font-semibold leading-6 text-slate-900">
                    {event.venue || "-"}
                  </p>

                </div>

                {/* PARTICIPANTS */}

                <div
                  className="
                    group
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-5
                    transition
                    hover:border-indigo-200
                    hover:bg-indigo-50/40
                  "
                >

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-emerald-100
                      text-emerald-600
                    "
                  >
                    <Users className="h-5 w-5" />
                  </div>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Participants
                  </p>

                  <p className="mt-1 font-semibold leading-6 text-slate-900">
                    {event.registeredCount || 0}

                    {event.maxParticipants !== null &&
                    event.maxParticipants !==
                      undefined
                      ? ` / ${event.maxParticipants}`
                      : ""}
                  </p>

                  {remainingSeats !== null &&
                    !isFull && (
                      <p className="mt-1 text-xs font-medium text-emerald-600">
                        {remainingSeats}{" "}
                        {remainingSeats === 1
                          ? "seat"
                          : "seats"}{" "}
                        remaining
                      </p>
                    )}

                </div>

              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div className="mt-10">

                <div className="flex items-center gap-3">

                  <div className="h-7 w-1 rounded-full bg-indigo-600" />

                  <h2 className="text-xl font-bold text-slate-900">
                    About This Event
                  </h2>

                </div>

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                  {event.description ||
                    "No description available for this event."}
                </p>

              </div>

              {/* =================================================
                  REGISTRATION DEADLINE
              ================================================= */}

              {event.registrationDeadline && (
                <div
                  className="
                    mt-7
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    border-amber-200
                    bg-amber-50
                    p-4
                  "
                >

                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                  <div>

                    <p className="text-sm font-semibold text-amber-900">
                      Registration Deadline
                    </p>

                    <p className="mt-1 text-sm text-amber-800">
                      {formatDate(
                        event.registrationDeadline
                      )}
                    </p>

                  </div>

                </div>
              )}

              {/* =================================================
                  REGISTRATION ACTION
              ================================================= */}

              <div className="mt-10 border-t border-slate-200 pt-8">

                {isRegistered ? (

                  <div
                    className="
                      flex
                      items-start
                      gap-4
                      rounded-2xl
                      border
                      border-green-200
                      bg-green-50
                      p-5
                    "
                  >

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-green-100
                      "
                    >
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>

                    <div>

                      <p className="font-semibold text-green-900">
                        You are registered!
                      </p>

                      <p className="mt-1 text-sm leading-6 text-green-700">
                        You have successfully registered
                        for this event. We look forward to
                        seeing you there.
                      </p>

                    </div>

                  </div>

                ) : isFull ? (

                  <div
                    className="
                      flex
                      items-start
                      gap-4
                      rounded-2xl
                      border
                      border-red-200
                      bg-red-50
                      p-5
                    "
                  >

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-red-100
                      "
                    >
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>

                    <div>

                      <p className="font-semibold text-red-900">
                        Event is full
                      </p>

                      <p className="mt-1 text-sm leading-6 text-red-700">
                        This event has reached its maximum
                        participant capacity.
                      </p>

                    </div>

                  </div>

                ) : (

                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 sm:p-6">

                    <div
                      className="
                        flex
                        flex-col
                        gap-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >

                      <div>

                        <div className="flex items-center gap-2">

                          <UserPlus className="h-5 w-5 text-indigo-600" />

                          <h3 className="font-bold text-slate-900">
                            Interested in this event?
                          </h3>

                        </div>

                        <p className="mt-1 text-sm text-slate-600">
                          Register now to reserve your
                          place.
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={handleRegister}
                        disabled={registering}
                        className="
                          inline-flex
                          min-w-[190px]
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-indigo-600
                          px-6
                          py-3
                          text-sm
                          font-semibold
                          text-white
                          shadow-sm
                          transition
                          hover:bg-indigo-700
                          hover:shadow-md
                          focus:outline-none
                          focus:ring-4
                          focus:ring-indigo-200
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                        "
                      >

                        {registering ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />

                            Registering...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />

                            Register for Event
                          </>
                        )}

                      </button>

                    </div>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}
export default EventDetails;