import {
  CalendarDays,
  ClipboardList,
  Users,
  CheckCircle,
  ArrowRight,
  MapPin,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

function StudentDashboard() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, Student! 👋
        </h1>

        <p className="mt-1 text-slate-500">
          Here's what's happening on your campus.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Upcoming Events"
          value="12"
          icon={CalendarDays}
        />

        <StatCard
          title="My Registrations"
          value="5"
          icon={ClipboardList}
        />

        <StatCard
          title="Available Events"
          value="24"
          icon={Users}
        />

        <StatCard
          title="Attended Events"
          value="8"
          icon={CheckCircle}
        />

      </div>

      {/* Upcoming Events */}
      <section>

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Upcoming Events
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Explore the latest events happening on campus.
            </p>
          </div>

          <Link
            to="/events"
            className="hidden items-center gap-2 text-sm font-semibold text-indigo-600 sm:flex"
          >
            View All
            <ArrowRight size={17} />
          </Link>

        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          <EventCard
            title="Full Stack Development Workshop"
            date="05 Oct 2026"
            time="10:00 AM"
            venue="Seminar Hall"
            seats="27 seats available"
          />

          <EventCard
            title="College Hackathon 2026"
            date="10 Oct 2026"
            time="09:00 AM"
            venue="Innovation Lab"
            seats="50 seats available"
          />

          <EventCard
            title="AI & Machine Learning Seminar"
            date="15 Oct 2026"
            time="02:00 PM"
            venue="Auditorium"
            seats="75 seats available"
          />

        </div>

      </section>

    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={24} />
        </div>

      </div>

    </div>
  );
}

function EventCard({
  title,
  date,
  time,
  venue,
  seats,
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      <div className="flex h-32 items-center justify-center bg-indigo-50">
        <CalendarDays
          size={52}
          className="text-indigo-500"
        />
      </div>

      <div className="p-5">

        <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">
          {title}
        </h3>

        <div className="mt-4 space-y-2 text-sm text-slate-500">

          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            {date}
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} />
            {time}
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} />
            {venue}
          </div>

        </div>

        <div className="mt-5 flex items-center justify-between">

          <span className="text-xs font-medium text-green-600">
            {seats}
          </span>

          <Link
            to="/events"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            View Details
          </Link>

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;