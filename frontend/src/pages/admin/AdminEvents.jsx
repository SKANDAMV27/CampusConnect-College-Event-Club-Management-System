import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import { apiFetch } from "../../api/api";

const emptyForm = {
  title: "",
  description: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  venue: "",
  maxParticipants: "",
  registrationDeadline: "",
  imageUrl: "",
  status: "DRAFT",
};

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await apiFetch("/admin/events");
      setEvents(data);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        maxParticipants: form.maxParticipants
          ? Number(form.maxParticipants)
          : null,
      };

      if (editingId) {
        await apiFetch(`/admin/events/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        Swal.fire({
          icon: "success",
          title: "Event Updated",
          showConfirmButton: false,
          timer: 1200,
        });
      } else {
        await apiFetch("/admin/events", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        Swal.fire({
          icon: "success",
          title: "Event Created",
          showConfirmButton: false,
          timer: 1200,
        });
      }

      resetForm();
      loadEvents();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const editEvent = (event) => {
    setEditingId(event.id);

    setForm({
      title: event.title || "",
      description: event.description || "",
      eventDate: event.eventDate || "",
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      venue: event.venue || "",
      maxParticipants: event.maxParticipants || "",
      registrationDeadline: event.registrationDeadline || "",
      imageUrl: event.imageUrl || "",
      status: event.status || "DRAFT",
    });

    setShowForm(true);
  };

  const deleteEvent = async (id) => {
    const result = await Swal.fire({
      title: "Delete Event?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/admin/events/${id}`, {
        method: "DELETE",
      });

      Swal.fire({
        icon: "success",
        title: "Deleted",
        showConfirmButton: false,
        timer: 1000,
      });

      loadEvents();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Events
          </h1>

          <p className="text-gray-500">
            Manage college events
          </p>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Event
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Event" : "Create Event"}
            </h2>

            <button onClick={resetForm}>
              <X />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Event Title"
              required
              className="input"
            />

            <input
              name="venue"
              value={form.venue}
              onChange={handleChange}
              placeholder="Venue"
              required
              className="input"
            />

            <input
              type="date"
              name="eventDate"
              value={form.eventDate}
              onChange={handleChange}
              required
              className="input"
            />

            <input
              type="date"
              name="registrationDeadline"
              value={form.registrationDeadline}
              onChange={handleChange}
              className="input"
            />

            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
              className="input"
            />

            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="input"
            />

            <input
              type="number"
              name="maxParticipants"
              value={form.maxParticipants}
              onChange={handleChange}
              placeholder="Maximum Participants"
              className="input"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
              className="input md:col-span-2"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Event Description"
              required
              rows="4"
              className="input md:col-span-2"
            />

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                {editingId ? "Update Event" : "Create Event"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 px-6 py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <p className="p-6">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="p-6 text-gray-500">
            No events found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Venue</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="border-t"
                  >
                    <td className="p-4 font-medium">
                      {event.title}
                    </td>

                    <td className="p-4">
                      {event.eventDate}
                    </td>

                    <td className="p-4">
                      {event.venue}
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                        {event.status}
                      </span>
                    </td>

                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => editEvent(event)}
                        className="p-2 bg-yellow-100 text-yellow-700 rounded"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="p-2 bg-red-100 text-red-700 rounded"
                      >
                        <Trash2 size={18} />
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

export default AdminEvents;