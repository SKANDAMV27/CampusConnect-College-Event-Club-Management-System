import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Users,
  Search,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { getStudentEvents } from "../../api/studentApi";

function Events() {

  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const size = 9;

  useEffect(() => {

    loadEvents();

  }, [page, search]);

  const loadEvents = async () => {

    try {

      setLoading(true);

      const data =
        await getStudentEvents({
          page,
          size,
          search,
        });

      setEvents(data.content || []);

      setTotalPages(data.totalPages || 0);

      setTotalElements(
        data.totalElements || 0
      );

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Unable to load events",
        text: error.message,
      });

    } finally {

      setLoading(false);
    }
  };

  const handleSearch = (event) => {

    setSearch(event.target.value);

    setPage(0);
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

    const date =
      new Date();

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

  return (
    <div>

      <div className="mb-7">

        <h1 className="text-3xl font-bold text-slate-900">
          Events
        </h1>

        <p className="mt-2 text-slate-500">
          Browse upcoming college events.
        </p>

      </div>

      {/* SEARCH */}

      <div className="mb-7">

        <div className="relative max-w-xl">

          <Search
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search events..."
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        <p className="mt-3 text-sm text-slate-500">
          {totalElements} event
          {totalElements === 1 ? "" : "s"} found
        </p>

      </div>

      {/* LOADING */}

      {loading && (

        <div className="py-16 text-center text-slate-500">
          Loading events...
        </div>

      )}

      {/* EMPTY */}

      {!loading && events.length === 0 && (

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

          <CalendarDays
            className="mx-auto h-12 w-12 text-slate-300"
          />

          <h2 className="mt-4 text-xl font-semibold text-slate-800">
            No events found
          </h2>

          <p className="mt-2 text-slate-500">
            {search
              ? "Try another search."
              : "No published upcoming events are available."
            }
          </p>

        </div>

      )}

      {/* EVENT CARDS */}

      {!loading && events.length > 0 && (

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {events.map((event) => {

            const isFull =
              event.maxParticipants !== null &&
              event.registeredCount >=
                event.maxParticipants;

            return (

              <div
                key={event.id}
                className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                {/* IMAGE */}

                {event.imageUrl ? (

                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-48 w-full object-cover"
                  />

                ) : (

                  <div className="flex h-48 items-center justify-center bg-blue-50">

                    <CalendarDays
                      className="h-14 w-14 text-blue-500"
                    />

                  </div>

                )}

                <div className="p-6">

                  <div className="mb-3 flex items-start justify-between gap-3">

                    <h2 className="text-xl font-bold text-slate-900">
                      {event.title}
                    </h2>

                    {event.registered && (

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Registered
                      </span>

                    )}

                  </div>

                  <p className="line-clamp-3 text-sm text-slate-500">
                    {event.description}
                  </p>

                  <div className="mt-5 space-y-3 text-sm text-slate-600">

                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-4 w-4 text-blue-500" />
                      {formatDate(event.eventDate)}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-4 text-center text-blue-500">
                        🕐
                      </span>
                      {formatTime(event.startTime)}
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      {event.venue}
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-blue-500" />

                      {event.registeredCount}

                      {event.maxParticipants !== null
                        ? ` / ${event.maxParticipants}`
                        : " registered"}
                    </div>

                  </div>

                  {isFull && !event.registered && (

                    <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
                      Event is full
                    </div>

                  )}

                  <Link
                    to={`/events/${event.id}`}
                    className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                </div>

              </div>

            );
          })}

        </div>

      )}

      {/* PAGINATION */}

      {!loading && totalPages > 1 && (

        <div className="mt-8 flex items-center justify-center gap-2">

          <button
            disabled={page === 0}
            onClick={() =>
              setPage((previous) =>
                previous - 1
              )
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => index
          ).map((pageNumber) => (

            <button
              key={pageNumber}
              onClick={() =>
                setPage(pageNumber)
              }
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                page === pageNumber
                  ? "bg-blue-600 text-white"
                  : "border border-slate-300 bg-white text-slate-700"
              }`}
            >
              {pageNumber + 1}
            </button>

          ))}

          <button
            disabled={page >= totalPages - 1}
            onClick={() =>
              setPage((previous) =>
                previous + 1
              )
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>

        </div>

      )}

    </div>
  );
}

export default Events;