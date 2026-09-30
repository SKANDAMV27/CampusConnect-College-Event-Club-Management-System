import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Users,
  ArrowLeft,
  Clock,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import Swal from "sweetalert2";

import {
  getStudentEvent,
  registerForEvent,
} from "../../api/studentApi";

function EventDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [event, setEvent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [registering, setRegistering] =
    useState(false);

  useEffect(() => {

    loadEvent();

  }, [id]);

  const loadEvent = async () => {

    try {

      setLoading(true);

      const data =
        await getStudentEvent(id);

      setEvent(data);

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Event not found",
        text: error.message,
      }).then(() => {
        navigate("/events");
      });

    } finally {

      setLoading(false);
    }
  };

  const handleRegister = async () => {

    const confirmation =
      await Swal.fire({
        title: "Register for this event?",
        text: "You will be added to the event registration list.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Register",
        cancelButtonText: "Cancel",
      });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {

      setRegistering(true);

      await registerForEvent(id);

      await Swal.fire({
        icon: "success",
        title: "Registered!",
        text: "You have successfully registered for this event.",
      });

      await loadEvent();

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: error.message,
      });

    } finally {

      setRegistering(false);
    }
  };

  const formatDate = (date) => {

    if (!date) return "-";

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
        Loading event...
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const isFull =
    event.maxParticipants !== null &&
    event.registeredCount >=
      event.maxParticipants;

  return (
    <div className="max-w-5xl">

      <Link
        to="/events"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">

        {event.imageUrl && (

          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-72 w-full object-cover"
          />

        )}

        <div className="p-8">

          <div className="flex flex-col justify-between gap-4 md:flex-row">

            <div>

              <div className="mb-3 flex flex-wrap gap-2">

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Published
                </span>

                {event.registered && (

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Registered
                  </span>

                )}

              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                {event.title}
              </h1>

            </div>

          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">

            <div className="rounded-xl bg-slate-50 p-5">

              <CalendarDays className="mb-3 h-6 w-6 text-blue-600" />

              <p className="text-sm text-slate-500">
                Event Date
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {formatDate(event.eventDate)}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-5">

              <Clock className="mb-3 h-6 w-6 text-blue-600" />

              <p className="text-sm text-slate-500">
                Time
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {formatTime(event.startTime)}

                {event.endTime
                  ? ` - ${formatTime(event.endTime)}`
                  : ""}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-5">

              <MapPin className="mb-3 h-6 w-6 text-blue-600" />

              <p className="text-sm text-slate-500">
                Venue
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {event.venue}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-5">

              <Users className="mb-3 h-6 w-6 text-blue-600" />

              <p className="text-sm text-slate-500">
                Participants
              </p>

              <p className="mt-1 font-semibold text-slate-900">

                {event.registeredCount}

                {event.maxParticipants !== null
                  ? ` / ${event.maxParticipants}`
                  : ""}
              </p>

            </div>

          </div>

          <div className="mt-8">

            <h2 className="text-xl font-bold text-slate-900">
              About This Event
            </h2>

            <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
              {event.description}
            </p>

          </div>

          {event.registrationDeadline && (

            <div className="mt-6 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">

              Registration Deadline:{" "}

              <strong>
                {formatDate(
                  event.registrationDeadline
                )}
              </strong>

            </div>

          )}

          <div className="mt-8">

            {event.registered ? (

              <div className="rounded-xl bg-green-50 p-4 text-center font-medium text-green-700">
                You are already registered for this event.
              </div>

            ) : isFull ? (

              <div className="rounded-xl bg-red-50 p-4 text-center font-medium text-red-700">
                This event has reached maximum capacity.
              </div>

            ) : (

              <button
                onClick={handleRegister}
                disabled={registering}
                className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {registering
                  ? "Registering..."
                  : "Register for Event"}
              </button>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default EventDetails;