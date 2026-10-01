import { useEffect, useMemo, useState } from "react";

import {
  Search,
  Eye,
  X,
  Loader2,
  CalendarDays,
  Clock3,
  UserRound,
  GraduationCap,
  ClipboardCheck,
  CheckCircle2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

import Swal from "sweetalert2";

import { apiFetch } from "../../api/api";

function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // View drawer
  const [viewRegistration, setViewRegistration] =
    useState(null);

  /* =========================================================
     LOAD REGISTRATIONS
  ========================================================= */

  const loadRegistrations = async () => {
    try {
      setLoading(true);

      const data = await apiFetch(
        "/admin/registrations"
      );

      setRegistrations(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load registrations:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Unable to load registrations",
        text:
          error.message ||
          "Something went wrong.",
        confirmButtonColor: "#0f766e",
      });

      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredRegistrations = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return registrations;
    }

    return registrations.filter(
      (registration) => {
        const studentName =
          registration.student?.fullName ||
          "";

        const studentEmail =
          registration.student?.email ||
          "";

        const usn =
          registration.student?.usn ||
          "";

        const eventTitle =
          registration.event?.title ||
          "";

        const status =
          registration.status ||
          "";

        return (
          studentName
            .toLowerCase()
            .includes(searchValue) ||

          studentEmail
            .toLowerCase()
            .includes(searchValue) ||

          usn
            .toLowerCase()
            .includes(searchValue) ||

          eventTitle
            .toLowerCase()
            .includes(searchValue) ||

          status
            .toLowerCase()
            .includes(searchValue)
        );
      }
    );
  }, [registrations, search]);

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime = (value) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =========================================================
     FORMAT DATE + TIME
  ========================================================= */

  const formatDateTime = (value) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =========================================================
     STATUS CLASS
  ========================================================= */

  const getStatusClass = (status) => {
    const normalizedStatus =
      (status || "CONFIRMED")
        .toUpperCase();

    if (
      normalizedStatus ===
      "CONFIRMED"
    ) {
      return `
        bg-green-100
        text-green-700
      `;
    }

    if (
      normalizedStatus ===
      "CANCELLED"
    ) {
      return `
        bg-red-100
        text-red-700
      `;
    }

    if (
      normalizedStatus ===
      "PENDING"
    ) {
      return `
        bg-yellow-100
        text-yellow-700
      `;
    }

    return `
      bg-gray-100
      text-gray-700
    `;
  };

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="max-w-7xl mx-auto">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
          mb-6
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-semibold
              text-gray-900
            "
          >
            Event Registrations
          </h1>

        </div>


        {/* TOTAL REGISTRATIONS */}

        <div
          className="
            inline-flex
            items-center
            gap-3
            border
            border-gray-300
            bg-white
            rounded-md
            px-4
            py-2.5
          "
        >

          <div
            className="
              flex
              items-center
              justify-center
              w-8
              h-8
              rounded-md
              bg-teal-50
              text-teal-700
            "
          >
            <ClipboardCheck
              size={18}
            />
          </div>


          <div>

            <p
              className="
                text-xs
                text-gray-500
              "
            >
              Total Registrations
            </p>

            <p
              className="
                text-sm
                font-semibold
                text-gray-900
              "
            >
              {registrations.length}
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="mb-4">

        <div
          className="
            relative
            w-full
            sm:w-[430px]
          "
        >

          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-500
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search registrations"
            className="
              w-full
              h-11
              pl-10
              pr-4
              border
              border-gray-400
              rounded-md
              bg-white
              text-sm
              text-gray-800
              placeholder:text-gray-500
              outline-none
              focus:border-teal-600
              focus:ring-1
              focus:ring-teal-600
            "
          />

        </div>

      </div>


      {/* =====================================================
          TABLE
      ===================================================== */}

      <div
        className="
          bg-white
          border
          border-gray-400
          rounded-lg
          overflow-hidden
        "
      >

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (

          <div
            className="
              min-h-[300px]
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

              Loading registrations...

            </div>

          </div>

        ) : filteredRegistrations.length ===
          0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div
            className="
              min-h-[300px]
              flex
              flex-col
              items-center
              justify-center
              px-6
              text-center
            "
          >

            <div
              className="
                w-14
                h-14
                rounded-full
                bg-gray-100
                flex
                items-center
                justify-center
                text-gray-400
                mb-4
              "
            >

              <ClipboardCheck
                size={26}
              />

            </div>


            <h3
              className="
                text-base
                font-semibold
                text-gray-900
              "
            >
              No registrations found
            </h3>


            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              {search
                ? "Try changing your search."
                : "There are no event registrations yet."}
            </p>

          </div>

        ) : (

          <>

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-x-auto">

              <table
                className="
                  w-full
                  border-collapse
                "
              >

                <thead>

                  <tr
                    className="
                      bg-white
                      border-b
                      border-gray-400
                    "
                  >

                    {/* STUDENT */}

                    <th
                      className="
                        px-5
                        py-3.5
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-600
                        whitespace-nowrap
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-1
                        "
                      >

                        Student

                        <span
                          className="
                            text-gray-400
                          "
                        >
                          ↕
                        </span>

                      </div>

                    </th>


                    {/* USN */}

                    <th
                      className="
                        px-5
                        py-3.5
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-600
                        whitespace-nowrap
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-1
                        "
                      >

                        USN

                        <span
                          className="
                            text-gray-400
                          "
                        >
                          ↕
                        </span>

                      </div>

                    </th>


                    {/* EVENT */}

                    <th
                      className="
                        px-5
                        py-3.5
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-600
                        whitespace-nowrap
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-1
                        "
                      >

                        Event

                        <span
                          className="
                            text-gray-400
                          "
                        >
                          ↕
                        </span>

                      </div>

                    </th>


                    {/* REGISTERED AT */}

                    <th
                      className="
                        px-5
                        py-3.5
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-600
                        whitespace-nowrap
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-1
                        "
                      >

                        Registered At

                        <span
                          className="
                            text-gray-400
                          "
                        >
                          ↕
                        </span>

                      </div>

                    </th>


                    {/* STATUS */}

                    <th
                      className="
                        px-5
                        py-3.5
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-600
                        whitespace-nowrap
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-1
                        "
                      >

                        Status

                        <span
                          className="
                            text-gray-400
                          "
                        >
                          ↕
                        </span>

                      </div>

                    </th>


                    {/* ACTION */}

                    <th
                      className="
                        px-5
                        py-3.5
                        text-right
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-600
                        whitespace-nowrap
                      "
                    >
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredRegistrations.map(
                    (registration) => (

                      <tr
                        key={
                          registration.id
                        }
                        className="
                          border-b
                          border-gray-300
                          last:border-b-0
                          hover:bg-gray-50
                          transition
                        "
                      >

                        {/* =================================================
                            STUDENT
                        ================================================= */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                              min-w-[220px]
                            "
                          >

                            {/* Avatar */}

                            <div
                              className="
                                w-10
                                h-10
                                rounded-full
                                bg-teal-50
                                text-teal-700
                                flex
                                items-center
                                justify-center
                                font-semibold
                                shrink-0
                              "
                            >

                              {registration.student?.fullName
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "S"}

                            </div>


                            {/* Name + Email */}

                            <div
                              className="
                                min-w-0
                              "
                            >

                              <p
                                className="
                                  text-sm
                                  font-semibold
                                  text-gray-900
                                  truncate
                                "
                              >
                                {registration.student
                                  ?.fullName ||
                                  "—"}
                              </p>


                              {registration.student
                                ?.email && (

                                <p
                                  className="
                                    text-xs
                                    text-gray-500
                                    mt-1
                                    truncate
                                  "
                                >
                                  {
                                    registration
                                      .student
                                      .email
                                  }
                                </p>

                              )}

                            </div>

                          </div>

                        </td>


                        {/* =================================================
                            USN
                        ================================================= */}

                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            font-medium
                            text-gray-800
                            whitespace-nowrap
                          "
                        >
                          {registration.student
                            ?.usn || "—"}
                        </td>


                        {/* =================================================
                            EVENT
                        ================================================= */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              min-w-[220px]
                            "
                          >

                            <CalendarDays
                              size={16}
                              className="
                                text-gray-400
                                shrink-0
                              "
                            />

                            <span
                              className="
                                text-sm
                                font-medium
                                text-gray-900
                                truncate
                              "
                            >
                              {registration.event
                                ?.title ||
                                "—"}
                            </span>

                          </div>

                        </td>


                        {/* =================================================
                            REGISTERED AT
                        ================================================= */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >

                          <div
                            className="
                              flex
                              flex-col
                              gap-1
                              text-sm
                              text-gray-700
                              whitespace-nowrap
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <CalendarDays
                                size={14}
                                className="
                                  text-gray-400
                                "
                              />

                              {formatDate(
                                registration.registeredAt
                              )}

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

                              <Clock3
                                size={13}
                                className="
                                  text-gray-400
                                "
                              />

                              {formatTime(
                                registration.registeredAt
                              )}

                            </div>

                          </div>

                        </td>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              font-medium
                              ${getStatusClass(
                                registration.status
                              )}
                            `}
                          >

                            <CheckCircle2
                              size={13}
                            />

                            {registration.status ||
                              "CONFIRMED"}

                          </span>

                        </td>


                        {/* =================================================
                            ACTION
                        ================================================= */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              justify-end
                            "
                          >

                            <button
                              type="button"
                              onClick={() =>
                                setViewRegistration(
                                  registration
                                )
                              }
                              className="
                                w-9
                                h-9
                                inline-flex
                                items-center
                                justify-center
                                border
                                border-gray-400
                                rounded-md
                                bg-white
                                text-gray-600
                                hover:bg-gray-100
                                hover:text-gray-900
                                transition
                              "
                              title="View registration"
                            >

                              <Eye
                                size={17}
                              />

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>


            {/* =================================================
                PAGINATION FOOTER
            ================================================= */}

            <div
              className="
                px-5
                py-4
                border-t
                border-gray-300
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
              "
            >

              {/* COUNT */}

              <div
                className="
                  text-sm
                  text-gray-600
                "
              >

                1-{filteredRegistrations.length} of{" "}
                {filteredRegistrations.length}

              </div>


              {/* PAGINATION */}

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                {/* ROWS */}

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <span
                    className="
                      text-sm
                      text-gray-600
                      whitespace-nowrap
                    "
                  >
                    Rows per page
                  </span>

                  <select
                    value="10"
                    disabled
                    className="
                      h-9
                      px-2
                      border
                      border-gray-400
                      rounded-md
                      bg-white
                      text-sm
                      text-gray-700
                    "
                  >

                    <option value="10">
                      10
                    </option>

                  </select>

                </div>


                {/* BUTTONS */}

                <div
                  className="
                    flex
                    items-center
                    gap-1
                  "
                >

                  <button
                    type="button"
                    disabled
                    className="
                      w-9
                      h-9
                      flex
                      items-center
                      justify-center
                      border
                      border-gray-400
                      rounded-md
                      bg-white
                      text-gray-400
                    "
                  >
                    <ChevronsLeft
                      size={16}
                    />
                  </button>


                  <button
                    type="button"
                    disabled
                    className="
                      w-9
                      h-9
                      flex
                      items-center
                      justify-center
                      border
                      border-gray-400
                      rounded-md
                      bg-white
                      text-gray-400
                    "
                  >
                    <ChevronLeft
                      size={16}
                    />
                  </button>


                  <button
                    type="button"
                    className="
                      w-9
                      h-9
                      flex
                      items-center
                      justify-center
                      rounded-md
                      bg-teal-700
                      text-white
                      text-sm
                      font-semibold
                    "
                  >
                    1
                  </button>


                  <button
                    type="button"
                    disabled
                    className="
                      w-9
                      h-9
                      flex
                      items-center
                      justify-center
                      border
                      border-gray-400
                      rounded-md
                      bg-white
                      text-gray-400
                    "
                  >
                    <ChevronRight
                      size={16}
                    />
                  </button>


                  <button
                    type="button"
                    disabled
                    className="
                      w-9
                      h-9
                      flex
                      items-center
                      justify-center
                      border
                      border-gray-400
                      rounded-md
                      bg-white
                      text-gray-400
                    "
                  >
                    <ChevronsRight
                      size={16}
                    />
                  </button>

                </div>

              </div>

            </div>

          </>

        )}

      </div>


      {/* =====================================================
          VIEW REGISTRATION DRAWER
      ===================================================== */}

      {viewRegistration && (

        <div
          className="
            fixed
            inset-0
            z-[100]
          "
        >

          {/* =================================================
              OVERLAY
          ================================================= */}

          <div
            className="
              absolute
              inset-0
              bg-black/50
              backdrop-blur-[2px]
            "
            onClick={() =>
              setViewRegistration(null)
            }
          />


          {/* =================================================
              DRAWER
          ================================================= */}

          <div
            className="
              absolute
              top-0
              right-0
              h-full
              w-full
              sm:w-[520px]
              lg:w-[620px]
              bg-white
              shadow-2xl
              flex
              flex-col
            "
          >

            {/* =================================================
                DRAWER HEADER
            ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-5
                border-b
                border-gray-300
                shrink-0
              "
            >

              <h2
                className="
                  text-xl
                  font-semibold
                  text-gray-900
                  truncate
                  pr-4
                "
              >
                Registration Details
              </h2>


              <button
                type="button"
                onClick={() =>
                  setViewRegistration(
                    null
                  )
                }
                className="
                  w-10
                  h-10
                  rounded-full
                  border
                  border-gray-400
                  flex
                  items-center
                  justify-center
                  text-gray-600
                  hover:bg-gray-100
                  hover:text-gray-900
                  transition
                  shrink-0
                "
                title="Close"
              >

                <X size={20} />

              </button>

            </div>


            {/* =================================================
                DRAWER CONTENT
            ================================================= */}

            <div
              className="
                flex-1
                overflow-y-auto
                px-6
                py-6
              "
            >

              <div className="space-y-6">

                {/* =================================================
                    STUDENT SUMMARY
                ================================================= */}

                <div
                  className="
                    flex
                    items-center
                    gap-4
                    pb-5
                    border-b
                    border-gray-200
                  "
                >

                  <div
                    className="
                      w-14
                      h-14
                      rounded-full
                      bg-teal-50
                      text-teal-700
                      flex
                      items-center
                      justify-center
                      text-lg
                      font-semibold
                      shrink-0
                    "
                  >

                    {viewRegistration.student
                      ?.fullName
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "S"}

                  </div>


                  <div className="min-w-0">

                    <h3
                      className="
                        text-lg
                        font-semibold
                        text-gray-900
                        truncate
                      "
                    >
                      {viewRegistration.student
                        ?.fullName ||
                        "—"}
                    </h3>


                    <p
                      className="
                        mt-1
                        text-sm
                        text-gray-500
                        truncate
                      "
                    >
                      {viewRegistration.student
                        ?.email ||
                        "—"}
                    </p>

                  </div>

                </div>


                {/* =================================================
                    STUDENT
                ================================================= */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-[160px_1fr]
                    gap-1
                    sm:gap-6
                  "
                >

                  <p
                    className="
                      text-sm
                      font-medium
                      text-gray-600
                    "
                  >
                    Student
                  </p>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-gray-900
                    "
                  >
                    {viewRegistration.student
                      ?.fullName ||
                      "—"}
                  </p>

                </div>


                {/* =================================================
                    EMAIL
                ================================================= */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-[160px_1fr]
                    gap-1
                    sm:gap-6
                  "
                >

                  <p
                    className="
                      text-sm
                      font-medium
                      text-gray-600
                    "
                  >
                    Email
                  </p>

                  <p
                    className="
                      text-sm
                      text-gray-900
                      break-all
                    "
                  >
                    {viewRegistration.student
                      ?.email ||
                      "—"}
                  </p>

                </div>


                {/* =================================================
                    USN
                ================================================= */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-[160px_1fr]
                    gap-1
                    sm:gap-6
                  "
                >

                  <p
                    className="
                      text-sm
                      font-medium
                      text-gray-600
                    "
                  >
                    USN
                  </p>

                  <p
                    className="
                      text-sm
                      font-medium
                      text-gray-900
                    "
                  >
                    {viewRegistration.student
                      ?.usn ||
                      "—"}
                  </p>

                </div>


                {/* =================================================
                    YEAR
                ================================================= */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-[160px_1fr]
                    gap-1
                    sm:gap-6
                  "
                >

                  <p
                    className="
                      text-sm
                      font-medium
                      text-gray-600
                    "
                  >
                    Year
                  </p>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-gray-900
                    "
                  >

                    <GraduationCap
                      size={16}
                      className="
                        text-gray-400
                      "
                    />

                    {viewRegistration.student
                      ?.year
                      ? `Year ${viewRegistration.student.year}`
                      : "—"}

                  </div>

                </div>


                {/* =================================================
                    DEPARTMENT
                ================================================= */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-[160px_1fr]
                    gap-1
                    sm:gap-6
                  "
                >

                  <p
                    className="
                      text-sm
                      font-medium
                      text-gray-600
                    "
                  >
                    Department
                  </p>

                  <p
                    className="
                      text-sm
                      text-gray-900
                    "
                  >
                    {viewRegistration.student
                      ?.department ||
                      "—"}
                  </p>

                </div>


                {/* =================================================
                    EVENT
                ================================================= */}

                <div
                  className="
                    border-t
                    border-gray-200
                    pt-6
                  "
                >

                  <h3
                    className="
                      text-sm
                      font-semibold
                      text-gray-900
                      mb-5
                    "
                  >
                    Event Information
                  </h3>


                  <div className="space-y-5">

                    {/* EVENT NAME */}

                    <div
                      className="
                        grid
                        grid-cols-1
                        sm:grid-cols-[160px_1fr]
                        gap-1
                        sm:gap-6
                      "
                    >

                      <p
                        className="
                          text-sm
                          font-medium
                          text-gray-600
                        "
                      >
                        Event
                      </p>

                      <p
                        className="
                          text-sm
                          font-semibold
                          text-gray-900
                        "
                      >
                        {viewRegistration.event
                          ?.title ||
                          "—"}
                      </p>

                    </div>


                    {/* EVENT DATE */}

                    <div
                      className="
                        grid
                        grid-cols-1
                        sm:grid-cols-[160px_1fr]
                        gap-1
                        sm:gap-6
                      "
                    >

                      <p
                        className="
                          text-sm
                          font-medium
                          text-gray-600
                        "
                      >
                        Event Date
                      </p>

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-sm
                          text-gray-900
                        "
                      >

                        <CalendarDays
                          size={16}
                          className="
                            text-gray-400
                          "
                        />

                        {viewRegistration.event
                          ?.eventDate
                          ? formatDate(
                              viewRegistration.event
                                .eventDate
                            )
                          : "—"}

                      </div>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    REGISTRATION
                ================================================= */}

                <div
                  className="
                    border-t
                    border-gray-200
                    pt-6
                  "
                >

                  <h3
                    className="
                      text-sm
                      font-semibold
                      text-gray-900
                      mb-5
                    "
                  >
                    Registration Information
                  </h3>


                  <div className="space-y-5">

                    {/* REGISTRATION ID */}

                    <div
                      className="
                        grid
                        grid-cols-1
                        sm:grid-cols-[160px_1fr]
                        gap-1
                        sm:gap-6
                      "
                    >

                      <p
                        className="
                          text-sm
                          font-medium
                          text-gray-600
                        "
                      >
                        Registration ID
                      </p>

                      <p
                        className="
                          text-sm
                          text-gray-900
                        "
                      >
                        {viewRegistration.id ||
                          "—"}
                      </p>

                    </div>


                    {/* REGISTERED AT */}

                    <div
                      className="
                        grid
                        grid-cols-1
                        sm:grid-cols-[160px_1fr]
                        gap-1
                        sm:gap-6
                      "
                    >

                      <p
                        className="
                          text-sm
                          font-medium
                          text-gray-600
                        "
                      >
                        Registered At
                      </p>

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-sm
                          text-gray-900
                        "
                      >

                        <Clock3
                          size={16}
                          className="
                            text-gray-400
                          "
                        />

                        {formatDateTime(
                          viewRegistration.registeredAt
                        )}

                      </div>

                    </div>


                    {/* STATUS */}

                    <div
                      className="
                        grid
                        grid-cols-1
                        sm:grid-cols-[160px_1fr]
                        gap-1
                        sm:gap-6
                      "
                    >

                      <p
                        className="
                          text-sm
                          font-medium
                          text-gray-600
                        "
                      >
                        Status
                      </p>

                      <div>

                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            ${getStatusClass(
                              viewRegistration.status
                            )}
                          `}
                        >

                          <CheckCircle2
                            size={13}
                          />

                          {viewRegistration.status ||
                            "CONFIRMED"}

                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                DRAWER FOOTER
            ================================================= */}

            <div
              className="
                px-6
                py-4
                border-t
                border-gray-300
                bg-white
                shrink-0
                flex
                justify-end
              "
            >

              <button
                type="button"
                onClick={() =>
                  setViewRegistration(
                    null
                  )
                }
                className="
                  px-5
                  py-2.5
                  border
                  border-gray-400
                  rounded-md
                  bg-white
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-gray-100
                  transition
                "
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminRegistrations;