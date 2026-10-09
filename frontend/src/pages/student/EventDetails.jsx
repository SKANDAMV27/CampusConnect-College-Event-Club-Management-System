import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Users,
  AlertCircle,
  UserPlus,
  Loader2,
  Info,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { getStudentEvent, registerForEvent } from "../../api/studentApi";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const loadEvent = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getStudentEvent(id);
      setEvent(result || null);
    } catch (error) {
      console.error("Failed to load event:", error);
      toast.error(error?.message || "Unable to load this event.");
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const formatDate = (date) => {
    if (!date) return "Date to be announced";
    const parsed = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsed.getTime())
      ? date
      : parsed.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "2-digit",
          month: "long",
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

  const deadlinePassed = (() => {
    if (!event?.registrationDeadline) return false;
    const deadline = new Date(`${event.registrationDeadline}T23:59:59`);
    return !Number.isNaN(deadline.getTime()) && new Date() > deadline;
  })();

  const isFull =
    event?.maxParticipants !== null &&
    event?.maxParticipants !== undefined &&
    Number(event?.registeredCount || 0) >= Number(event.maxParticipants);
  const isRegistered = Boolean(event?.registered);
  const remainingSeats =
    event?.maxParticipants !== null && event?.maxParticipants !== undefined
      ? Math.max(Number(event.maxParticipants) - Number(event.registeredCount || 0), 0)
      : null;

  const handleRegister = async () => {
    if (registering || isRegistered || deadlinePassed || isFull) return;

    const confirmation = await Swal.fire({
      title: "Register for this event?",
      text: "You will be added to the event registration list.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, register",
      cancelButtonText: "Not now",
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) return;

    try {
      setRegistering(true);
      await registerForEvent(id);
      toast.success("You have successfully registered for this event!");
      await loadEvent();
    } catch (error) {
      console.error("Event registration failed:", error);
      toast.error(error?.message || "Unable to register for this event.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl pb-10">
      <Toaster
        position="top-right"
        toastOptions={{ duration: 3000, style: { borderRadius: "12px", fontSize: "14px" } }}
      />

      <Link
        to="/events"
        className="mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-600 transition hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <ArrowLeft size={17} /> Back to events
      </Link>

      {loading ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-64 animate-pulse bg-slate-200 sm:h-80" />
          <div className="space-y-5 p-6 sm:p-8">
            <div className="h-7 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      ) : !event ? (
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertCircle size={28} />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">Event not found</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            This event may no longer be available. Return to the event list to explore other activities.
          </p>
          <Link to="/events" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
            <ArrowLeft size={16} /> Browse events
          </Link>
        </section>
      ) : (
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-indigo-700 to-violet-600 sm:h-80 lg:h-[420px]">
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.title || "Event"} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-white/70">
                <CalendarDays size={72} strokeWidth={1.2} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
            <div className="absolute left-5 top-5 flex flex-wrap gap-2 sm:left-8 sm:top-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-indigo-700">
                <Info size={14} /> Published event
              </span>
              {isRegistered && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 size={14} /> You’re registered
                </span>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
              <h1 className="max-w-4xl text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                {event.title || "Untitled event"}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-white/85">
                <MapPin size={16} /> {event.venue || "Venue to be announced"}
              </p>
            </div>
          </div>

          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_320px] lg:p-10">
            <div>
              <h2 className="text-lg font-bold text-slate-900">About this event</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                {event.description || "No description has been provided for this event yet."}
              </p>

              <div className="mt-8">
                <h2 className="text-lg font-bold text-slate-900">Event information</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InfoTile icon={CalendarDays} label="Event date" value={formatDate(event.eventDate)} />
                  <InfoTile
                    icon={Clock3}
                    label="Time"
                    value={`${formatTime(event.startTime) || "To be announced"}${event.endTime ? ` – ${formatTime(event.endTime)}` : ""}`}
                  />
                  <InfoTile icon={MapPin} label="Venue" value={event.venue || "To be announced"} />
                  <InfoTile
                    icon={Users}
                    label="Participants"
                    value={`${Number(event.registeredCount || 0)} registered${event.maxParticipants !== null && event.maxParticipants !== undefined ? ` of ${event.maxParticipants}` : ""}`}
                  />
                </div>
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <h2 className="text-base font-bold text-slate-900">Registration</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Review availability before confirming your place.
              </p>

              {event.registrationDeadline && (
                <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Registration deadline</p>
                  <p className="mt-1.5 text-sm font-semibold text-slate-900">{formatDate(event.registrationDeadline)}</p>
                </div>
              )}

              {remainingSeats !== null && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Seats remaining</p>
                  <p className="mt-1.5 text-2xl font-bold text-slate-900">{remainingSeats}</p>
                </div>
              )}

              {isRegistered ? (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">You’re registered</p>
                    <p className="mt-1 text-xs leading-5">Your registration for this event is confirmed.</p>
                  </div>
                </div>
              ) : deadlinePassed ? (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                  <AlertCircle size={19} className="mt-0.5 shrink-0" />
                  <p className="text-sm font-semibold">The registration deadline has passed.</p>
                </div>
              ) : isFull ? (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                  <AlertCircle size={19} className="mt-0.5 shrink-0" />
                  <p className="text-sm font-semibold">This event has reached its participant limit.</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={registering}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {registering ? <Loader2 size={17} className="animate-spin" /> : <UserPlus size={17} />}
                  {registering ? "Registering..." : "Register for event"}
                </button>
              )}
              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                {isRegistered ? "You can review this event from your registrations." : "Please confirm your details before registering."}
              </p>
              {isRegistered && (
                <Link to="/my-registrations" className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  View my registrations
                </Link>
              )}
            </aside>
          </div>
        </article>
      )}
    </main>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
        <Icon size={19} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export default EventDetails;