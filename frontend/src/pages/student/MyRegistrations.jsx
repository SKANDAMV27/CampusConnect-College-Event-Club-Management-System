import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  ClipboardList,
  MessageSquareText,
  XCircle,
  ArrowRight,
  TicketCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getMyRegistrations, cancelRegistration } from "../../api/studentApi";

function MyRegistrations() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const data = await getMyRegistrations();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load registrations:", error);
      Swal.fire({
        icon: "error",
        title: "Unable to load registrations",
        text: error?.response?.data?.message || error?.message || "Something went wrong.",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const handleCancel = async (registrationId) => {
    const confirmation = await Swal.fire({
      title: "Cancel registration?",
      text: "You can register again later if seats are available.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      cancelButtonText: "Keep registration",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });
    if (!confirmation.isConfirmed) return;

    try {
      setCancellingId(registrationId);
      await cancelRegistration(registrationId);
      await Swal.fire({
        icon: "success",
        title: "Registration cancelled",
        text: "Your registration has been cancelled.",
        confirmButtonColor: "#4f46e5",
      });
      await loadRegistrations();
    } catch (error) {
      console.error("Failed to cancel registration:", error);
      Swal.fire({
        icon: "error",
        title: "Unable to cancel",
        text: error?.response?.data?.message || error?.message || "Something went wrong.",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const handleFeedback = (eventId) => {
    if (!eventId) {
      Swal.fire({
        icon: "error",
        title: "Invalid event",
        text: "Unable to open feedback for this event.",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }
    navigate(`/events/${eventId}/feedback`);
  };

  const formatDate = (date) => {
    if (!date) return "Date to be announced";
    const parsed = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsed.getTime())
      ? date
      : parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatTime = (time) => {
    if (!time) return null;
    const [hours, minutes] = time.split(":");
    const parsed = new Date();
    parsed.setHours(Number(hours), Number(minutes), 0, 0);
    return parsed.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatRegisteredDate = (date) => {
    if (!date) return "Not available";
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime())
      ? date
      : parsed.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const isEventCompleted = (registration) => {
    if (typeof registration.eventCompleted === "boolean") return registration.eventCompleted;
    if (!registration.eventDate) return false;

    const endTime = registration.endTime || registration.startTime;
    const eventEnd = endTime
      ? new Date(`${registration.eventDate}T${endTime}`)
      : new Date(`${registration.eventDate}T23:59:59`);

    return !Number.isNaN(eventEnd.getTime()) && new Date() > eventEnd;
  };

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return registrations;
    return registrations.filter((registration) =>
      [
        registration.eventTitle,
        registration.venue,
        registration.status,
        registration.eventDate,
      ].some((value) => String(value || "").toLowerCase().includes(query)),
    );
  }, [registrations, search]);

  const activeCount = registrations.filter(
    (item) => String(item.status || "").toUpperCase() !== "CANCELLED" && !isEventCompleted(item),
  ).length;
  const completedCount = registrations.filter(
    (item) => String(item.status || "").toUpperCase() !== "CANCELLED" && isEventCompleted(item),
  ).length;
  const cancelledCount = registrations.filter(
    (item) => String(item.status || "").toUpperCase() === "CANCELLED",
  ).length;

  return (
    <main className="mx-auto w-full max-w-[1400px] space-y-6 pb-8">
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 px-6 py-8 text-white shadow-lg shadow-indigo-900/10 sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-50">
              <TicketCheck size={14} /> Your activity
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">My registrations</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
              Keep track of the campus events you’ve joined and manage your bookings in one place.
            </p>
          </div>
          <Link to="/events" className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50">
            Browse events <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Upcoming", value: activeCount, icon: CalendarDays, style: "bg-blue-50 text-blue-700" },
          { label: "Completed", value: completedCount, icon: CheckCircle2, style: "bg-emerald-50 text-emerald-700" },
          { label: "Cancelled", value: cancelledCount, icon: XCircle, style: "bg-rose-50 text-rose-700" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{item.value}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.style}`}>
                <Icon size={21} />
              </div>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <label className="relative block w-full max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by event name, venue, status, or date..."
            aria-label="Search registrations"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </label>
        <div className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredRegistrations.length}</span> of{" "}
          <span className="font-semibold text-slate-800">{registrations.length}</span> registrations
        </div>
      </section>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="h-5 w-2/5 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-4 w-3/5 animate-pulse rounded bg-slate-100" />
              <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : registrations.length === 0 ? (
        <EmptyState
          title="No registrations yet"
          description="Browse campus events and register for an activity that interests you."
          action={<Link to="/events" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">Browse events <ArrowRight size={16} /></Link>}
        />
      ) : filteredRegistrations.length === 0 ? (
        <EmptyState
          title="No matching registrations"
          description="Try a different search term to find your event."
          action={<button type="button" onClick={() => setSearch("")} className="mt-5 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Clear search</button>}
        />
      ) : (
        <div className="space-y-4">
          {filteredRegistrations.map((registration) => {
            const cancelled = String(registration.status || "").toUpperCase() === "CANCELLED";
            const completed = isEventCompleted(registration);
            const feedbackSubmitted = registration.feedbackSubmitted === true;

            return (
              <article key={registration.registrationId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to={`/events/${registration.eventId}`} className="text-lg font-bold text-slate-900 transition hover:text-indigo-700">
                        {registration.eventTitle || "Untitled event"}
                      </Link>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${cancelled ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                        {registration.status || "REGISTERED"}
                      </span>
                      {!cancelled && completed && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                          <CheckCircle2 size={13} /> Event completed
                        </span>
                      )}
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                      <Detail icon={CalendarDays} text={formatDate(registration.eventDate)} />
                      <Detail
                        icon={Clock3}
                        text={`${formatTime(registration.startTime) || "Time to be announced"}${registration.endTime ? ` – ${formatTime(registration.endTime)}` : ""}`}
                      />
                      <Detail icon={MapPin} text={registration.venue || "Venue to be announced"} />
                    </div>
                    <p className="mt-4 text-xs text-slate-500">
                      Registered on <span className="font-semibold text-slate-700">{formatRegisteredDate(registration.registeredAt)}</span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row lg:w-52 lg:flex-col">
                    {!cancelled && completed && feedbackSubmitted && (
                      <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
                        <CheckCircle2 size={16} /> Feedback submitted
                      </span>
                    )}
                    {!cancelled && completed && !feedbackSubmitted && (
                      <button type="button" onClick={() => handleFeedback(registration.eventId)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <MessageSquareText size={16} /> Give feedback
                      </button>
                    )}
                    {!cancelled && !completed && (
                      <button
                        type="button"
                        onClick={() => handleCancel(registration.registrationId)}
                        disabled={cancellingId === registration.registrationId}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle size={16} />
                        {cancellingId === registration.registrationId ? "Cancelling..." : "Cancel registration"}
                      </button>
                    )}
                    <Link to={`/events/${registration.eventId}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                      View event <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>

                {!cancelled && completed && !feedbackSubmitted && (
                  <div className="mt-5 flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                    <MessageSquareText size={18} className="mt-0.5 shrink-0 text-indigo-600" />
                    <div>
                      <p className="text-sm font-semibold text-indigo-900">Share your experience</p>
                      <p className="mt-1 text-xs leading-5 text-indigo-700">This event has ended. Please take a moment to rate the event and share feedback.</p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

function Detail({ icon: Icon, text }) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <Icon size={17} className="mt-0.5 shrink-0 text-indigo-600" />
      <span className="break-words">{text}</span>
    </div>
  );
}

function EmptyState({ title, description, action }) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <ClipboardList size={27} />
      </div>
      <h2 className="mt-4 text-lg font-bold text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {action}
    </section>
  );
}

export default MyRegistrations;