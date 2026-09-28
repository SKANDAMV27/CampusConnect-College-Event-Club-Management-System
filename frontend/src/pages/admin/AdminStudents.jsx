import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import Swal from "sweetalert2";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await apiFetch("/admin/students");
      setStudents(data);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (student) => {
    try {
      await apiFetch(
        `/admin/students/${student.id}/status?active=${!student.active}`,
        {
          method: "PUT",
        }
      );

      loadStudents();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Students
        </h1>

        <p className="text-gray-500">
          Manage registered students
        </p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <p className="p-6">Loading students...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">USN</th>
                  <th className="p-4 text-left">Department</th>
                  <th className="p-4 text-left">Year</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-t"
                  >
                    <td className="p-4">
                      {student.fullName}
                    </td>

                    <td className="p-4">
                      {student.email}
                    </td>

                    <td className="p-4">
                      {student.usn}
                    </td>

                    <td className="p-4">
                      {student.department}
                    </td>

                    <td className="p-4">
                      {student.year}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          student.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {student.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() =>
                          changeStatus(student)
                        }
                        className={`px-4 py-2 rounded-lg text-white ${
                          student.active
                            ? "bg-red-600"
                            : "bg-green-600"
                        }`}
                      >
                        {student.active
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminStudents;