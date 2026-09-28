import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import { apiFetch } from "../../api/api";

const emptyForm = {
  name: "",
  description: "",
  facultyCoordinator: "",
  contactEmail: "",
  contactPhone: "",
  active: true,
};

function AdminClubs() {
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      const data = await apiFetch("/admin/clubs");
      setClubs(data);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await apiFetch(`/admin/clubs/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/admin/clubs", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      Swal.fire({
        icon: "success",
        title: editingId ? "Club Updated" : "Club Created",
        showConfirmButton: false,
        timer: 1200,
      });

      resetForm();
      loadClubs();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const editClub = (club) => {
    setEditingId(club.id);

    setForm({
      name: club.name || "",
      description: club.description || "",
      facultyCoordinator: club.facultyCoordinator || "",
      contactEmail: club.contactEmail || "",
      contactPhone: club.contactPhone || "",
      active: club.active ?? true,
    });

    setShowForm(true);
  };

  const deleteClub = async (id) => {
    const result = await Swal.fire({
      title: "Delete Club?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/admin/clubs/${id}`, {
        method: "DELETE",
      });

      loadClubs();
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
          <h1 className="text-3xl font-bold">
            Clubs
          </h1>

          <p className="text-gray-500">
            Manage college clubs
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg"
        >
          <Plus size={20} />
          Add Club
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-6 mb-8">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Club" : "Create Club"}
            </h2>

            <button onClick={resetForm}>
              <X />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-5"
          >
            <input
              name="name"
              placeholder="Club Name"
              value={form.name}
              onChange={handleChange}
              required
              className="input"
            />

            <input
              name="facultyCoordinator"
              placeholder="Faculty Coordinator"
              value={form.facultyCoordinator}
              onChange={handleChange}
              className="input"
            />

            <input
              type="email"
              name="contactEmail"
              placeholder="Contact Email"
              value={form.contactEmail}
              onChange={handleChange}
              className="input"
            />

            <input
              name="contactPhone"
              placeholder="Contact Phone"
              value={form.contactPhone}
              onChange={handleChange}
              className="input"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="input md:col-span-2"
              rows="4"
            />

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              Active
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                {editingId ? "Update Club" : "Create Club"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Coordinator</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {clubs.map((club) => (
              <tr key={club.id} className="border-t">
                <td className="p-4 font-medium">
                  {club.name}
                </td>

                <td className="p-4">
                  {club.facultyCoordinator}
                </td>

                <td className="p-4">
                  {club.contactEmail}
                </td>

                <td className="p-4">
                  {club.active ? "Active" : "Inactive"}
                </td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => editClub(club)}
                    className="p-2 bg-yellow-100 rounded"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => deleteClub(club.id)}
                    className="p-2 bg-red-100 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminClubs;