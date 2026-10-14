
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Users,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarDays,
  GraduationCap,
  ClipboardList,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

import {
  createPlacementDrive,
  getAdminPlacementDrives,
  getPlacementStudents,
  getPlacementRegistrations,
  updatePlacementRegistration,
} from "../../api/placementApi";

const initialForm = {
  companyName: "",
  companyWebsite: "",
  hrName: "",
  hrEmail: "",
  jobTitle: "",
  jobDescription: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "INR",
  eligibilityDepartments: "",
  minimumCgpa: "",
  graduationYear: "",
  registrationDeadline: "",
  interviewAt: "",
  interviewRounds:
    "Aptitude, Technical Interview, HR Interview",
};

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50";

const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

const STATUS_OPTIONS = {
  REGISTERED: "Registered",
  SHORTLISTED: "Shortlisted",
  ROUND_1_PASSED: "Round 1 passed",
  ROUND_1_FAILED: "Round 1 failed",
  ROUND_2_PASSED: "Round 2 passed",
  ROUND_2_FAILED: "Round 2 failed",
  SELECTED: "Selected",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export default function AdminPlacements() {
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [form, setForm] = useState({ ...initialForm });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [studentPage, setStudentPage] = useState(1);

  const [activeSection, setActiveSection] = useState("drives");
  const [activeDrive, setActiveDrive] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] =
    useState(false);

  const studentsPerPage = 10;

  // --------------------------------------------------
  // Load students and placement drives
  // --------------------------------------------------

  async function load() {
    setLoading(true);

    try {
      const [studentData, driveData] = await Promise.all([
        getPlacementStudents(),
        getAdminPlacementDrives(),
      ]);

      setStudents(Array.isArray(studentData) ? studentData : []);
      setDrives(Array.isArray(driveData) ? driveData : []);
    } catch (error) {
      Swal.fire(
        "Unable to load",
        error.message || "Unable to load placement data.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // --------------------------------------------------
  // Load registrations for the selected drive
  // --------------------------------------------------

  async function loadRegistrations(driveId) {
    if (!driveId) {
      setRegistrations([]);
      return;
    }

    setRegistrationsLoading(true);

    try {
      const data = await getPlacementRegistrations(driveId);
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (error) {
      setRegistrations([]);

      Swal.fire(
        "Unable to load registrations",
        error.message || "Unable to load registrations.",
        "error"
      );
    } finally {
      setRegistrationsLoading(false);
    }
  }

  useEffect(() => {
    if (activeDrive) {
      loadRegistrations(activeDrive);
    } else {
      setRegistrations([]);
    }
  }, [activeDrive]);

  // --------------------------------------------------
  // Student search and pagination
  // --------------------------------------------------

  const visibleStudents = students.filter((student) =>
    [
      student.fullName,
      student.email,
      student.usn,
      student.department,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const totalStudentPages = Math.max(
    1,
    Math.ceil(visibleStudents.length / studentsPerPage)
  );

  const paginatedStudents = visibleStudents.slice(
    (studentPage - 1) * studentsPerPage,
    studentPage * studentsPerPage
  );

  function changeStudentSearch(value) {
    setSearch(value);
    setStudentPage(1);
  }

  function changeStudentPage(nextPage) {
    setStudentPage(
      Math.min(totalStudentPages, Math.max(1, nextPage))
    );
  }

  // --------------------------------------------------
  // Form handlers
  // --------------------------------------------------

  function changeForm(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function toggleStudent(id) {
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((studentId) => studentId !== id)
        : [...previous, id]
    );
  }

  function toggleSelectAll(checked) {
    setSelectAll(checked);

    if (checked) {
      setSelected([]);
    }
  }

  // --------------------------------------------------
  // Create placement drive
  // --------------------------------------------------

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectAll && selected.length === 0) {
      await Swal.fire(
        "Select students",
        "Choose at least one student or select all students.",
        "warning"
      );
      return;
    }

    if (
      form.salaryMin &&
      form.salaryMax &&
      Number(form.salaryMin) > Number(form.salaryMax)
    ) {
      await Swal.fire(
        "Invalid salary range",
        "Minimum package cannot exceed maximum package.",
        "warning"
      );
      return;
    }

    const payload = {
      ...form,
      salaryMin: form.salaryMin
        ? Number(form.salaryMin)
        : null,
      salaryMax: form.salaryMax
        ? Number(form.salaryMax)
        : null,
      minimumCgpa: form.minimumCgpa
        ? Number(form.minimumCgpa)
        : null,
      graduationYear: form.graduationYear
        ? Number(form.graduationYear)
        : null,
      registrationDeadline: form.registrationDeadline || null,
      interviewAt: form.interviewAt
        ? form.interviewAt.length === 16
          ? `${form.interviewAt}:00`
          : form.interviewAt
        : null,
      publish: true,
      selectAllStudents: selectAll,
      studentIds: selected,
    };

    setLoading(true);

    try {
      const result = await createPlacementDrive(payload);

      await Swal.fire({
        title: "Placement drive created",
        text:
          `Invited: ${result.invited ?? 0}. ` +
          `Emails sent: ${result.emailsSent ?? 0}. ` +
          `Emails failed: ${result.emailsFailed ?? 0}.`,
        icon:
          (result.emailsFailed ?? 0) > 0
            ? "warning"
            : "success",
      });

      setForm({ ...initialForm });
      setSelected([]);
      setSelectAll(false);
      setSearch("");
      setStudentPage(1);
      setActiveSection("drives");
      setActiveDrive("");

      await load();
    } catch (error) {
      Swal.fire(
        "Could not create drive",
        error.message || "Unable to create placement drive.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // Open registration section for a selected drive
  // --------------------------------------------------

  function openRegistrations(drive) {
    setActiveDrive(String(drive.id));
    setActiveSection("registrations");
  }

  function showPlacementDrives() {
    setActiveSection("drives");
  }

  function showRegistrations() {
    setActiveSection("registrations");
  }

  // --------------------------------------------------
  // Update registration status
  // --------------------------------------------------

  async function changeStatus(registration) {
    const { value: status } = await Swal.fire({
      title: "Update student status",
      input: "select",
      inputOptions: STATUS_OPTIONS,
      inputValue: registration.status,
      showCancelButton: true,
      confirmButtonText: "Update",
      inputPlaceholder: "Select status",
      inputValidator: (value) => {
        if (!value) {
          return "Please select a status.";
        }
      },
    });

    if (!status) return;

    try {
      await updatePlacementRegistration(
        activeDrive,
        registration.id,
        {
          status,
          adminNotes: registration.adminNotes || "",
        }
      );

      await loadRegistrations(activeDrive);
      await load();

      await Swal.fire(
        "Status updated",
        "Student registration status was updated.",
        "success"
      );
    } catch (error) {
      Swal.fire(
        "Update failed",
        error.message || "Unable to update registration.",
        "error"
      );
    }
  }

  // --------------------------------------------------
  // Selected drive information
  // --------------------------------------------------

  const selectedDrive = drives.find(
    (drive) => String(drive.id) === activeDrive
  );

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Campus Placements
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create company drives, invite students, and manage
            placement registrations.
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          disabled={loading}
          className={buttonSecondary}
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Placement drives"
          value={drives.length}
          Icon={BriefcaseBusiness}
        />

        <StatCard
          title="Students"
          value={students.length}
          Icon={GraduationCap}
        />

        <StatCard
          title="Registrations"
          value={drives.reduce(
            (sum, drive) =>
              sum + Number(drive.registeredCount || 0),
            0
          )}
          Icon={Users}
        />
      </div>

      {/* Create placement drive */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
      >
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Create placement drive
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter company details and choose the students to
            invite.
          </p>
        </div>

        {/* Form fields */}
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["companyName", "Company name", "text", true],
            ["companyWebsite", "Company website", "url"],
            ["hrName", "HR contact name", "text"],
            ["hrEmail", "HR email", "email"],
            ["jobTitle", "Job title", "text", true],
            ["location", "Job location", "text"],
            ["salaryMin", "Minimum package (LPA)", "number"],
            ["salaryMax", "Maximum package (LPA)", "number"],
            [
              "eligibilityDepartments",
              "Eligible departments",
              "text",
            ],
            ["minimumCgpa", "Minimum CGPA", "number"],
            ["graduationYear", "Graduation year", "number"],
            [
              "registrationDeadline",
              "Registration deadline",
              "date",
            ],
            [
              "interviewAt",
              "Interview date and time",
              "datetime-local",
            ],
          ].map(([name, label, type, required]) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                {label}
                {required && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </label>

              <input
                id={name}
                name={name}
                type={type}
                required={Boolean(required)}
                min={
                  [
                    "salaryMin",
                    "salaryMax",
                    "minimumCgpa",
                    "graduationYear",
                  ].includes(name)
                    ? "0"
                    : undefined
                }
                step={
                  name === "minimumCgpa" ? "0.01" : "any"
                }
                value={form[name]}
                onChange={changeForm}
                className={inputClass}
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label
              htmlFor="jobDescription"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Job description
            </label>

            <textarea
              id="jobDescription"
              name="jobDescription"
              rows={3}
              value={form.jobDescription}
              onChange={changeForm}
              placeholder="Describe the job role and responsibilities"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="interviewRounds"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Interview rounds
            </label>

            <textarea
              id="interviewRounds"
              name="interviewRounds"
              rows={2}
              value={form.interviewRounds}
              onChange={changeForm}
              placeholder="Enter interview rounds"
              className={inputClass}
            />
          </div>
        </div>

        {/* Select invited students */}
        <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">
                Select invited students
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Select students individually or invite everyone.
              </p>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(event) =>
                  toggleSelectAll(event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              Select all students
            </label>
          </div>

          {!selectAll && (
            <>
              {/* Student search */}
              <div className="relative mt-4">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    changeStudentSearch(event.target.value)
                  }
                  placeholder="Search name, email, USN or department"
                  className={`${inputClass} pl-10`}
                />
              </div>

              {/* Student list */}
              <div className="mt-3 divide-y divide-slate-100">
                {paginatedStudents.map((student) => (
                  <label
                    key={student.id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-3 text-sm transition hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300"
                    />

                    <span className="min-w-0">
                      <span className="block font-semibold text-slate-800">
                        {student.fullName || "Unnamed student"}
                      </span>

                      <span className="mt-0.5 block break-words text-xs text-slate-500">
                        {student.usn || "No USN"} ·{" "}
                        {student.department || "No department"} ·{" "}
                        {student.email || "No email"}
                      </span>
                    </span>
                  </label>
                ))}

                {visibleStudents.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No students found.
                  </p>
                )}
              </div>

              {/* Pagination */}
              {visibleStudents.length > 0 && (
                <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-slate-500">
                    Showing{" "}
                    {(studentPage - 1) * studentsPerPage + 1}
                    {"–"}
                    {Math.min(
                      studentPage * studentsPerPage,
                      visibleStudents.length
                    )}{" "}
                    of {visibleStudents.length} students
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        changeStudentPage(studentPage - 1)
                      }
                      disabled={studentPage === 1}
                      className={buttonSecondary}
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <span className="min-w-24 text-center text-sm text-slate-600">
                      Page {studentPage} of {totalStudentPages}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        changeStudentPage(studentPage + 1)
                      }
                      disabled={
                        studentPage === totalStudentPages
                      }
                      className={buttonSecondary}
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              <p className="mt-3 text-xs font-medium text-indigo-600">
                {selected.length} student(s) selected
              </p>
            </>
          )}

          {selectAll && (
            <div className="mt-4 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700">
              All students will be invited to this placement drive.
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className={buttonPrimary}
          >
            <BriefcaseBusiness size={17} />
            {loading
              ? "Saving..."
              : "Publish drive and send invitations"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setForm({ ...initialForm });
              setSelected([]);
              setSelectAll(false);
              setSearch("");
              setStudentPage(1);
            }}
            className={buttonSecondary}
          >
            Clear form
          </button>
        </div>
      </form>

      {/* Section navigation */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={showPlacementDrives}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              activeSection === "drives"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BriefcaseBusiness size={18} />
            Placement drives
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeSection === "drives"
                  ? "bg-white/20"
                  : "bg-slate-100"
              }`}
            >
              {drives.length}
            </span>
          </button>

          <button
            type="button"
            onClick={showRegistrations}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              activeSection === "registrations"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ClipboardList size={18} />
            Student registrations
          </button>
        </div>
      </div>

      {/* Placement drives section */}
      {activeSection === "drives" && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Placement drives
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select a drive to view its student registrations.
              </p>
            </div>

            <button
              type="button"
              onClick={load}
              disabled={loading}
              className={buttonSecondary}
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-4">Company / Role</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Invited</th>
                  <th className="p-4">Registered</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {drives.map((drive) => (
                  <tr
                    key={drive.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="p-4">
                      <span className="block font-semibold text-slate-900">
                        {drive.companyName}
                      </span>

                      <span className="mt-1 block text-xs text-slate-500">
                        {drive.jobTitle}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600">
                      {drive.registrationDeadline || "—"}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {drive.invitedCount ?? 0}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {drive.registeredCount ?? 0}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => openRegistrations(drive)}
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                      >
                        <Users size={15} />
                        View registrations
                      </button>
                    </td>
                  </tr>
                ))}

                {drives.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-10 text-center text-slate-500"
                    >
                      <BriefcaseBusiness
                        size={32}
                        className="mx-auto mb-3 text-slate-300"
                      />

                      <p className="font-medium">
                        No placement drives available.
                      </p>

                      <p className="mt-1 text-xs">
                        Create a placement drive using the form above.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Student registrations section */}
      {activeSection === "registrations" && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Student registrations
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {selectedDrive
                  ? `${selectedDrive.companyName} — ${selectedDrive.jobTitle}`
                  : "Choose a placement drive to view its registrations."}
              </p>
            </div>

            {activeDrive && (
              <button
                type="button"
                onClick={() => {
                  setActiveDrive("");
                  setRegistrations([]);
                }}
                className={buttonSecondary}
              >
                <X size={15} />
                Clear selection
              </button>
            )}
          </div>

          {/* Drive selector */}
          <div className="border-b border-slate-200 p-5">
            <label
              htmlFor="registrationDrive"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Select placement drive
            </label>

            <select
              id="registrationDrive"
              value={activeDrive}
              onChange={(event) =>
                setActiveDrive(event.target.value)
              }
              className={inputClass}
            >
              <option value="">
                -- Select a placement drive --
              </option>

              {drives.map((drive) => (
                <option key={drive.id} value={String(drive.id)}>
                  {drive.companyName} — {drive.jobTitle}
                </option>
              ))}
            </select>
          </div>

          {!activeDrive ? (
            <div className="p-10 text-center">
              <ClipboardList
                size={36}
                className="mx-auto mb-3 text-slate-300"
              />

              <p className="font-semibold text-slate-700">
                Select a placement drive
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Student registrations will appear here after you
                select a drive.
              </p>

              {drives.length === 0 && (
                <button
                  type="button"
                  onClick={showPlacementDrives}
                  className={`${buttonPrimary} mt-4`}
                >
                  View placement drives
                </button>
              )}
            </div>
          ) : registrationsLoading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              <RefreshCw
                size={22}
                className="mx-auto mb-3 animate-spin"
              />
              Loading student registrations...
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-5">
                <p className="text-sm text-slate-600">
                  Total registrations:{" "}
                  <strong>{registrations.length}</strong>
                </p>

                <button
                  type="button"
                  onClick={() => loadRegistrations(activeDrive)}
                  className={buttonSecondary}
                >
                  <RefreshCw size={15} />
                  Refresh registrations
                </button>
              </div>

              <div className="overflow-x-auto p-5">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Student</th>
                      <th className="p-3">USN</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {registrations.map((registration) => (
                      <tr
                        key={registration.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="p-3">
                          <span className="block font-semibold text-slate-900">
                            {registration.studentName || "—"}
                          </span>

                          <span className="mt-1 block text-xs text-slate-500">
                            {registration.email || "—"}
                          </span>
                        </td>

                        <td className="p-3 text-slate-600">
                          {registration.usn || "—"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {registration.department || "—"}
                        </td>

                        <td className="p-3">
                          <StatusBadge
                            status={registration.status}
                          />
                        </td>

                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => changeStatus(registration)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            Update status
                          </button>
                        </td>
                      </tr>
                    ))}

                    {registrations.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-10 text-center text-slate-500"
                        >
                          No student registrations for this drive yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

// --------------------------------------------------
// Reusable statistics card
// --------------------------------------------------

function StatCard({ title, value, Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon size={21} />
      </div>

      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

// --------------------------------------------------
// Registration status badge
// --------------------------------------------------

function StatusBadge({ status }) {
  const statusStyles = {
    REGISTERED: "bg-blue-50 text-blue-700",
    SHORTLISTED: "bg-violet-50 text-violet-700",
    ROUND_1_PASSED: "bg-emerald-50 text-emerald-700",
    ROUND_1_FAILED: "bg-red-50 text-red-700",
    ROUND_2_PASSED: "bg-emerald-50 text-emerald-700",
    ROUND_2_FAILED: "bg-red-50 text-red-700",
    SELECTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-50 text-red-700",
    WITHDRAWN: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
        statusStyles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {STATUS_OPTIONS[status] || status || "Unknown"}
    </span>
  );
}
