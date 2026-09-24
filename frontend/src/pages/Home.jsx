import { Link } from "react-router-dom";
import {
  CalendarDays,
  Users,
  Bell,
  ArrowRight,
} from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">

          <div>
            <p className="mb-4 font-semibold text-indigo-600">
              COLLEGE EVENT PLATFORM
            </p>

            <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
              Connect.
              <br />
              Participate.
              <br />
              Experience Campus Life.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-600">
              CampusConnect helps students discover college events,
              register for activities, and stay connected with campus life.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/events"
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                Explore Events
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/register"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-indigo-50 p-10">
            <CalendarDays
              size={100}
              className="mx-auto text-indigo-600"
            />

            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
              Everything happening on campus
            </h2>

            <p className="mt-3 text-center text-gray-600">
              Discover workshops, hackathons, seminars, cultural events,
              technical events and more.
            </p>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Why CampusConnect?
          </h2>

          <p className="mt-3 text-gray-600">
            One platform for managing your college events.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          <FeatureCard
            icon={<CalendarDays size={30} />}
            title="Discover Events"
            description="Find workshops, hackathons, seminars and other college events."
          />

          <FeatureCard
            icon={<Users size={30} />}
            title="Easy Registration"
            description="Register for events quickly and manage all your registrations."
          />

          <FeatureCard
            icon={<Bell size={30} />}
            title="Stay Updated"
            description="Keep track of upcoming activities and important event information."
          />

        </div>

      </section>

    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 text-gray-600">
        {description}
      </p>
    </div>
  );
}

export default Home;