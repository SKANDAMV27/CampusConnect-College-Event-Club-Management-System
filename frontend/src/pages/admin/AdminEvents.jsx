import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  MapPin,
  Clock3,
  Users,
  Image,
  FileText,
} from "lucide-react";
import Swal from "sweetalert2";
import { apiFetch } from "../../api/api";
import { getAdminEvents } from "../../api/adminApi";

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
  const [saving, setSaving] = useState(false);

  // Server-side search & pagination
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadEvents = async () => {
    try {
      setLoading(true);

      const data = await getAdminEvents({
        page,
        size,
        search,
        status,
      });

      setEvents(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);

    } catch (error) {
      console.error("Failed to load events:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to load events",
        text: error.message || "Something went wrong.",
      });

      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [page, size, search, status]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (event) => {
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

  const closeForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.endTime &&
      form.startTime &&
      form.endTime <= form.startTime
    ) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Time",
        text: "End time must be later than start time.",
      });
      return;
    }

    if (
      form.registrationDeadline &&
      form.eventDate &&
      form.registrationDeadline > form.eventDate
    ) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Deadline",
        text: "Registration deadline cannot be after the event date.",
      });
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        eventDate: form.eventDate,
        startTime: form.startTime,
        endTime: form.endTime || null,
        venue: form.venue.trim(),
        maxParticipants: form.maxParticipants
          ? Number(form.maxParticipants)
          : null,
        registrationDeadline:
          form.registrationDeadline || null,
        imageUrl: form.imageUrl.trim() || null,
        status: form.status,
      };

      if (editingId) {
        await apiFetch(`/admin/events/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/admin/events", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      await Swal.fire({
        icon: "success",
        title: editingId
          ? "Event Updated Successfully"
          : "Event Created Successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      closeForm();
      await loadEvents();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to save event",
        text: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (id) => {
    const result = await Swal.fire({
      title: "Delete Event?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/admin/events/${id}`, {
        method: "DELETE",
      });

      await Swal.fire({
        icon: "success",
        title: "Event Deleted",
        showConfirmButton: false,
        timer: 1200,
      });

      loadEvents();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to delete event",
        text: error.message,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Events
          </h1>

          <p className="text-gray-500 mt-1">
            Create and manage college events.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-lg transition"
          >
            <Plus size={19} />
            Create Event
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8">
          {/* Form Header */}
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? "Edit Event" : "Create New Event"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Fill in the details below to{" "}
                {editingId ? "update the event." : "create an event."}
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={21} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-8">
              {/* Event Information */}
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <FileText size={19} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">
                    Event Information
                  </h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Enter event title"
                      maxLength={100}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe the event, activities, and important information..."
                      rows={5}
                      maxLength={1000}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                    />

                    <p className="text-xs text-gray-400 mt-1 text-right">
                      {form.description.length}/1000
                    </p>
                  </div>
                </div>
              </section>

              {/* Schedule */}
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <CalendarDays size={19} className="text-blue-600" />

                  <h3 className="font-semibold text-gray-900">
                    Schedule
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="date"
                      name="eventDate"
                      value={form.eventDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Deadline
                    </label>

                    <input
                      type="date"
                      name="registrationDeadline"
                      value={form.registrationDeadline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="time"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>

                    <input
                      type="time"
                      name="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Location & Capacity */}
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <MapPin size={19} className="text-blue-600" />

                  <h3 className="font-semibold text-gray-900">
                    Location & Capacity
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Venue <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="venue"
                      value={form.venue}
                      onChange={handleChange}
                      placeholder="e.g. Main Auditorium"
                      maxLength={150}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Participants
                    </label>

                    <div className="relative">
                      <Users
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="number"
                        name="maxParticipants"
                        value={form.maxParticipants}
                        onChange={handleChange}
                        placeholder="e.g. 500"
                        min="1"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Publishing */}
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Clock3 size={19} className="text-blue-600" />

                  <h3 className="font-semibold text-gray-900">
                    Publishing
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Status{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Image URL
                    </label>

                    <div className="relative">
                      <Image
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="url"
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/event-image.jpg"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="px-6 py-3 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Event"
                  : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events Table */}
      {!showForm && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Events
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {events.length} event{events.length !== 1 ? "s" : ""}
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center">
              <CalendarDays
                size={45}
                className="mx-auto text-gray-300 mb-3"
              />

              <h3 className="font-medium text-gray-700">
                No events found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Create your first event to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Event
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Date
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Venue
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {event.title}
                        </p>

                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {event.description}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.eventDate}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.venue}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            event.status === "PUBLISHED"
                              ? "bg-green-100 text-green-700"
                              : event.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : event.status === "COMPLETED"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(event)}
                            className="p-2 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                            title="Edit"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteEvent(event.id)
                            }
                            className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                            title="Delete"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminEvents;