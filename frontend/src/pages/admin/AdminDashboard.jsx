import { useEffect, useMemo, useState } from "react";

import {
  Users,
  CalendarDays,
  Building2,
  ClipboardList,
  GraduationCap,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  UserCheck,
  CalendarCheck,
  Building,
  Loader2,
} from "lucide-react";

import { apiFetch } from "../../api/api";

function AdminDashboard() {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* =========================================================
     LOAD DASHBOARD
  ========================================================= */

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const data = await apiFetch(
        "/admin/dashboard"
      );

      setDashboard(data);
    } catch (error) {
      console.error(
        "Failed to load dashboard:",
        error
      );

      setDashboard({
        totalStudents: 0,
        totalEvents: 0,
        totalClubs: 0,
        totalRegistrations: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     VALUES
  ========================================================= */

  const totalStudents =
    dashboard?.totalStudents ?? 0;

  const totalEvents =
    dashboard?.totalEvents ?? 0;

  const totalClubs =
    dashboard?.totalClubs ?? 0;

  const totalRegistrations =
    dashboard?.totalRegistrations ?? 0;

  /*
   * These percentages are only visual indicators based on
   * the existing dashboard counts. They do not represent
   * backend health metrics.
   */

  const registrationRate = useMemo(() => {
    if (totalStudents === 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (totalRegistrations /
          totalStudents) *
          100
      )
    );
  }, [
    totalStudents,
    totalRegistrations,
  ]);

  const systemScore = useMemo(() => {
    const studentScore =
      totalStudents > 0 ? 25 : 0;

    const eventScore =
      totalEvents > 0 ? 25 : 0;

    const clubScore =
      totalClubs > 0 ? 25 : 0;

    const registrationScore =
      totalRegistrations > 0 ? 25 : 0;

    return (
      studentScore +
      eventScore +
      clubScore +
      registrationScore
    );
  }, [
    totalStudents,
    totalEvents,
    totalClubs,
    totalRegistrations,
  ]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div
        className="
          min-h-[500px]
          flex
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            text-sm
            text-gray-500
          "
        >
          <Loader2
            size={20}
            className="
              animate-spin
              text-teal-700
            "
          />

          Loading dashboard...
        </div>
      </div>
    );
  }

  /* =========================================================
     METRIC CARDS
  ========================================================= */

  const cards = [
    {
      title: "Students",
      subtitle: "Registered students",
      value: totalStudents,
      icon: Users,
      iconClass:
        "bg-blue-50 text-blue-700",
      valueClass:
        "text-blue-700",
    },

    {
      title: "Events",
      subtitle: "Campus events",
      value: totalEvents,
      icon: CalendarDays,
      iconClass:
        "bg-purple-50 text-purple-700",
      valueClass:
        "text-purple-700",
    },

    {
      title: "Clubs",
      subtitle: "Active campus clubs",
      value: totalClubs,
      icon: Building2,
      iconClass:
        "bg-orange-50 text-orange-700",
      valueClass:
        "text-orange-700",
    },

    {
      title: "Registrations",
      subtitle: "Event registrations",
      value: totalRegistrations,
      icon: ClipboardList,
      iconClass:
        "bg-teal-50 text-teal-700",
      valueClass:
        "text-teal-700",
    },
  ];

  return (
    <div className="max-w-[1500px] mx-auto">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-7">

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-semibold
              text-gray-900
            "
          >
            CampusConnect Dashboard
          </h1>

        </div>


        <p
          className="
            mt-2
            text-sm
            sm:text-base
            text-gray-500
          "
        >
          Cross-functional overview of
          students, events, clubs, and
          event registrations
        </p>

      </div>


      {/* =====================================================
          SECTION TITLE
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          gap-2
          pb-4
          mb-5
          border-b
          border-gray-300
        "
      >

        <h2
          className="
            text-xl
            font-semibold
            text-gray-900
          "
        >
          System Admin
        </h2>

        <span
          className="
            hidden
            sm:block
            text-gray-400
          "
        >
          •
        </span>

        <p
          className="
            text-sm
            text-gray-600
          "
        >
          Campus health · Student activity ·
          Event management · Club management
        </p>

      </div>


      {/* =====================================================
          TOP SECTION
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-[360px_1fr]
          gap-5
          mb-5
        "
      >

        {/* ===================================================
            CAMPUS HEALTH
        =================================================== */}

        <div
          className="
            bg-white
            border
            border-gray-400
            rounded-xl
            p-6
          "
        >

          <h3
            className="
              text-sm
              font-semibold
              uppercase
              tracking-wide
              text-gray-700
            "
          >
            Campus Health Score
          </h3>


          {/* SCORE */}

          <div
            className="
              flex
              justify-center
              py-7
            "
          >

            <div
              className="
                relative
                w-40
                h-40
              "
            >

              {/* OUTER RING */}

              <svg
                viewBox="0 0 160 160"
                className="
                  w-full
                  h-full
                  -rotate-90
                "
              >

                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="14"
                />

                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="none"
                  stroke="#0f766e"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="364"
                  strokeDashoffset={
                    364 -
                    (364 *
                      systemScore) /
                      100
                  }
                />

              </svg>


              {/* CENTER */}

              <div
                className="
                  absolute
                  inset-0
                  flex
                  flex-col
                  items-center
                  justify-center
                "
              >

                <span
                  className="
                    text-3xl
                    font-bold
                    text-gray-900
                  "
                >
                  {systemScore}
                </span>

                <span
                  className="
                    mt-1
                    text-[11px]
                    font-medium
                    text-gray-500
                    uppercase
                  "
                >
                  SYSTEM HEALTH
                </span>

              </div>

            </div>

          </div>


          {/* HEALTH DETAILS */}

          <div className="space-y-4">

            <div
              className="
                flex
                items-center
                justify-between
                text-sm
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-gray-700
                "
              >
                <Users
                  size={16}
                  className="text-gray-400"
                />

                Students registered
              </div>

              <span
                className="
                  font-semibold
                  text-gray-900
                "
              >
                {totalStudents}
              </span>

            </div>


            <div
              className="
                flex
                items-center
                justify-between
                text-sm
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-gray-700
                "
              >
                <CalendarDays
                  size={16}
                  className="text-gray-400"
                />

                Events available
              </div>

              <span
                className="
                  font-semibold
                  text-gray-900
                "
              >
                {totalEvents}
              </span>

            </div>


            <div
              className="
                flex
                items-center
                justify-between
                text-sm
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-gray-700
                "
              >
                <Building2
                  size={16}
                  className="text-gray-400"
                />

                Clubs available
              </div>

              <span
                className="
                  font-semibold
                  text-gray-900
                "
              >
                {totalClubs}
              </span>

            </div>

          </div>

        </div>


        {/* ===================================================
            CAMPUS ACTIVITY
        =================================================== */}

        <div
          className="
            bg-white
            border
            border-gray-400
            rounded-xl
            p-6
          "
        >

          <h3
            className="
              text-sm
              font-semibold
              uppercase
              tracking-wide
              text-gray-700
              mb-5
            "
          >
            Campus Activity Overview
          </h3>


          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-4
              gap-4
            "
          >

            {cards.map(
              (card) => {
                const Icon =
                  card.icon;

                return (
                  <div
                    key={card.title}
                    className="
                      border
                      border-gray-300
                      rounded-xl
                      p-5
                      min-h-[210px]
                      flex
                      flex-col
                      justify-between
                    "
                  >

                    <div>

                      <div
                        className={`
                          w-10
                          h-10
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          ${card.iconClass}
                        `}
                      >

                        <Icon
                          size={20}
                        />

                      </div>


                      <p
                        className="
                          mt-5
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-gray-600
                        "
                      >
                        {card.title}
                      </p>


                      <p
                        className={`
                          mt-2
                          text-4xl
                          font-bold
                          ${card.valueClass}
                        `}
                      >
                        {card.value}
                      </p>

                    </div>


                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-2
                        mt-5
                      "
                    >

                      <span
                        className="
                          text-xs
                          text-gray-500
                        "
                      >
                        {card.subtitle}
                      </span>


                      <Activity
                        size={16}
                        className="
                          text-gray-400
                        "
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          SECOND ROW
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-5
          mb-5
        "
      >

        {/* ===================================================
            STUDENT MANAGEMENT
        =================================================== */}

        <div
          className="
            bg-white
            border
            border-gray-400
            rounded-xl
            p-6
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-6
            "
          >

            <h3
              className="
                text-sm
                font-semibold
                uppercase
                tracking-wide
                text-gray-700
              "
            >
              Student Management
            </h3>

            <Users
              size={20}
              className="
                text-gray-400
              "
            />

          </div>


          {/* STUDENT COUNT */}

          <div
            className="
              mb-6
              p-4
              rounded-lg
              border
              border-blue-200
              bg-blue-50
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-lg
                    bg-white
                    flex
                    items-center
                    justify-center
                    text-blue-700
                  "
                >

                  <GraduationCap
                    size={20}
                  />

                </div>


                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-gray-900
                    "
                  >
                    Registered Students
                  </p>

                  <p
                    className="
                      text-xs
                      text-gray-500
                      mt-1
                    "
                  >
                    Students currently
                    registered in CampusConnect
                  </p>

                </div>

              </div>


              <span
                className="
                  text-2xl
                  font-bold
                  text-blue-700
                "
              >
                {totalStudents}
              </span>

            </div>

          </div>


          {/* PROGRESS */}

          <div className="space-y-5">

            <div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-2
                "
              >

                <span
                  className="
                    text-sm
                    text-gray-700
                  "
                >
                  Student participation
                </span>

                <span
                  className="
                    text-sm
                    font-semibold
                    text-gray-900
                  "
                >
                  {registrationRate}%
                </span>

              </div>


              <div
                className="
                  h-2
                  rounded-full
                  bg-gray-200
                  overflow-hidden
                "
              >

                <div
                  className="
                    h-full
                    rounded-full
                    bg-blue-600
                  "
                  style={{
                    width: `${registrationRate}%`,
                  }}
                />

              </div>

            </div>


            <div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-2
                "
              >

                <span
                  className="
                    text-sm
                    text-gray-700
                  "
                >
                  Account availability
                </span>

                <span
                  className="
                    text-sm
                    font-semibold
                    text-green-700
                  "
                >
                  Active
                </span>

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-gray-500
                "
              >

                <CheckCircle2
                  size={14}
                  className="
                    text-green-600
                  "
                />

                Student accounts are
                available through the
                registration system.

              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            EVENT & CLUB MANAGEMENT
        =================================================== */}

        <div
          className="
            bg-white
            border
            border-gray-400
            rounded-xl
            p-6
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-6
            "
          >

            <h3
              className="
                text-sm
                font-semibold
                uppercase
                tracking-wide
                text-gray-700
              "
            >
              Master Records
            </h3>

            <Building
              size={20}
              className="
                text-gray-400
              "
            />

          </div>


          <div className="space-y-6">

            {/* EVENTS */}

            <div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-2
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <CalendarCheck
                    size={18}
                    className="
                      text-purple-600
                    "
                  />

                  <span
                    className="
                      text-sm
                      font-medium
                      text-gray-800
                    "
                  >
                    Events
                  </span>

                </div>


                <span
                  className="
                    text-sm
                    font-semibold
                    text-gray-900
                  "
                >
                  {totalEvents}
                </span>

              </div>


              <div
                className="
                  h-2
                  rounded-full
                  bg-gray-200
                  overflow-hidden
                "
              >

                <div
                  className="
                    h-full
                    rounded-full
                    bg-purple-600
                  "
                  style={{
                    width:
                      totalEvents > 0
                        ? "100%"
                        : "0%",
                  }}
                />

              </div>

            </div>


            {/* CLUBS */}

            <div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-2
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <Building2
                    size={18}
                    className="
                      text-orange-600
                    "
                  />

                  <span
                    className="
                      text-sm
                      font-medium
                      text-gray-800
                    "
                  >
                    Clubs
                  </span>

                </div>


                <span
                  className="
                    text-sm
                    font-semibold
                    text-gray-900
                  "
                >
                  {totalClubs}
                </span>

              </div>


              <div
                className="
                  h-2
                  rounded-full
                  bg-gray-200
                  overflow-hidden
                "
              >

                <div
                  className="
                    h-full
                    rounded-full
                    bg-orange-500
                  "
                  style={{
                    width:
                      totalClubs > 0
                        ? "100%"
                        : "0%",
                  }}
                />

              </div>

            </div>


            {/* REGISTRATIONS */}

            <div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-2
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <ClipboardList
                    size={18}
                    className="
                      text-teal-600
                    "
                  />

                  <span
                    className="
                      text-sm
                      font-medium
                      text-gray-800
                    "
                  >
                    Event Registrations
                  </span>

                </div>


                <span
                  className="
                    text-sm
                    font-semibold
                    text-gray-900
                  "
                >
                  {totalRegistrations}
                </span>

              </div>


              <div
                className="
                  h-2
                  rounded-full
                  bg-gray-200
                  overflow-hidden
                "
              >

                <div
                  className="
                    h-full
                    rounded-full
                    bg-teal-600
                  "
                  style={{
                    width:
                      totalRegistrations > 0
                        ? "100%"
                        : "0%",
                  }}
                />

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          SYSTEM STATUS
      ===================================================== */}

      <div
        className="
          bg-white
          border
          border-gray-400
          rounded-xl
          p-6
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
            mb-5
          "
        >

          <div>

            <h3
              className="
                text-sm
                font-semibold
                uppercase
                tracking-wide
                text-gray-700
              "
            >
              System Status
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-gray-500
              "
            >
              Current CampusConnect
              administration overview
            </p>

          </div>


          <div
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-green-700
            "
          >

            <span
              className="
                w-2.5
                h-2.5
                rounded-full
                bg-green-500
              "
            />

            System operational

          </div>

        </div>


        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              p-4
              rounded-lg
              bg-gray-50
              border
              border-gray-200
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <UserCheck
                size={18}
                className="
                  text-blue-600
                "
              />

              <span
                className="
                  text-sm
                  text-gray-700
                "
              >
                Students
              </span>

            </div>

            <ArrowUpRight
              size={16}
              className="
                text-gray-400
              "
            />

          </div>


          <div
            className="
              flex
              items-center
              justify-between
              p-4
              rounded-lg
              bg-gray-50
              border
              border-gray-200
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <CalendarDays
                size={18}
                className="
                  text-purple-600
                "
              />

              <span
                className="
                  text-sm
                  text-gray-700
                "
              >
                Events
              </span>

            </div>

            <ArrowUpRight
              size={16}
              className="
                text-gray-400
              "
            />

          </div>


          <div
            className="
              flex
              items-center
              justify-between
              p-4
              rounded-lg
              bg-gray-50
              border
              border-gray-200
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <Building2
                size={18}
                className="
                  text-orange-600
                "
              />

              <span
                className="
                  text-sm
                  text-gray-700
                "
              >
                Clubs
              </span>

            </div>

            <ArrowUpRight
              size={16}
              className="
                text-gray-400
              "
            />

          </div>


          <div
            className="
              flex
              items-center
              justify-between
              p-4
              rounded-lg
              bg-gray-50
              border
              border-gray-200
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <ClipboardList
                size={18}
                className="
                  text-teal-600
                "
              />

              <span
                className="
                  text-sm
                  text-gray-700
                "
              >
                Registrations
              </span>

            </div>

            <ArrowUpRight
              size={16}
              className="
                text-gray-400
              "
            />

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;