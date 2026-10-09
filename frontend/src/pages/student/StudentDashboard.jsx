import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Loader2,
  Sparkles,
  UserRound,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getStudentDashboard } from "../../api/studentApi";

function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const response = await getStudentDashboard();
        if (isMounted) setData(response);
      } catch (error) {
        console.error("Unable to load student dashboard:", error);

        if (isMounted) {
          Swal.fire({
            icon: "error",
            title: "Unable to load dashboard",
            text:
              error?.message ||
              "Something went wrong while loading your dashboard. Please try again.",
            confirmButtonColor: "#4f46e5",
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const studentName = data?.studentName || "Student";
  const totalEvents = Math.max(0, Number(data?.totalEvents ?? 0));
  const myRegistrations = Math.max(0, Number(data?.myRegistrations ?? 0));

  const participationRate = useMemo(() => {
    if (totalEvents === 0) return 0;
    return Math.min(100, Math.round((myRegistrations / totalEvents) * 100));
  }, [totalEvents, myRegistrations]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
            <Loader2 className="animate-spin text-indigo-600" size={26} />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Preparing your dashboard
          </p>
          <p className="text-sm text-slate-500">
            Getting your campus activity ready...
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Available events",
      value: totalEvents,
      description: "Discover what’s happening",
      icon: CalendarDays,
      iconClass: "bg-blue-50 text-blue-700",
      link: "/events",
      linkLabel: "Explore events",
      accent: "hover:border-blue-200",
    },
    {
      label: "My registrations",
      value: myRegistrations,
      description: "Events you’ve joined",
      icon: ClipboardList,
      iconClass: "bg-emerald-50 text-emerald-700",
      link: "/my-registrations",
      linkLabel: "View registrations",
      accent: "hover:border-emerald-200",
    },
    {
      label: "My profile",
      value: "Details",
      description: "Keep your information updated",
      icon: UserRound,
      iconClass: "bg-violet-50 text-violet-700",
      link: "/profile",
      linkLabel: "Manage profile",
      accent: "hover:border-violet-200",
    },
  ];

  const quickActions = [
    {
      title: "Explore events",
      description: "Find workshops, fests, and campus activities.",
      icon: CalendarDays,
      link: "/events",
      className: "bg-blue-50 text-blue-700",
    },
    {
      title: "My registrations",
      description: "Review the events you have registered for.",
      icon: ClipboardList,
      link: "/my-registrations",
      className: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "My profile",
      description: "View and update your student details.",
      icon: UserRound,
      link: "/profile",
      className: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-[1400px] space-y-6 pb-8">
      {/* Welcome banner */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 px-6 py-8 text-white shadow-lg shadow-indigo-900/10 sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-48 w-48 rounded-full bg-violet-300/20 blur-2xl" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-50 backdrop-blur">
              <Sparkles size={14} />
              Your campus, your experience
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Welcome back, {studentName}!
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
              Keep up with campus events, manage your registrations, and make
              the most of your college experience.
            </p>
            <Link
              to="/events"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              Discover events <ArrowRight size={16} />
            </Link>
          </div>

          <div className="hidden shrink-0 sm:flex sm:h-28 sm:w-28 sm:items-center sm:justify-center sm:rounded-3xl sm:border sm:border-white/20 sm:bg-white/10">
            <GraduationCap size={58} strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section aria-labelledby="overview-heading">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="overview-heading"
              className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
            >
              Your overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A quick look at your CampusConnect account.
            </p>
          </div>
          <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:mt-0">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Student portal
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.label}
                className={`group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${stat.accent}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {stat.description}
                    </p>
                  </div>
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}
                  >
                    <Icon size={21} />
                  </div>
                </div>
                <Link
                  to={stat.link}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 transition group-hover:gap-3 hover:text-indigo-800 focus:outline-none focus:underline"
                >
                  {stat.linkLabel}
                  <ArrowRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.85fr_1.5fr]">
        {/* Profile card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Student profile
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your account at a glance
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <UserRound size={20} />
            </div>
          </div>

          <div className="my-6 flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <GraduationCap size={30} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-900">
                {studentName}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                CampusConnect student
              </p>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 size={14} />
                Account active
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-600">
                <UserCheck size={16} className="text-slate-400" />
                Account status
              </span>
              <span className="font-semibold text-slate-800">Active</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-600">
                <Activity size={16} className="text-slate-400" />
                Event registrations
              </span>
              <span className="font-semibold text-slate-800">
                {myRegistrations}
              </span>
            </div>
          </div>

          <Link
            to="/profile"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            View profile <ArrowRight size={16} />
          </Link>
        </section>

        {/* Participation and quick actions */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Participation summary
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your registrations compared with available events
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <CalendarCheck size={20} />
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-700">
                  Registration ratio
                </span>
                <span className="text-sm font-bold tabular-nums text-slate-900">
                  {participationRate}%
                </span>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label="Registration ratio"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={participationRate}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all duration-500"
                  style={{ width: `${participationRate}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Available events
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {totalEvents}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Registrations
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {myRegistrations}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                This ratio is calculated from the dashboard totals and is an
                indicator only; it is not an attendance percentage.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <BookOpen size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Quick actions
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Jump straight to the features you use most.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    to={action.link}
                    className="group rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.className}`}
                    >
                      <Icon size={19} />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-slate-900">
                      {action.title}
                    </h3>
                    <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">
                      {action.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 transition group-hover:gap-2.5">
                      Open <ArrowRight size={14} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* Account status footer */}
      <section className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              You’re all set
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              Keep your profile up to date and check back for new campus events.
            </p>
          </div>
        </div>
        <Link
          to="/profile"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Manage profile <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}

export default StudentDashboard;
