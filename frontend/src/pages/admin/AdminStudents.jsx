import { useEffect, useState } from "react";
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Mail,
  GraduationCap,
} from "lucide-react";
import Swal from "sweetalert2";
import { apiFetch } from "../../api/api";
function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [updatingId, setUpdatingId] = useState(null);


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
      });

      setStudents([]);

    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    loadStudents();

  }, []);

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
      confirmButtonColor:
        newStatus
          ? "#16a34a"
          : "#dc2626",

      cancelButtonColor: "#6b7280",
      confirmButtonText:
        newStatus
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

      });

    } finally {

      setUpdatingId(null);

    }
  };

  const filteredStudents = students.filter(
    (student) => {

      const searchValue =
        search.trim().toLowerCase();

      if (!searchValue) {

        return true;

      }


      return (

        student.fullName
          ?.toLowerCase()
          .includes(searchValue)

        ||

        student.email
          ?.toLowerCase()
          .includes(searchValue)

        ||

        student.usn
          ?.toLowerCase()
          .includes(searchValue)

        ||

        student.department
          ?.toLowerCase()
          .includes(searchValue)

      );

    }
  );
  return (

    <div className="max-w-7xl mx-auto">
      <div className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-4
        mb-8
      ">
        <div>
          <h1 className="
            text-3xl
            font-bold
            text-gray-900
          ">
            Students
          </h1>
          <p className="
            text-gray-500
            mt-1
          ">
            Manage registered students and their access.
          </p>
        </div>
        <div className="
          inline-flex
          items-center
          gap-3
          bg-white
          border
          border-gray-200
          rounded-lg
          px-4
          py-3
          shadow-sm
        ">
          <div className="
            p-2
            bg-blue-50
            rounded-lg
          ">
            <Users
              size={20}
              className="text-blue-600"
            />
          </div>
          <div>
            <p className="
              text-xs
              text-gray-500
            ">
              Total Students
            </p>
            <p className="
              text-lg
              font-semibold
              text-gray-900
            ">
              {students.length}
            </p>
          </div>
        </div>
      </div>
      <div className="
        bg-white
        border
        border-gray-200
        rounded-xl
        shadow-sm
        overflow-hidden
      ">
        <div className="
          px-6
          py-5
          border-b
          border-gray-200
        ">
          <div className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-4
          ">
            <div>

              <h2 className="
                text-lg
                font-semibold
                text-gray-900
              ">
                Registered Students
              </h2>
              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                {filteredStudents.length} student
                {filteredStudents.length !== 1
                  ? "s"
                  : ""}

                {search
                  ? " found"
                  : ""}
              </p>
            </div>
            <div className="relative">

              <Search
                size={18}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />


              <input

                type="text"

                value={search}

                onChange={(e) =>
                  setSearch(e.target.value)
                }

                placeholder="Search students..."

                className="
                  w-full
                  sm:w-80
                  pl-10
                  pr-4
                  py-2.5
                  border
                  border-gray-300
                  rounded-lg
                  bg-white
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                  outline-none
                  transition
                "
              />

            </div>

          </div>

        </div>


        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (

          <div className="
            p-12
            text-center
          ">

            <div className="
              inline-flex
              items-center
              gap-2
              text-gray-500
            ">

              <div className="
                w-5
                h-5
                border-2
                border-gray-300
                border-t-blue-600
                rounded-full
                animate-spin
              " />

              Loading students...

            </div>

          </div>


        ) : filteredStudents.length === 0 ? (


          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="
            p-12
            text-center
          ">

            <Users
              size={48}
              className="
                mx-auto
                text-gray-300
                mb-4
              "
            />


            <h3 className="
              font-medium
              text-gray-700
            ">

              No students found

            </h3>


            <p className="
              text-sm
              text-gray-500
              mt-1
            ">

              {search

                ? "Try changing your search."

                : "There are no registered students yet."}

            </p>

          </div>


        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">


              <thead className="
                bg-gray-50
                border-b
              ">

                <tr>


                  <th className="
                    text-left
                    px-6
                    py-4
                    text-sm
                    font-semibold
                    text-gray-600
                  ">
                    Student
                  </th>


                  <th className="
                    text-left
                    px-6
                    py-4
                    text-sm
                    font-semibold
                    text-gray-600
                  ">
                    USN
                  </th>


                  <th className="
                    text-left
                    px-6
                    py-4
                    text-sm
                    font-semibold
                    text-gray-600
                  ">
                    Department
                  </th>


                  <th className="
                    text-left
                    px-6
                    py-4
                    text-sm
                    font-semibold
                    text-gray-600
                  ">
                    Year
                  </th>


                  <th className="
                    text-left
                    px-6
                    py-4
                    text-sm
                    font-semibold
                    text-gray-600
                  ">
                    Status
                  </th>


                  <th className="
                    text-right
                    px-6
                    py-4
                    text-sm
                    font-semibold
                    text-gray-600
                  ">
                    Action
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
                        last:border-b-0
                        hover:bg-gray-50
                        transition
                      "
                    >


                      {/* =================================================
                          STUDENT
                      ================================================= */}

                      <td className="px-6 py-4">

                        <div className="
                          flex
                          items-center
                          gap-3
                        ">


                          {/* Avatar */}

                          <div className="
                            w-10
                            h-10
                            rounded-full
                            bg-blue-50
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            font-semibold
                            shrink-0
                          ">

                            {student.fullName
                              ?.charAt(0)
                              ?.toUpperCase() || "S"}

                          </div>


                          <div className="min-w-0">

                            <p className="
                              font-medium
                              text-gray-900
                              truncate
                            ">

                              {student.fullName}

                            </p>


                            <div className="
                              flex
                              items-center
                              gap-1.5
                              mt-1
                              text-sm
                              text-gray-500
                            ">

                              <Mail size={13} />

                              <span className="truncate">

                                {student.email}

                              </span>

                            </div>

                          </div>

                        </div>

                      </td>


                      {/* =================================================
                          USN
                      ================================================= */}

                      <td className="
                        px-6
                        py-4
                        text-sm
                        font-medium
                        text-gray-700
                        whitespace-nowrap
                      ">

                        {student.usn || "—"}

                      </td>


                      {/* =================================================
                          DEPARTMENT
                      ================================================= */}

                      <td className="
                        px-6
                        py-4
                        text-sm
                        text-gray-600
                      ">

                        {student.department || "—"}

                      </td>


                      {/* =================================================
                          YEAR
                      ================================================= */}

                      <td className="px-6 py-4">

                        <div className="
                          inline-flex
                          items-center
                          gap-2
                          text-sm
                          text-gray-600
                        ">

                          <GraduationCap
                            size={16}
                            className="text-gray-400"
                          />

                          {student.year
                            ? `Year ${student.year}`
                            : "—"}

                        </div>

                      </td>


                      {/* =================================================
                          STATUS
                      ================================================= */}

                      <td className="px-6 py-4">

                        <span className={`
                          inline-flex
                          items-center
                          gap-1.5
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-medium

                          ${
                            student.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}>

                          {student.active ? (

                            <UserCheck size={14} />

                          ) : (

                            <UserX size={14} />

                          )}


                          {student.active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>


                      {/* =================================================
                          ACTION
                      ================================================= */}

                      <td className="
                        px-6
                        py-4
                        text-right
                      ">

                        <button
                          type="button"
                          disabled={
                            updatingId === student.id
                          }
                          onClick={() =>
                            changeStatus(student)
                          }

                          className={`
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-4
                            py-2
                            rounded-lg
                            text-sm
                            font-medium
                            transition
                            disabled:opacity-50
                            disabled:cursor-not-allowed

                            ${
                              student.active

                                ? "bg-red-50 text-red-700 hover:bg-red-100"

                                : "bg-green-50 text-green-700 hover:bg-green-100"
                            }
                          `}
                        >
                          {updatingId ===
                          student.id ? (
                            <>
                              <div className="
                                w-4
                                h-4
                                border-2
                                border-current
                                border-t-transparent
                                rounded-full
                                animate-spin
                              " />
                              Updating...
                            </>
                          ) : (
                            <>
                              {student.active ? (
                                <UserX size={16} />
                              ) : (
                                <UserCheck size={16} />
                              )}
                              {student.active
                                ? "Deactivate"
                                : "Activate"}
                            </>
                          )}
                        </button>
                      </td>
                    </tr>

                  )
                )}

              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminStudents;