import { useEffect, useMemo, useState } from "react";

import {
  Users,
  Search,
  UserCheck,
  UserX,
  Mail,
  GraduationCap,
  Eye,
  X,
  Loader2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

import Swal from "sweetalert2";

import { apiFetch } from "../../api/api";

function AdminStudents() {
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  // View drawer
  const [viewStudent, setViewStudent] = useState(null);

  /* =========================================================
     LOAD STUDENTS
  ========================================================= */

  const loadStudents = async () => {
    try {
      setLoading(true);

      const data = await apiFetch("/admin/students");

      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Failed to load students:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Unable to load students",
        text:
          error.message ||
          "Something went wrong.",
        confirmButtonColor: "#0f766e",
      });

      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  /* =========================================================
     CHANGE STUDENT STATUS
  ========================================================= */

  const changeStatus = async (student) => {
    const newStatus = !student.active;

    const actionText = newStatus
      ? "activate"
      : "deactivate";

    const result = await Swal.fire({
      title: newStatus
        ? "Activate Student?"
        : "Deactivate Student?",

      text: newStatus
        ? `${student.fullName} will be able to access the student system.`
        : `${student.fullName} will no longer be able to access the student system.`,

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: newStatus
        ? "#16a34a"
        : "#dc2626",

      cancelButtonColor: "#6b7280",

      confirmButtonText: newStatus
        ? "Yes, Activate"
        : "Yes, Deactivate",

      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setUpdatingId(student.id);

      await apiFetch(
        `/admin/students/${student.id}/status?active=${newStatus}`,
        {
          method: "PUT",
        }
      );

      await Swal.fire({
        icon: "success",

        title: newStatus
          ? "Student Activated"
          : "Student Deactivated",

        text: `${student.fullName} has been ${actionText}d successfully.`,

        showConfirmButton: false,

        timer: 1500,
      });

      await loadStudents();

      // Update drawer if it is currently open
      if (
        viewStudent &&
        viewStudent.id === student.id
      ) {
        setViewStudent({
          ...student,
          active: newStatus,
        });
      }
    } catch (error) {
      console.error(
        "Failed to change student status:",
        error
      );

      Swal.fire({
        icon: "error",

        title: "Unable to update status",

        text:
          error.message ||
          "Something went wrong.",

        confirmButtonColor: "#0f766e",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredStudents = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return students;
    }

    return students.filter((student) => {
      return (
        student.fullName
          ?.toLowerCase()
          .includes(searchValue) ||

        student.email
          ?.toLowerCase()
          .includes(searchValue) ||

        student.usn
          ?.toLowerCase()
          .includes(searchValue) ||

        student.department
          ?.toLowerCase()
          .includes(searchValue)
      );
    });
  }, [students, search]);

  /* =========================================================
     FORMAT YEAR
  ========================================================= */

  const formatYear = (year) => {
    if (!year) {
      return "—";
    }

    return `Year ${year}`;
  };

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="max-w-7xl mx-auto">

      {/* =====================================================
          HEADER
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
            Students
          </h1>
        </div>

        {/* Total students */}

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
            <Users size={18} />
          </div>

          <div>
            <p
              className="
                text-xs
                text-gray-500
              "
            >
              Total Students
            </p>

            <p
              className="
                text-sm
                font-semibold
                text-gray-900
              "
            >
              {students.length}
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
              setSearch(event.target.value)
            }
            placeholder="Search students"
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

        {/* LOADING */}

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

              Loading students...
            </div>
          </div>

        ) : filteredStudents.length === 0 ? (

          /* EMPTY STATE */

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
              <Users size={26} />
            </div>

            <h3
              className="
                text-base
                font-semibold
                text-gray-900
              "
            >
              No students found
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
                : "There are no registered students yet."}
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

                        <span className="text-gray-400">
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

                        <span className="text-gray-400">
                          ↕
                        </span>
                      </div>
                    </th>


                    {/* DEPARTMENT */}

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
                        Department

                        <span className="text-gray-400">
                          ↕
                        </span>
                      </div>
                    </th>


                    {/* YEAR */}

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
                        Year

                        <span className="text-gray-400">
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

                        <span className="text-gray-400">
                          ↕
                        </span>
                      </div>
                    </th>


                    {/* ACTIONS */}

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
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredStudents.map(
                    (student) => (

                      <tr
                        key={student.id}
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
                              min-w-[240px]
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
                              {student.fullName
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "S"}
                            </div>


                            {/* Name + Email */}

                            <div className="min-w-0">

                              <p
                                className="
                                  text-sm
                                  font-semibold
                                  text-gray-900
                                  truncate
                                "
                              >
                                {student.fullName ||
                                  "—"}
                              </p>

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-1.5
                                  mt-1
                                  text-xs
                                  text-gray-500
                                "
                              >
                                <Mail size={13} />

                                <span
                                  className="
                                    truncate
                                  "
                                >
                                  {student.email ||
                                    "—"}
                                </span>
                              </div>

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
                          {student.usn || "—"}
                        </td>


                        {/* =================================================
                            DEPARTMENT
                        ================================================= */}

                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-gray-700
                            whitespace-nowrap
                          "
                        >
                          {student.department || "—"}
                        </td>


                        {/* =================================================
                            YEAR
                        ================================================= */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >

                          <div
                            className="
                              inline-flex
                              items-center
                              gap-2
                              text-sm
                              text-gray-700
                              whitespace-nowrap
                            "
                          >
                            <GraduationCap
                              size={16}
                              className="text-gray-400"
                            />

                            {formatYear(
                              student.year
                            )}
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

                          {student.active ? (

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-green-100
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-green-700
                              "
                            >
                              <UserCheck size={13} />

                              Active
                            </span>

                          ) : (

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-red-100
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-red-700
                              "
                            >
                              <UserX size={13} />

                              Inactive
                            </span>

                          )}

                        </td>


                        {/* =================================================
                            ACTIONS
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
                              gap-2
                            "
                          >

                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() =>
                                setViewStudent(
                                  student
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
                              title="View student"
                            >
                              <Eye size={17} />
                            </button>


                            {/* ACTIVATE / DEACTIVATE */}

                            <button
                              type="button"
                              disabled={
                                updatingId ===
                                student.id
                              }
                              onClick={() =>
                                changeStatus(
                                  student
                                )
                              }
                              className={`
                                h-9
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-3
                                rounded-md
                                text-xs
                                font-medium
                                transition
                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                ${
                                  student.active
                                    ? "border border-red-500 bg-red-600 text-white hover:bg-red-700"
                                    : "border border-green-500 bg-green-600 text-white hover:bg-green-700"
                                }
                              `}
                              title={
                                student.active
                                  ? "Deactivate student"
                                  : "Activate student"
                              }
                            >

                              {updatingId ===
                              student.id ? (

                                <Loader2
                                  size={15}
                                  className="
                                    animate-spin
                                  "
                                />

                              ) : student.active ? (

                                <UserX size={15} />

                              ) : (

                                <UserCheck size={15} />

                              )}

                              {student.active
                                ? "Deactivate"
                                : "Activate"}

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
                1-{filteredStudents.length} of{" "}
                {filteredStudents.length}
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
                    <ChevronsLeft size={16} />
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
                    <ChevronLeft size={16} />
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
                    <ChevronRight size={16} />
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
                    <ChevronsRight size={16} />
                  </button>

                </div>

              </div>

            </div>

          </>

        )}

      </div>


      {/* =====================================================
          VIEW STUDENT - RIGHT SIDE DRAWER
      ===================================================== */}

      {viewStudent && (

        <div
          className="
            fixed
            inset-0
            z-[100]
          "
        >

          {/* OVERLAY */}

          <div
            className="
              absolute
              inset-0
              bg-black/50
              backdrop-blur-[2px]
            "
            onClick={() =>
              setViewStudent(null)
            }
          />


          {/* DRAWER */}

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
                {viewStudent.fullName ||
                  "Student Details"}
              </h2>

              <button
                type="button"
                onClick={() =>
                  setViewStudent(null)
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

                {/* STUDENT */}

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
                    {viewStudent.fullName
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "S"}
                  </div>

                  <div>
                    <h3
                      className="
                        text-lg
                        font-semibold
                        text-gray-900
                      "
                    >
                      {viewStudent.fullName ||
                        "—"}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-gray-500
                      "
                    >
                      {viewStudent.email ||
                        "—"}
                    </p>
                  </div>

                </div>


                {/* FULL NAME */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-[150px_1fr]
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
                    Full Name
                  </p>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-gray-900
                    "
                  >
                    {viewStudent.fullName ||
                      "—"}
                  </p>

                </div>


                {/* EMAIL */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-[150px_1fr]
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
                    {viewStudent.email ||
                      "—"}
                  </p>

                </div>


                {/* USN */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-[150px_1fr]
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
                    {viewStudent.usn ||
                      "—"}
                  </p>

                </div>


                {/* YEAR */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-[150px_1fr]
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

                  <p
                    className="
                      text-sm
                      text-gray-900
                    "
                  >
                    {formatYear(
                      viewStudent.year
                    )}
                  </p>

                </div>


                {/* DEPARTMENT */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-[150px_1fr]
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
                    {viewStudent.department ||
                      "—"}
                  </p>

                </div>


                {/* STATUS */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-[150px_1fr]
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

                    {viewStudent.active ? (

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          bg-green-100
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-green-700
                        "
                      >
                        <UserCheck size={13} />

                        Active
                      </span>

                    ) : (

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          bg-red-100
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-red-700
                        "
                      >
                        <UserX size={13} />

                        Inactive
                      </span>

                    )}

                  </div>

                </div>


                {/* ROLE */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-[150px_1fr]
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
                    Role
                  </p>

                  <p
                    className="
                      text-sm
                      text-gray-900
                    "
                  >
                    {viewStudent.role ||
                      "STUDENT"}
                  </p>

                </div>


                {/* ID */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-[150px_1fr]
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
                    Student ID
                  </p>

                  <p
                    className="
                      text-sm
                      text-gray-900
                    "
                  >
                    {viewStudent.id ||
                      "—"}
                  </p>

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
                flex-col-reverse
                sm:flex-row
                sm:justify-end
                gap-3
              "
            >

              <button
                type="button"
                onClick={() =>
                  setViewStudent(null)
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


              <button
                type="button"
                disabled={
                  updatingId ===
                  viewStudent.id
                }
                onClick={() =>
                  changeStatus(viewStudent)
                }
                className={`
                  px-5
                  py-2.5
                  rounded-md
                  text-sm
                  font-medium
                  text-white
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  transition
                  disabled:opacity-50

                  ${
                    viewStudent.active
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }
                `}
              >

                {updatingId ===
                viewStudent.id ? (

                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                ) : viewStudent.active ? (

                  <UserX size={16} />

                ) : (

                  <UserCheck size={16} />

                )}

                {viewStudent.active
                  ? "Deactivate"
                  : "Activate"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminStudents;