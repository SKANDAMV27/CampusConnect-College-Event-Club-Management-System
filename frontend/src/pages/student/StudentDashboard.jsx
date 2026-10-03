import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  ClipboardList,
  UserRound,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  Activity,
  UserCheck,
  CalendarCheck,
  BookOpen,
  Loader2,
} from "lucide-react";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { getStudentDashboard } from "../../api/studentApi";

function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     LOAD DASHBOARD
  ========================================================= */

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response =
          await getStudentDashboard();

        setData(response);
      } catch (error) {
        console.error(error);

        Swal.fire({
          icon: "error",
          title: "Unable to load dashboard",
          text:
            error.message ||
            "Something went wrong while loading your dashboard.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* =========================================================
     DASHBOARD VALUES
  ========================================================= */

  const studentName =
    data?.studentName || "Student";

  const totalEvents =
    data?.totalEvents ?? 0;

  const myRegistrations =
    data?.myRegistrations ?? 0;

  /*
   * Visual participation percentage.
   * This is calculated from the existing dashboard values.
   */

  const participationRate = useMemo(() => {
    if (totalEvents === 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (myRegistrations / totalEvents) * 100
      )
    );
  }, [
    totalEvents,
    myRegistrations,
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
            text-slate-500
          "
        >
          <Loader2
            size={20}
            className="
              animate-spin
              text-indigo-600
            "
          />

          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px]">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div
        className="
          mb-7
          flex
          flex-col
          gap-2
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >

        <div>

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
                font-semibold
                text-slate-900
                sm:text-3xl
              "
            >
              Welcome, {studentName}
            </h1>

          </div>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
              sm:text-base
            "
          >
            Manage your campus activities,
            events, and registrations.
          </p>

        </div>


        {/* STATUS */}

        <div
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-full
            border
            border-green-200
            bg-green-50
            px-3
            py-2
            text-xs
            font-medium
            text-green-700
          "
        >

          <span
            className="
              h-2
              w-2
              rounded-full
              bg-green-500
            "
          />

          Student Portal Active

        </div>

      </div>


      {/* =====================================================
          SECTION HEADER
      ===================================================== */}

      <div
        className="
          mb-5
          flex
          flex-col
          gap-2
          border-b
          border-slate-300
          pb-4
          sm:flex-row
          sm:items-center
        "
      >

        <h2
          className="
            text-xl
            font-semibold
            text-slate-900
          "
        >
          Student Overview
        </h2>

        <span
          className="
            hidden
            text-slate-400
            sm:block
          "
        >
          •
        </span>

        <p
          className="
            text-sm
            text-slate-500
          "
        >
          Events · Registrations ·
          Profile
        </p>

      </div>


      {/* =====================================================
          TOP SECTION
      ===================================================== */}

      <div
        className="
          mb-5
          grid
          grid-cols-1
          gap-5
          xl:grid-cols-[360px_1fr]
        "
      >

        {/* ===================================================
            STUDENT PROFILE CARD
        =================================================== */}

        <div
          className="
            rounded-xl
            border
            border-slate-400
            bg-white
            p-6
          "
        >

          <h3
            className="
              text-sm
              font-semibold
              uppercase
              tracking-wide
              text-slate-700
            "
          >
            Student Profile
          </h3>


          {/* PROFILE */}

          <div
            className="
              flex
              flex-col
              items-center
              py-7
              text-center
            "
          >

            <div
              className="
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                bg-indigo-50
                text-indigo-600
              "
            >
              <GraduationCap
                size={42}
              />
            </div>


            <h3
              className="
                mt-4
                text-xl
                font-semibold
                text-slate-900
              "
            >
              {studentName}
            </h3>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              CampusConnect Student
            </p>

          </div>


          {/* PROFILE STATUS */}

          <div
            className="
              space-y-4
            "
          >

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
                  text-slate-600
                "
              >

                <UserCheck
                  size={16}
                  className="
                    text-slate-400
                  "
                />

                Account

              </div>

              <span
                className="
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
                justify-between
                text-sm
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-slate-600
                "
              >

                <Activity
                  size={16}
                  className="
                    text-slate-400
                  "
                />

                Participation

              </div>

              <span
                className="
                  font-semibold
                  text-indigo-600
                "
              >
                {participationRate}%
              </span>

            </div>

          </div>


          {/* VIEW PROFILE */}

          <Link
            to="/profile"
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-slate-300
              px-4
              py-2.5
              text-sm
              font-medium
              text-slate-700
              transition
              hover:border-indigo-500
              hover:text-indigo-600
            "
          >

            View Profile

            <ArrowRight size={16} />

          </Link>

        </div>


        {/* ===================================================
            CAMPUS ACTIVITY
        =================================================== */}

        <div
          className="
            rounded-xl
            border
            border-slate-400
            bg-white
            p-6
          "
        >

          <div
            className="
              mb-5
              flex
              items-center
              justify-between
            "
          >

            <h3
              className="
                text-sm
                font-semibold
                uppercase
                tracking-wide
                text-slate-700
              "
            >
              Campus Activity
            </h3>

            <Activity
              size={20}
              className="
                text-slate-400
              "
            />

          </div>


          <div
            className="
              grid
              grid-cols-1
              gap-4
              md:grid-cols-2
              xl:grid-cols-3
            "
          >

            {/* =================================================
                EVENTS
            ================================================= */}

            <div
              className="
                flex
                min-h-[210px]
                flex-col
                justify-between
                rounded-xl
                border
                border-blue-200
                bg-blue-50
                p-5
              "
            >

              <div>

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    text-blue-600
                  "
                >
                  <CalendarDays
                    size={21}
                  />
                </div>


                <p
                  className="
                    mt-5
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-blue-700
                  "
                >
                  Available Events
                </p>


                <p
                  className="
                    mt-2
                    text-4xl
                    font-bold
                    text-slate-900
                  "
                >
                  {totalEvents}
                </p>

              </div>


              <Link
                to="/events"
                className="
                  flex
                  items-center
                  justify-between
                  gap-2
                  text-sm
                  font-medium
                  text-blue-700
                  hover:text-blue-800
                "
              >

                Browse Events

                <ArrowRight
                  size={16}
                />

              </Link>

            </div>


            {/* =================================================
                REGISTRATIONS
            ================================================= */}

            <div
              className="
                flex
                min-h-[210px]
                flex-col
                justify-between
                rounded-xl
                border
                border-green-200
                bg-green-50
                p-5
              "
            >

              <div>

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    text-green-600
                  "
                >
                  <ClipboardList
                    size={21}
                  />
                </div>


                <p
                  className="
                    mt-5
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-green-700
                  "
                >
                  My Registrations
                </p>


                <p
                  className="
                    mt-2
                    text-4xl
                    font-bold
                    text-slate-900
                  "
                >
                  {myRegistrations}
                </p>

              </div>


              <Link
                to="/my-registrations"
                className="
                  flex
                  items-center
                  justify-between
                  gap-2
                  text-sm
                  font-medium
                  text-green-700
                  hover:text-green-800
                "
              >

                View Registrations

                <ArrowRight
                  size={16}
                />

              </Link>

            </div>


            {/* =================================================
                PROFILE
            ================================================= */}

            <div
              className="
                flex
                min-h-[210px]
                flex-col
                justify-between
                rounded-xl
                border
                border-purple-200
                bg-purple-50
                p-5
              "
            >

              <div>

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    text-purple-600
                  "
                >
                  <UserRound
                    size={21}
                  />
                </div>


                <p
                  className="
                    mt-5
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-purple-700
                  "
                >
                  My Profile
                </p>


                <p
                  className="
                    mt-2
                    text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  Account Details
                </p>

              </div>


              <Link
                to="/profile"
                className="
                  flex
                  items-center
                  justify-between
                  gap-2
                  text-sm
                  font-medium
                  text-purple-700
                  hover:text-purple-800
                "
              >

                View Profile

                <ArrowRight
                  size={16}
                />

              </Link>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          SECOND ROW
      ===================================================== */}

      <div
        className="
          mb-5
          grid
          grid-cols-1
          gap-5
          lg:grid-cols-2
        "
      >

        {/* ===================================================
            REGISTRATION ACTIVITY
        =================================================== */}

        <div
          className="
            rounded-xl
            border
            border-slate-400
            bg-white
            p-6
          "
        >

          <div
            className="
              mb-6
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h3
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-700
                "
              >
                Registration Activity
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                Your current event
                participation
              </p>

            </div>

            <CalendarCheck
              size={20}
              className="
                text-slate-400
              "
            />

          </div>


          {/* RATE */}

          <div>

            <div
              className="
                mb-2
                flex
                items-center
                justify-between
              "
            >

              <span
                className="
                  text-sm
                  text-slate-700
                "
              >
                Event participation
              </span>

              <span
                className="
                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                {participationRate}%
              </span>

            </div>


            <div
              className="
                h-3
                overflow-hidden
                rounded-full
                bg-slate-200
              "
            >

              <div
                className="
                  h-full
                  rounded-full
                  bg-indigo-600
                  transition-all
                  duration-500
                "
                style={{
                  width: `${participationRate}%`,
                }}
              />

            </div>

          </div>


          {/* SUMMARY */}

          <div
            className="
              mt-7
              grid
              grid-cols-2
              gap-4
            "
          >

            <div
              className="
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                p-4
              "
            >

              <p
                className="
                  text-xs
                  text-slate-500
                "
              >
                Available
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-bold
                  text-slate-900
                "
              >
                {totalEvents}
              </p>

            </div>


            <div
              className="
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                p-4
              "
            >

              <p
                className="
                  text-xs
                  text-slate-500
                "
              >
                Registered
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-bold
                  text-slate-900
                "
              >
                {myRegistrations}
              </p>

            </div>

          </div>

        </div>


        {/* ===================================================
            QUICK ACTIONS
        =================================================== */}

        <div
          className="
            rounded-xl
            border
            border-slate-400
            bg-white
            p-6
          "
        >

          <div
            className="
              mb-6
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h3
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-700
                "
              >
                Quick Actions
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                Access frequently used
                student features
              </p>

            </div>

            <BookOpen
              size={20}
              className="
                text-slate-400
              "
            />

          </div>


          <div
            className="
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-3
            "
          >

            {/* EVENTS */}

            <Link
              to="/events"
              className="
                group
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                p-4
                transition
                hover:border-blue-300
                hover:bg-blue-50
              "
            >

              <CalendarDays
                size={20}
                className="
                  text-blue-600
                "
              />

              <p
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                Explore Events
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                Find campus events
              </p>

              <ArrowRight
                size={15}
                className="
                  mt-3
                  text-slate-400
                  transition
                  group-hover:translate-x-1
                "
              />

            </Link>


            {/* REGISTRATIONS */}

            <Link
              to="/my-registrations"
              className="
                group
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                p-4
                transition
                hover:border-green-300
                hover:bg-green-50
              "
            >

              <ClipboardList
                size={20}
                className="
                  text-green-600
                "
              />

              <p
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                My Registrations
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                Manage your events
              </p>

              <ArrowRight
                size={15}
                className="
                  mt-3
                  text-slate-400
                  transition
                  group-hover:translate-x-1
                "
              />

            </Link>


            {/* PROFILE */}

            <Link
              to="/profile"
              className="
                group
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                p-4
                transition
                hover:border-purple-300
                hover:bg-purple-50
              "
            >

              <UserRound
                size={20}
                className="
                  text-purple-600
                "
              />

              <p
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                My Profile
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                Update account details
              </p>

              <ArrowRight
                size={15}
                className="
                  mt-3
                  text-slate-400
                  transition
                  group-hover:translate-x-1
                "
              />

            </Link>

          </div>

        </div>

      </div>


      {/* =====================================================
          ACCOUNT STATUS
      ===================================================== */}

      <div
        className="
          rounded-xl
          border
          border-slate-400
          bg-white
          p-6
        "
      >

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
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
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                bg-green-50
                text-green-600
              "
            >
              <CheckCircle2
                size={20}
              />
            </div>


            <div>

              <h3
                className="
                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                Account Status
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                Your CampusConnect
                student account is active.
              </p>

            </div>

          </div>


          <Link
            to="/profile"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-slate-300
              px-4
              py-2.5
              text-sm
              font-medium
              text-slate-700
              transition
              hover:border-indigo-500
              hover:text-indigo-600
            "
          >

            Manage Profile

            <ArrowRight
              size={16}
            />

          </Link>

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;