import { useEffect, useState } from "react";

import {
  CalendarDays,
  MapPin,
  Users,
  Search,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
} from "lucide-react";

import { Link } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";

import { getStudentEvents } from "../../api/studentApi";

function Events() {
  // =========================================================
  // STATE
  // =========================================================

  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);

  const size = 9;

  // =========================================================
  // LOAD EVENTS
  // =========================================================

  useEffect(() => {
    loadEvents();
  }, [page, search]);

  const loadEvents = async () => {
    try {
      setLoading(true);

      const data = await getStudentEvents({
        page,
        size,
        search,
      });

      setEvents(data.content || []);

      setTotalPages(data.totalPages || 0);

      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error("Failed to load events:", error);

      toast.error(
        error?.message || "Unable to load events."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = (event) => {
    setSearch(event.target.value);

    setPage(0);
  };

  // =========================================================
  // STATUS FILTER
  // =========================================================

  const handleStatusFilter = (filter) => {
    setStatusFilter(filter);

    setPage(0);
  };

  // =========================================================
  // CHECK DEADLINE
  // =========================================================

  const isDeadlineCompleted = (registrationDeadline) => {
    if (!registrationDeadline) {
      return false;
    }

    const deadline = new Date(
      `${registrationDeadline}T23:59:59`
    );

    const now = new Date();

    return now > deadline;
  };

  // =========================================================
  // FILTER EVENTS
  // =========================================================

  const filteredEvents = events.filter((event) => {
    const deadlineCompleted = isDeadlineCompleted(
      event.registrationDeadline
    );

    if (statusFilter === "ACTIVE") {
      return !deadlineCompleted;
    }

    if (statusFilter === "DEADLINE_COMPLETED") {
      return deadlineCompleted;
    }

    return true;
  });

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
        day: "2-digit",
        month: "short",
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

    const [hours, minutes] = time.split(":");

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
  // ACTIVE COUNT
  // =========================================================

  const activeCount = events.filter(
    (event) =>
      !isDeadlineCompleted(
        event.registrationDeadline
      )
  ).length;

  // =========================================================
  // COMPLETED COUNT
  // =========================================================

  const completedCount = events.filter(
    (event) =>
      isDeadlineCompleted(
        event.registrationDeadline
      )
  ).length;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="pb-10">

      {/* =====================================================
          TOASTER
      ===================================================== */}

      <Toaster
        position="top-right"
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

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-7">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Events
            </h1>

            <p className="mt-2 text-slate-500">
              Browse college events and register for the
              ones you're interested in.
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        {/* SEARCH */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-xl">

            <Search
              className="
                absolute
                left-4
                top-1/2
                h-5
                w-5
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search events..."
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                py-3
                pl-12
                pr-4
                text-sm
                text-slate-800
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-100
              "
            />

          </div>

          {/* FILTER */}

          <div className="flex flex-wrap items-center gap-2">

            <div className="mr-1 hidden items-center gap-2 text-sm font-medium text-slate-500 sm:flex">

              <SlidersHorizontal className="h-4 w-4" />

              Filter:

            </div>

            {/* ALL */}

            <button
              type="button"
              onClick={() =>
                handleStatusFilter("ALL")
              }
              className={`
                inline-flex
                items-center
                gap-1.5
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-semibold
                transition

                ${
                  statusFilter === "ALL"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }
              `}
            >
              All

              <span
                className={`
                  rounded-full
                  px-2
                  py-0.5
                  text-xs

                  ${
                    statusFilter === "ALL"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600"
                  }
                `}
              >
                {events.length}
              </span>

            </button>

            {/* ACTIVE */}

            <button
              type="button"
              onClick={() =>
                handleStatusFilter("ACTIVE")
              }
              className={`
                inline-flex
                items-center
                gap-1.5
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-semibold
                transition

                ${
                  statusFilter === "ACTIVE"
                    ? "bg-green-600 text-white shadow-sm"
                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }
              `}
            >
              <CheckCircle2 className="h-4 w-4" />

              Active

              <span
                className={`
                  rounded-full
                  px-2
                  py-0.5
                  text-xs

                  ${
                    statusFilter === "ACTIVE"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600"
                  }
                `}
              >
                {activeCount}
              </span>

            </button>

            {/* DEADLINE COMPLETED */}

            <button
              type="button"
              onClick={() =>
                handleStatusFilter(
                  "DEADLINE_COMPLETED"
                )
              }
              className={`
                inline-flex
                items-center
                gap-1.5
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-semibold
                transition

                ${
                  statusFilter ===
                  "DEADLINE_COMPLETED"
                    ? "bg-red-600 text-white shadow-sm"
                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }
              `}
            >
              <XCircle className="h-4 w-4" />

              Deadline Completed

              <span
                className={`
                  rounded-full
                  px-2
                  py-0.5
                  text-xs

                  ${
                    statusFilter ===
                    "DEADLINE_COMPLETED"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600"
                  }
                `}
              >
                {completedCount}
              </span>

            </button>

          </div>

        </div>

        {/* RESULT COUNT */}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">

          <p className="text-sm text-slate-500">

            {statusFilter === "ALL" && (
              <>
                {totalElements} event
                {totalElements === 1 ? "" : "s"} found
              </>
            )}

            {statusFilter === "ACTIVE" && (
              <>
                Showing active events
              </>
            )}

            {statusFilter ===
              "DEADLINE_COMPLETED" && (
              <>
                Showing events with completed deadlines
              </>
            )}

          </p>

          {search && (
            <p className="text-xs text-slate-400">
              Search: "{search}"
            </p>
          )}

        </div>

      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {Array.from({ length: 6 }).map(
            (_, index) => (

              <div
                key={index}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                "
              >

                <div className="h-48 animate-pulse bg-slate-200" />

                <div className="space-y-4 p-6">

                  <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />

                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />

                  <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />

                  <div className="space-y-3 pt-2">

                    <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />

                    <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />

                    <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />

                  </div>

                  <div className="h-11 animate-pulse rounded-xl bg-slate-200" />

                </div>

              </div>

            )
          )}

        </div>

      )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading &&
        filteredEvents.length === 0 && (

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-white
              p-12
              text-center
            "
          >

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">

              <CalendarDays className="h-8 w-8 text-slate-400" />

            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-800">

              {search
                ? "No matching events"
                : statusFilter === "ACTIVE"
                ? "No active events"
                : statusFilter ===
                  "DEADLINE_COMPLETED"
                ? "No completed deadlines"
                : "No events found"}

            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">

              {search
                ? "Try changing your search keyword or selecting a different filter."
                : statusFilter === "ACTIVE"
                ? "There are currently no events with an active registration deadline."
                : statusFilter ===
                  "DEADLINE_COMPLETED"
                ? "There are currently no events whose registration deadline has passed."
                : "No published events are currently available."}

            </p>

            {(search ||
              statusFilter !== "ALL") && (

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setPage(0);
                }}
                className="
                  mt-5
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
                Clear Filters
              </button>

            )}

          </div>

        )}

      {/* =====================================================
          EVENT CARDS
      ===================================================== */}

      {!loading &&
        filteredEvents.length > 0 && (

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredEvents.map((event) => {

              const deadlineCompleted =
                isDeadlineCompleted(
                  event.registrationDeadline
                );

              const isFull =
                event.maxParticipants !== null &&
                event.maxParticipants !==
                  undefined &&
                event.registeredCount >=
                  event.maxParticipants;

              return (

                <div
                  key={event.id}
                  className="
                    group
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    transition
                    duration-200
                    hover:-translate-y-1
                    hover:border-slate-300
                    hover:shadow-lg
                  "
                >

                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="relative">

                    {event.imageUrl ? (

                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="
                          h-48
                          w-full
                          object-cover
                          transition
                          duration-300
                          group-hover:scale-[1.02]
                        "
                      />

                    ) : (

                      <div
                        className="
                          flex
                          h-48
                          items-center
                          justify-center
                          bg-gradient-to-br
                          from-indigo-50
                          to-blue-100
                        "
                      >

                        <CalendarDays className="h-14 w-14 text-indigo-400" />

                      </div>

                    )}

                    {/* STATUS BADGE */}

                    <div className="absolute left-4 top-4">

                      {deadlineCompleted ? (

                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            bg-red-50/95
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            text-red-700
                            shadow-sm
                            backdrop-blur
                          "
                        >
                          <XCircle className="h-3.5 w-3.5" />

                          Deadline Completed
                        </span>

                      ) : (

                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            bg-green-50/95
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

                          Active
                        </span>

                      )}

                    </div>

                    {/* REGISTERED BADGE */}

                    {event.registered && (

                      <div className="absolute right-4 top-4">

                        <span
                          className="
                            rounded-full
                            bg-blue-600
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-white
                            shadow-sm
                          "
                        >
                          Registered
                        </span>

                      </div>

                    )}

                  </div>

                  {/* =================================================
                      CARD CONTENT
                  ================================================= */}

                  <div className="p-6">

                    {/* TITLE */}

                    <div className="mb-3">

                      <h2 className="line-clamp-2 text-xl font-bold leading-7 text-slate-900">
                        {event.title}
                      </h2>

                    </div>

                    {/* DESCRIPTION */}

                    <p className="line-clamp-3 text-sm leading-6 text-slate-500">

                      {event.description ||
                        "No description available for this event."}

                    </p>

                    {/* EVENT DETAILS */}

                    <div className="mt-5 space-y-3 text-sm text-slate-600">

                      {/* EVENT DATE */}

                      <div className="flex items-center gap-3">

                        <CalendarDays className="h-4 w-4 shrink-0 text-indigo-500" />

                        <span>
                          {formatDate(event.eventDate)}
                        </span>

                      </div>

                      {/* TIME */}

                      <div className="flex items-center gap-3">

                        <Clock className="h-4 w-4 shrink-0 text-blue-500" />

                        <span>
                          {formatTime(event.startTime)}

                          {event.endTime
                            ? ` - ${formatTime(
                                event.endTime
                              )}`
                            : ""}
                        </span>

                      </div>

                      {/* VENUE */}

                      <div className="flex items-center gap-3">

                        <MapPin className="h-4 w-4 shrink-0 text-purple-500" />

                        <span className="line-clamp-1">
                          {event.venue || "-"}
                        </span>

                      </div>

                      {/* PARTICIPANTS */}

                      <div className="flex items-center gap-3">

                        <Users className="h-4 w-4 shrink-0 text-emerald-500" />

                        <span>

                          {event.registeredCount || 0}

                          {event.maxParticipants !==
                            null &&
                          event.maxParticipants !==
                            undefined
                            ? ` / ${event.maxParticipants}`
                            : " registered"}

                        </span>

                      </div>

                    </div>

                    {/* =================================================
                        REGISTRATION DEADLINE
                    ================================================= */}

                    {event.registrationDeadline && (

                      <div
                        className={`
                          mt-5
                          rounded-xl
                          border
                          p-3

                          ${
                            deadlineCompleted
                              ? "border-red-200 bg-red-50"
                              : "border-amber-200 bg-amber-50"
                          }
                        `}
                      >

                        <div className="flex items-start gap-2.5">

                          {deadlineCompleted ? (

                            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

                          ) : (

                            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                          )}

                          <div>

                            <p
                              className={`
                                text-xs
                                font-bold

                                ${
                                  deadlineCompleted
                                    ? "text-red-800"
                                    : "text-amber-800"
                                }
                              `}
                            >
                              {deadlineCompleted
                                ? "Deadline Completed"
                                : "Registration Deadline"}
                            </p>

                            <p
                              className={`
                                mt-0.5
                                text-sm
                                font-semibold

                                ${
                                  deadlineCompleted
                                    ? "text-red-700"
                                    : "text-amber-700"
                                }
                              `}
                            >
                              {formatDate(
                                event.registrationDeadline
                              )}
                            </p>

                          </div>

                        </div>

                      </div>

                    )}

                    {/* =================================================
                        FULL EVENT
                    ================================================= */}

                    {isFull &&
                      !event.registered &&
                      !deadlineCompleted && (

                        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">

                          Event is full

                        </div>

                      )}

                    {/* =================================================
                        DEADLINE COMPLETED MESSAGE
                    ================================================= */}

                    {deadlineCompleted && (

                      <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium leading-5 text-red-600">

                        Registration is no longer available
                        because the deadline has passed.

                      </div>

                    )}

                    {/* =================================================
                        VIEW DETAILS
                    ================================================= */}

                    <Link
                      to={`/events/${event.id}`}
                      className="
                        mt-6
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-indigo-600
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-indigo-700
                        focus:outline-none
                        focus:ring-4
                        focus:ring-indigo-100
                      "
                    >
                      View Details

                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />

                    </Link>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {!loading &&
        totalPages > 1 && (

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">

            {/* PREVIOUS */}

            <button
              type="button"
              disabled={page === 0}
              onClick={() =>
                setPage(
                  (previous) =>
                    previous - 1
                )
              }
              className="
                rounded-lg
                border
                border-slate-300
                bg-white
                px-4
                py-2
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              Previous
            </button>

            {/* PAGE NUMBERS */}

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) => index
            ).map((pageNumber) => (

              <button
                type="button"
                key={pageNumber}
                onClick={() =>
                  setPage(pageNumber)
                }
                className={`
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition

                  ${
                    page === pageNumber
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }
                `}
              >
                {pageNumber + 1}
              </button>

            ))}

            {/* NEXT */}

            <button
              type="button"
              disabled={
                page >= totalPages - 1
              }
              onClick={() =>
                setPage(
                  (previous) =>
                    previous + 1
                )
              }
              className="
                rounded-lg
                border
                border-slate-300
                bg-white
                px-4
                py-2
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              Next
            </button>

          </div>

        )}

    </div>
  );
}

export default Events;