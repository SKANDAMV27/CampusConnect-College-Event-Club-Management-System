import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpenCheck,
  Search,
  Plus,
  Pencil,
  Send,
  RotateCcw,
  Trash2,
  X,
  RefreshCw,
} from "lucide-react";
import Swal from "sweetalert2";
import { apiFetch } from "../../api/api";

const emptyForm = {
  studentId: "",
  semester: "1",
  academicYear: "2026-2027",
  examType: "SEMESTER",
  subjectCode: "",
  subjectName: "",
  internalMarks: "",
  internalMaxMarks: "30",
  externalMarks: "",
  externalMaxMarks: "70",
  remarks: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function AdminMarks() {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (query) params.set("search", query);
      if (semesterFilter) params.set("semester", semesterFilter);
      if (statusFilter) params.set("status", statusFilter);

      const [marksData, studentsData] = await Promise.all([
        apiFetch(`/admin/marks?${params.toString()}`),
        apiFetch(
          `/admin/marks/students${
            query ? `?search=${encodeURIComponent(query)}` : ""
          }`
        ),
      ]);

      setMarks(Array.isArray(marksData) ? marksData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to load marks",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [query, semesterFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  const stats = useMemo(
    () => ({
      total: marks.length,
      published: marks.filter(
        (m) => m.publicationStatus === "PUBLISHED"
      ).length,
      drafts: marks.filter(
        (m) => m.publicationStatus === "DRAFT"
      ).length,
    }),
    [marks]
  );

  const setField = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      studentId: students[0] ? String(students[0].id) : "",
    });
    setModalOpen(true);
  };

  const openEdit = (mark) => {
    if (mark.publicationStatus === "PUBLISHED") return;

    setEditingId(mark.id);

    setForm({
      studentId: String(mark.studentId),
      semester: String(mark.semester),
      academicYear: mark.academicYear,
      examType: mark.examType,
      subjectCode: mark.subjectCode,
      subjectName: mark.subjectName,
      internalMarks: String(mark.internalMarks),
      internalMaxMarks: String(mark.internalMaxMarks),
      externalMarks: String(mark.externalMarks),
      externalMaxMarks: String(mark.externalMaxMarks),
      remarks: mark.remarks || "",
    });

    setModalOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      studentId: Number(form.studentId),
      internalMarks: Number(form.internalMarks),
      internalMaxMarks: Number(form.internalMaxMarks),
      externalMarks: Number(form.externalMarks),
      externalMaxMarks: Number(form.externalMaxMarks),
    };

    if (!payload.studentId) {
      return Swal.fire({
        icon: "warning",
        title: "Select a student",
      });
    }

    if (
      payload.internalMarks < 0 ||
      payload.externalMarks < 0 ||
      payload.internalMaxMarks <= 0 ||
      payload.externalMaxMarks <= 0 ||
      payload.internalMarks > payload.internalMaxMarks ||
      payload.externalMarks > payload.externalMaxMarks
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid marks",
        text: "Obtained marks must be between zero and the maximum marks.",
      });
    }

    setSaving(true);

    try {
      await apiFetch(
        editingId
          ? `/admin/marks/${editingId}`
          : "/admin/marks",
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );

      setModalOpen(false);

      await Swal.fire({
        icon: "success",
        title: editingId ? "Marks updated" : "Marks saved",
        text: "The record is saved as a draft until published.",
        timer: 1500,
        showConfirmButton: false,
      });

      await load();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Could not save marks",
        text: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const publicationAction = async (mark) => {
    const publishing = mark.publicationStatus !== "PUBLISHED";

    const confirmation = await Swal.fire({
      icon: "question",
      title: publishing ? "Publish result?" : "Withdraw result?",
      text: publishing
        ? `This will make ${mark.subjectName} visible to ${mark.studentName}.`
        : "The student will no longer see this result.",
      showCancelButton: true,
      confirmButtonText: publishing ? "Publish result" : "Withdraw result",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await apiFetch(
        `/admin/marks/${mark.id}/${
          publishing ? "publish" : "unpublish"
        }`,
        { method: "POST" }
      );

      await load();

      Swal.fire({
        icon: "success",
        title: publishing ? "Result published" : "Result withdrawn",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Action failed",
        text: error.message,
      });
    }
  };

  const remove = async (mark) => {
    if (mark.publicationStatus !== "DRAFT") return;

    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Delete draft marks?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await apiFetch(`/admin/marks/${mark.id}`, {
        method: "DELETE",
      });

      await load();

      Swal.fire({
        icon: "success",
        title: "Draft deleted",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: error.message,
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Academics
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Marks Management
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage student marks, examination records and published results.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus size={18} />
          Add marks
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Records in view",
            value: stats.total,
            icon: BookOpenCheck,
          },
          {
            label: "Published results",
            value: stats.published,
            icon: Send,
          },
          {
            label: "Draft results",
            value: stats.drafts,
            icon: Pencil,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{label}</p>
              <span className="rounded-xl bg-blue-50 p-2 text-blue-600">
                <Icon size={19} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Marks table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />
            <input
              className={`${inputClass} pl-10`}
              placeholder="Search name, USN or email"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <select
            className={`${inputClass} md:max-w-48`}
            value={semesterFilter}
            onChange={(event) => setSemesterFilter(event.target.value)}
          >
            <option value="">All semesters</option>
            {Array.from({ length: 8 }, (_, index) => (
              <option key={index + 1} value={String(index + 1)}>
                Semester {index + 1}
              </option>
            ))}
          </select>

          <select
            className={`${inputClass} md:max-w-48`}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>

          <button
            type="button"
            onClick={load}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {[
                  "Student",
                  "Subject",
                  "Semester / Exam",
                  "Internal",
                  "External",
                  "Total",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} className="px-5 py-4 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                    Loading marks...
                  </td>
                </tr>
              ) : marks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center">
                    <BookOpenCheck
                      className="mx-auto text-slate-300"
                      size={32}
                    />
                    <p className="mt-3 font-semibold text-slate-700">
                      No marks found
                    </p>
                    <p className="mt-1 text-slate-500">
                      Add a record or change your filters.
                    </p>
                  </td>
                </tr>
              ) : (
                marks.map((mark) => (
                  <tr key={mark.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {mark.studentName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {mark.usn} · {mark.department}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">
                        {mark.subjectName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {mark.subjectCode}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p>Semester {mark.semester}</p>
                      <p className="text-xs text-slate-500">
                        {mark.examType} · {mark.academicYear}
                      </p>
                    </td>

                    <td className="px-5 py-4 tabular-nums">
                      {mark.internalMarks}/{mark.internalMaxMarks}
                    </td>

                    <td className="px-5 py-4 tabular-nums">
                      {mark.externalMarks}/{mark.externalMaxMarks}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">
                        {mark.totalMarks}/{mark.totalMaxMarks}
                      </p>
                      <p className="text-xs text-slate-500">
                        {mark.percentage}% · {mark.grade}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          mark.publicationStatus === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {mark.publicationStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title="Edit draft"
                          disabled={mark.publicationStatus === "PUBLISHED"}
                          onClick={() => openEdit(mark)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          title={
                            mark.publicationStatus === "PUBLISHED"
                              ? "Withdraw result"
                              : "Publish result"
                          }
                          onClick={() => publicationAction(mark)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          {mark.publicationStatus === "PUBLISHED" ? (
                            <RotateCcw size={16} />
                          ) : (
                            <Send size={16} />
                          )}
                        </button>

                        {mark.publicationStatus === "DRAFT" && (
                          <button
                            type="button"
                            title="Delete draft"
                            onClick={() => remove(mark)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          Showing {marks.length} record(s). Only published results are visible
          to students.
        </div>
      </section>

      {/* Add/edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <div className="my-auto w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingId ? "Edit marks" : "Add student marks"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Save the marks as a draft before publishing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                  Student
                  <select
                    required
                    disabled={!!editingId}
                    className={`${inputClass} mt-1.5`}
                    value={form.studentId}
                    onChange={(event) =>
                      setField("studentId", event.target.value)
                    }
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} · {student.usn} · {student.department}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Semester
                  <select
                    className={`${inputClass} mt-1.5`}
                    value={form.semester}
                    onChange={(event) =>
                      setField("semester", event.target.value)
                    }
                  >
                    {Array.from({ length: 8 }, (_, index) => (
                      <option key={index + 1} value={String(index + 1)}>
                        Semester {index + 1}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Academic year
                  <input
                    required
                    className={`${inputClass} mt-1.5`}
                    placeholder="2026-2027"
                    value={form.academicYear}
                    onChange={(event) =>
                      setField("academicYear", event.target.value)
                    }
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Exam type
                  <select
                    className={`${inputClass} mt-1.5`}
                    value={form.examType}
                    onChange={(event) =>
                      setField("examType", event.target.value)
                    }
                  >
                    <option value="INTERNAL_1">Internal 1</option>
                    <option value="INTERNAL_2">Internal 2</option>
                    <option value="PRACTICAL">Practical</option>
                    <option value="SEMESTER">Semester examination</option>
                    <option value="SUPPLEMENTARY">Supplementary</option>
                  </select>
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Subject code
                  <input
                    required
                    maxLength={30}
                    className={`${inputClass} mt-1.5`}
                    placeholder="CS301"
                    value={form.subjectCode}
                    onChange={(event) =>
                      setField("subjectCode", event.target.value)
                    }
                  />
                </label>

                <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                  Subject name
                  <input
                    required
                    maxLength={120}
                    className={`${inputClass} mt-1.5`}
                    placeholder="Database Management Systems"
                    value={form.subjectName}
                    onChange={(event) =>
                      setField("subjectName", event.target.value)
                    }
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Internal marks obtained
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    className={`${inputClass} mt-1.5`}
                    value={form.internalMarks}
                    onChange={(event) =>
                      setField("internalMarks", event.target.value)
                    }
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Maximum internal marks
                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    className={`${inputClass} mt-1.5`}
                    value={form.internalMaxMarks}
                    onChange={(event) =>
                      setField("internalMaxMarks", event.target.value)
                    }
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  External marks obtained
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    className={`${inputClass} mt-1.5`}
                    value={form.externalMarks}
                    onChange={(event) =>
                      setField("externalMarks", event.target.value)
                    }
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Maximum external marks
                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    className={`${inputClass} mt-1.5`}
                    value={form.externalMaxMarks}
                    onChange={(event) =>
                      setField("externalMaxMarks", event.target.value)
                    }
                  />
                </label>

                <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                  Remarks (optional)
                  <textarea
                    rows={2}
                    maxLength={500}
                    className={`${inputClass} mt-1.5`}
                    placeholder="Additional academic note"
                    value={form.remarks}
                    onChange={(event) =>
                      setField("remarks", event.target.value)
                    }
                  />
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Save as draft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMarks;