import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import Swal from "sweetalert2";

function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const data = await apiFetch("/admin/registrations");
      setRegistrations(data);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Event Registrations
        </h1>

        <p className="text-gray-500 mt-1">
          View student event registrations
        </p>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 text-gray-500">
            Loading registrations...
          </div>
        ) : registrations.length === 0 ? (
          <div className="p-6 text-gray-500">
            No registrations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">
                    Student
                  </th>

                  <th className="p-4 text-left">
                    USN
                  </th>

                  <th className="p-4 text-left">
                    Event
                  </th>

                  <th className="p-4 text-left">
                    Registered At
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {registrations.map((registration) => (
                  <tr
                    key={registration.id}
                    className="border-t"
                  >
                    <td className="p-4">
                      {registration.student?.fullName || "-"}
                    </td>

                    <td className="p-4">
                      {registration.student?.usn || "-"}
                    </td>

                    <td className="p-4">
                      {registration.event?.title || "-"}
                    </td>

                    <td className="p-4">
                      {registration.registeredAt
                        ? new Date(
                            registration.registeredAt
                          ).toLocaleString()
                        : "-"}
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                        {registration.status || "CONFIRMED"}
                      </span>
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

export default AdminRegistrations;