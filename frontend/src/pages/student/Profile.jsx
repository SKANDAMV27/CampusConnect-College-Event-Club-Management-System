import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  GraduationCap,
  Building2,
  ShieldCheck,
  Save,
  LockKeyhole,
} from "lucide-react";
import Swal from "sweetalert2";

import {
  getStudentProfile,
  updateStudentProfile,
} from "../../api/studentApi";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    year: "",
    department: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data = await getStudentProfile();

      setProfile(data);

      setForm({
        fullName: data.fullName || "",
        year: data.year || "",
        department: data.department || "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to load profile",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while loading your profile.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await updateStudentProfile({
        fullName: form.fullName.trim(),
        year: Number(form.year),
        department: form.department.trim(),
      });

      await Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully.",
        confirmButtonColor: "#2563eb",
        timer: 1800,
        timerProgressBar: true,
      });

      await loadProfile();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error?.response?.data?.message ||
          error?.response?.data ||
          error?.message ||
          "Unable to update your profile.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-800">
            Profile unavailable
          </p>

          <p className="mt-1 text-sm text-slate-500">
            We couldn't load your profile information.
          </p>

          <button
            type="button"
            onClick={loadProfile}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl pb-10">
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          Manage your student information and account details.
        </p>
      </div>

      {/* PROFILE SUMMARY */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-7 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* AVATAR */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white">
              <UserRound className="h-9 w-9 text-blue-600" />
            </div>

            {/* USER DETAILS */}
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
                {profile.fullName}
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                {profile.role || "Student"}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    profile.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      profile.active ? "bg-green-500" : "bg-red-500"
                    }`}
                  />

                  {profile.active ? "Active Account" : "Inactive Account"}
                </span>

                {profile.usn && (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                    USN: {profile.usn}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {/* ACCOUNT INFORMATION */}
        <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Account Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your registered account details.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  value={profile.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-500"
                />
              </div>

              <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-400">
                <LockKeyhole className="h-3.5 w-3.5" />
                Email cannot be changed.
              </p>
            </div>

            {/* USN */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                University Seat Number
              </label>

              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  value={profile.usn || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-500"
                />
              </div>

              <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-400">
                <LockKeyhole className="h-3.5 w-3.5" />
                USN cannot be changed.
              </p>
            </div>
          </div>
        </div>

        {/* PERSONAL / ACADEMIC INFORMATION */}
        <div className="px-6 py-6 sm:px-8">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Academic Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Update your current academic details.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* FULL NAME */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </label>

              <div className="relative">
                <UserRound className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            {/* YEAR */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Current Year
              </label>

              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                </select>
              </div>
            </div>

            {/* DEPARTMENT */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Department
              </label>

              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Enter your department"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* ACCOUNT STATUS */}
        <div className="border-t border-slate-200 px-6 py-6 sm:px-8">
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              profile.active
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <ShieldCheck
              className={`mt-0.5 h-5 w-5 shrink-0 ${
                profile.active ? "text-green-600" : "text-red-600"
              }`}
            />

            <div>
              <p
                className={`text-sm font-semibold ${
                  profile.active ? "text-green-800" : "text-red-800"
                }`}
              >
                Account Status
              </p>

              <p
                className={`mt-0.5 text-sm ${
                  profile.active ? "text-green-700" : "text-red-700"
                }`}
              >
                {profile.active
                  ? "Your student account is active and ready to use."
                  : "Your student account is currently inactive."}
              </p>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-8">
          <button
            type="button"
            onClick={() =>
              setForm({
                fullName: profile.fullName || "",
                year: profile.year || "",
                department: profile.department || "",
              })
            }
            disabled={saving}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;