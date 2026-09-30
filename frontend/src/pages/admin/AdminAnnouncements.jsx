import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Megaphone,
  Search,
  FileText,
  CheckCircle2,
  Clock3,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import { apiFetch } from "../../api/api";

const emptyForm = {
  title: "",
  message: "",
  published: false,
};

const MAX_MESSAGE_LENGTH = 1000;

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  // ---------------------------------------------------------
  // Fetch announcements
  // ---------------------------------------------------------
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

      const data = await apiFetch("/admin/announcements");

      const announcementList = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];

      setAnnouncements(announcementList);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to load announcements",
        text: error.message || "Something went wrong.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // ---------------------------------------------------------
  // Search
  // ---------------------------------------------------------
  const filteredAnnouncements = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return announcements;
    }

    return announcements.filter((announcement) => {
      const title = announcement.title || "";
      const message = announcement.message || "";

      return (
        title.toLowerCase().includes(keyword) ||
        message.toLowerCase().includes(keyword)
      );
    });
  }, [announcements, search]);

  // ---------------------------------------------------------
  // Open create form
  // ---------------------------------------------------------
  const openCreateForm = () => {
    setEditingAnnouncement(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  // ---------------------------------------------------------
  // Open edit form
  // ---------------------------------------------------------
  const openEditForm = (announcement) => {
    setEditingAnnouncement(announcement);

    setForm({
      title: announcement.title || "",
      message: announcement.message || "",
      published: Boolean(announcement.published),
    });

    setShowForm(true);
  };

  // ---------------------------------------------------------
  // Close form
  // ---------------------------------------------------------
  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingAnnouncement(null);
    setForm(emptyForm);
  };

  // ---------------------------------------------------------
  // Form change
  // ---------------------------------------------------------
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ---------------------------------------------------------
  // Validation
  // ---------------------------------------------------------
  const validateForm = () => {
    const title = form.title.trim();
    const message = form.message.trim();

    if (!title) {
      Swal.fire({
        icon: "warning",
        title: "Title required",
        text: "Please enter an announcement title.",
        confirmButtonColor: "#2563eb",
      });

      return false;
    }

    if (title.length > 150) {
      Swal.fire({
        icon: "warning",
        title: "Title too long",
        text: "Announcement title cannot exceed 150 characters.",
        confirmButtonColor: "#2563eb",
      });

      return false;
    }

    if (!message) {
      Swal.fire({
        icon: "warning",
        title: "Message required",
        text: "Please enter the announcement message.",
        confirmButtonColor: "#2563eb",
      });

      return false;
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      Swal.fire({
        icon: "warning",
        title: "Message too long",
        text: `Announcement message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`,
        confirmButtonColor: "#2563eb",
      });

      return false;
    }

    return true;
  };

  // ---------------------------------------------------------
  // Save announcement
  // ---------------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      published: form.published,
    };

    try {
      setSaving(true);

      if (editingAnnouncement) {
        await apiFetch(
          `/admin/announcements/${editingAnnouncement.id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );

        await Swal.fire({
          icon: "success",
          title: "Announcement updated",
          text: "The announcement has been updated successfully.",
          confirmButtonColor: "#2563eb",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await apiFetch("/admin/announcements", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        await Swal.fire({
          icon: "success",
          title: "Announcement created",
          text: "The announcement has been created successfully.",
          confirmButtonColor: "#2563eb",
          timer: 1800,
          showConfirmButton: false,
        });
      }

      closeForm();
      await fetchAnnouncements();
    } catch (error) {
      console.error("Failed to save announcement:", error);

      Swal.fire({
        icon: "error",
        title: "Save failed",
        text: error.message || "Unable to save the announcement.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------
  // Delete announcement
  // ---------------------------------------------------------
  const handleDelete = async (announcement) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete announcement?",
      text: `"${announcement.title}" will be permanently deleted.`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeletingId(announcement.id);

      await apiFetch(`/admin/announcements/${announcement.id}`, {
        method: "DELETE",
      });

      setAnnouncements((previous) =>
        previous.filter((item) => item.id !== announcement.id)
      );

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "The announcement has been deleted successfully.",
        confirmButtonColor: "#2563eb",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to delete announcement:", error);

      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: error.message || "Unable to delete the announcement.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------------------------------------------------
  // Format date
  // ---------------------------------------------------------
  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ---------------------------------------------------------
  // Statistics
  // ---------------------------------------------------------
  const totalAnnouncements = announcements.length;

  const publishedAnnouncements = announcements.filter(
    (announcement) => announcement.published === true
  ).length;

  const draftAnnouncements = totalAnnouncements - publishedAnnouncements;

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ------------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------------ */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Megaphone size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  Announcements
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Create and manage college announcements.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus size={18} />
            Create Announcement
          </button>
        </div>

        {/* ------------------------------------------------ */}
        {/* Statistics */}
        {/* ------------------------------------------------ */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Announcements
                </p>

                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {totalAnnouncements}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FileText size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Published
                </p>

                <p className="mt-2 text-2xl font-semibold text-emerald-600">
                  {publishedAnnouncements}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Drafts
                </p>

                <p className="mt-2 text-2xl font-semibold text-amber-600">
                  {draftAnnouncements}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Clock3 size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* Search */}
        {/* ------------------------------------------------ */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search announcements..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* Table */}
        {/* ------------------------------------------------ */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  All Announcements
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredAnnouncements.length} announcement
                  {filteredAnnouncements.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Loader2 size={20} className="animate-spin text-blue-600" />
                Loading announcements...
              </div>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Megaphone size={26} />
              </div>

              <h3 className="text-base font-semibold text-slate-900">
                No announcements found
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                {search
                  ? "Try changing your search text."
                  : "Create your first announcement to get started."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Create Announcement
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Announcement
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Message
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filteredAnnouncements.map((announcement) => (
                    <tr
                      key={announcement.id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* Title */}
                      <td className="px-5 py-4 align-top">
                        <div className="flex min-w-[220px] items-start gap-3">
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Megaphone size={17} />
                          </div>

                          <div>
                            <p className="font-medium text-slate-900">
                              {announcement.title || "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Message */}
                      <td className="max-w-md px-5 py-4 align-top">
                        <p
                          className="line-clamp-2 text-sm text-slate-600"
                          title={announcement.message || ""}
                        >
                          {announcement.message || "-"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 align-top">
                        {announcement.published ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            <CheckCircle2 size={14} />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                            <Clock3 size={14} />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Created */}
                      <td className="whitespace-nowrap px-5 py-4 align-top text-sm text-slate-600">
                        {formatDate(announcement.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(announcement)}
                            disabled={deletingId === announcement.id}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Edit announcement"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(announcement)}
                            disabled={deletingId === announcement.id}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Delete announcement"
                          >
                            {deletingId === announcement.id ? (
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={16} />
                            )}
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
      </div>

      {/* ================================================== */}
      {/* CREATE / EDIT MODAL */}
      {/* ================================================== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Megaphone size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {editingAnnouncement
                        ? "Edit Announcement"
                        : "Create Announcement"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {editingAnnouncement
                        ? "Update the announcement details."
                        : "Enter the announcement details below."}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6 px-6 py-6">
                {/* Announcement Information */}
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />

                    <h3 className="text-sm font-semibold text-slate-900">
                      Announcement Information
                    </h3>
                  </div>

                  <div className="space-y-5">
                    {/* Title */}
                    <div>
                      <label
                        htmlFor="announcement-title"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Title <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="announcement-title"
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={150}
                        placeholder="Enter announcement title"
                        disabled={saving}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                      />

                      <div className="mt-1.5 flex justify-end">
                        <span className="text-xs text-slate-400">
                          {form.title.length}/150
                        </span>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="announcement-message"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Message <span className="text-red-500">*</span>
                      </label>

                      <textarea
                        id="announcement-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        maxLength={MAX_MESSAGE_LENGTH}
                        rows={7}
                        placeholder="Enter the announcement message..."
                        disabled={saving}
                        className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                      />

                      <div className="mt-1.5 flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                          Keep the message clear and easy to understand.
                        </p>

                        <span
                          className={`text-xs ${
                            form.message.length >= MAX_MESSAGE_LENGTH
                              ? "font-medium text-red-600"
                              : "text-slate-400"
                          }`}
                        >
                          {form.message.length}/{MAX_MESSAGE_LENGTH}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Publishing */}
                <div className="border-t border-slate-200 pt-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Megaphone size={18} className="text-blue-600" />

                    <h3 className="text-sm font-semibold text-slate-900">
                      Publishing
                    </h3>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        name="published"
                        checked={form.published}
                        onChange={handleChange}
                        disabled={saving}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />

                      <span>
                        <span className="block text-sm font-medium text-slate-800">
                          Publish announcement
                        </span>

                        <span className="mt-1 block text-xs text-slate-500">
                          Published announcements can be displayed to
                          students. Leave unchecked to save it as a draft.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingAnnouncement ? (
                        <Pencil size={17} />
                      ) : (
                        <Plus size={17} />
                      )}

                      {editingAnnouncement
                        ? "Update Announcement"
                        : "Create Announcement"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;