import { useEffect, useState } from "react";
import {
  Users,
  CalendarDays,
  Building2,
  ClipboardList,
} from "lucide-react";
import { apiFetch } from "../../api/api";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await apiFetch("/admin/dashboard");
      setDashboard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        Loading dashboard...
      </div>
    );
  }

  const cards = [
    {
      title: "Total Students",
      value: dashboard?.totalStudents ?? 0,
      icon: Users,
    },
    {
      title: "Total Events",
      value: dashboard?.totalEvents ?? 0,
      icon: CalendarDays,
    },
    {
      title: "Total Clubs",
      value: dashboard?.totalClubs ?? 0,
      icon: Building2,
    },
    {
      title: "Registrations",
      value: dashboard?.totalRegistrations ?? 0,
      icon: ClipboardList,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Overview of CampusConnect
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold text-gray-800 mt-2">
                    {card.value}
                  </h2>
                </div>

                <div className="p-3 rounded-lg bg-blue-100">
                  <Icon className="text-blue-600" size={28} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminDashboard;