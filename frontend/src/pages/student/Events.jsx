import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  XCircle,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { getStudentEvents } from "../../api/studentApi";

const PAGE_SIZE = 9;

function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      setLoading(true);
      try {
        const result = await getStudentEvents({
          page,
          size: PAGE_SIZE,
          search: search.trim(),
        });

        if (!active) return;
        setEvents(Array.isArray(result?.content) ? result.content : []);
        setTotalPages(Number(result?.totalPages || 0));
        setTotalElements(Number(result?.totalElements || 0));
      } catch (error) {
        console.error("Failed to load events:", error);
        if (active) toast.error(error?.message || "Unable to load events.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadEvents();
    return () => {
      active = false;
    };
  }, [page, search]);

  const isDeadlineCompleted = (deadline) => {
    if (!deadline) return false;
    const parsed = new Date(`${deadline}T23:59:59`);
    return !Number.isNaN(parsed.getTime()) && new Date() > parsed;
  };

  const formatDate = (date) => {
    if (!date) return "Date to be announced";
    const parsed = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsed.getTime())
      ? date
      : parsed.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const formatTime = (time) => {
    if (!time) return null;
    const [hours, minutes] = time.split(":");
    const parsed = new Date();
    parsed.setHours(Number(hours), Number(minutes), 0, 0);
    return parsed.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredEvents = useMemo(() => {
    if (statusFilter === "ACTIVE") {
      return events.filter((event) => !isDeadlineCompleted(event.registrationDeadline));
    }
    if (statusFilter === "DEADLINE_COMPLETED") {
      return events.filter((event) => isDeadlineCompleted(event.registrationDeadline));
    }
    return events;
  }, [events, statusFilter]);

  const activeCount = events.filter((event) => !isDeadlineCompleted(event.registrationDeadline)).length;
  const completedCount = events.length - activeCount;

  const filters = [
    { value: "ALL", label: "All events", count: events.length, icon: Sparkles },
    { value: "ACTIVE", label: "Registration open", count: activeCount, icon: CheckCircle2 },
    { value: "DEADLINE_COMPLETED", label: "Deadline passed", count: completedCount, icon: XCircle },
  ];

  return (
    <main className="mx-auto w-full max-w-[1400px] space-y-6 pb-8">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "12px", fontSize: "14px", fontWeight: 500 },
        }}
      />

      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 px-6 py-8 text-white shadow-lg shadow-indigo-900/10 sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-50">
              <CalendarDays size={14} /> Campus calendar
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Discover campus events</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
              Find workshops, celebrations, and activities happening around your campus.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-sm text-indigo-100">Events found</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{totalElements}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <label className="relative block w-full xl:max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              placeholder="Search by event name or keyword..."
              aria-label="Search events"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-2 text-sm font-medium text-slate-500">
              <SlidersHorizontal size={16} /> Filter
            </span>
            {filters.map((filter) => {
              const Icon = filter.icon;
              const selected = statusFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  aria-pressed={selected}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    selected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={15} />
                  <span>{filter.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${selected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
          <p>
            {statusFilter === "ALL"
              ? `${totalElements} event${totalElements === 1 ? "" : "s"} found`
              : statusFilter === "ACTIVE"
              ? "Showing events with open registration deadlines on this page"
              : "Showing events with passed registration deadlines on this page"}
          </p>
          {search.trim() && <p className="max-w-full truncate text-xs text-slate-400">Search: “{search.trim()}”</p>}
        </div>
      </section>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="h-44 animate-pulse bg-slate-200" />
              <div className="space-y-4 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <CalendarDays size={27} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            {search.trim() ? "No matching events" : "No events to show"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {search.trim()
              ? "Try another keyword or switch the registration filter."
              : "There are currently no events in this category. Check back soon."}
          </p>
          {(search.trim() || statusFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
                setPage(0);
              }}
              className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Clear filters
            </button>
          )}
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => {
            const deadlinePassed = isDeadlineCompleted(event.registrationDeadline);
            const isFull =
              event.maxParticipants !== null &&
              event.maxParticipants !== undefined &&
              Number(event.registeredCount || 0) >= Number(event.maxParticipants);

            return (
              <article key={event.id} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title || "Event"}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/80">
                      <CalendarDays size={48} strokeWidth={1.4} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/10" />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur ${deadlinePassed ? "bg-red-50/95 text-red-700" : "bg-emerald-50/95 text-emerald-700"}`}>
                      {deadlinePassed ? "Deadline passed" : "Registration open"}
                    </span>
                    {event.registered && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                        <CheckCircle2 size={13} /> Registered
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h2 className="line-clamp-2 text-xl font-bold leading-snug text-white">
                      {event.title || "Untitled event"}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
                    {event.description || "No description available for this event."}
                  </p>
                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    <div className="flex items-start gap-2.5">
                      <CalendarDays size={17} className="mt-0.5 shrink-0 text-indigo-600" />
                      <span>{formatDate(event.eventDate)}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock3 size={17} className="mt-0.5 shrink-0 text-indigo-600" />
                      <span>
                        {formatTime(event.startTime) || "Time to be announced"}
                        {event.endTime ? ` – ${formatTime(event.endTime)}` : ""}
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin size={17} className="mt-0.5 shrink-0 text-indigo-600" />
                      <span className="line-clamp-1">{event.venue || "Venue to be announced"}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Users size={17} className="mt-0.5 shrink-0 text-indigo-600" />
                      <span>
                        {Number(event.registeredCount || 0)} registered
                        {event.maxParticipants !== null && event.maxParticipants !== undefined
                          ? ` / ${event.maxParticipants} seats`
                          : ""}
                      </span>
                    </div>
                    {event.registrationDeadline && (
                      <p className="text-xs text-slate-500">
                        Registration deadline: <span className="font-semibold text-slate-700">{formatDate(event.registrationDeadline)}</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <Link
                      to={`/events/${event.id}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {event.registered ? "View event" : isFull && !deadlinePassed ? "View event details" : "View event details"}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <nav aria-label="Events pagination" className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:flex-row">
          <p className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-800">{page + 1}</span> of{" "}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              disabled={page === 0}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
              disabled={page >= totalPages - 1}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <ArrowRight size={15} />
            </button>
          </div>
        </nav>
      )}
    </main>
  );
}

export default Events;
