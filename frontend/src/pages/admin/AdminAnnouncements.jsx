import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { apiFetch } from "../../api/api";

const emptyForm = {
  title: "",
  message: "",
  published: true,
};

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await apiFetch("/admin/announcements");
      setAnnouncements(data);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await apiFetch(
          `/admin/announcements/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(form),
          }
        );
      } else {
        await apiFetch("/admin/announcements", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      Swal.fire({
        icon: "success",
        title: editingId
          ? "Announcement Updated"
          : "Announcement Created",
        showConfirmButton: false,
        timer: 1200,
      });

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      loadAnnouncements();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const deleteAnnouncement = async (id) => {
    const result = await Swal.fire({
      title: "Delete Announcement?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/admin/announcements/${id}`, {
        method: "DELETE",
      });

      loadAnnouncements();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const editAnnouncement = (announcement) => {
    setEditingId(announcement.id);

    setForm({
      title: announcement.title,
      message: announcement.message,
      published: announcement.published,
    });

    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Announcements
          </h1>

          <p className="text-gray-500">
            Manage campus announcements
          </p>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg"
        >
          <Plus size={20} />
          Add Announcement
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-xl p-6 mb-8"
        >
          <input
            name="title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            placeholder="Announcement Title"
            required
            className="input mb-4"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={(e) =>
              setForm({
                ...form,
                message: e.target.value,
              })
            }
            placeholder="Announcement Message"
            required
            rows="5"
            className="input mb-4"
          />

          <label className="flex items-center gap-3 mb-5">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm({
                  ...form,
                  published: e.target.checked,
                })
              }
            />
            Publish immediately
          </label>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {editingId ? "Update" : "Create"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white border rounded-xl p-6"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {announcement.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  {announcement.message}
                </p>

                <span className="inline-block mt-3 text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  {announcement.published
                    ? "Published"
                    : "Draft"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    editAnnouncement(announcement)
                  }
                  className="p-2 bg-yellow-100 rounded"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() =>
                    deleteAnnouncement(announcement.id)
                  }
                  className="p-2 bg-red-100 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminAnnouncements;