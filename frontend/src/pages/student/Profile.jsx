import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  GraduationCap,
  Building2,
  ShieldCheck,
  Save,
  LockKeyhole,
  Loader2,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import Swal from "sweetalert2";
import { getStudentProfile, updateStudentProfile } from "../../api/studentApi";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ fullName: "", year: "", department: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getStudentProfile();
      setProfile(data);
      setForm({
        fullName: data?.fullName || "",
        year: data?.year ?? "",
        department: data?.department || "",
      });
    } catch (error) {
      console.error("Unable to load profile:", error);
      await Swal.fire({
        icon: "error",
        title: "Unable to load profile",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while loading your profile.",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.fullName.trim() || !String(form.year) || !form.department.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Complete all fields",
        text: "Please enter your name, current year, and department.",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    try {
      setSaving(true);
      await updateStudentProfile({
        fullName: form.fullName.trim(),
        year: Number(form.year),
        department: form.department.trim(),
      });
      await Swal.fire({
        icon: "success",
        title: "Profile updated",
        text: "Your profile has been updated successfully.",
        confirmButtonColor: "#4f46e5",
        timer: 1800,
        timerProgressBar: true,
      });
      await loadProfile();
    } catch (error) {
      console.error("Unable to update profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          error?.response?.data?.message ||
          (typeof error?.response?.data === "string" ? error.response.data : "") ||
          error?.message ||
          "Unable to update your profile.",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({
      fullName: profile?.fullName || "",
      year: profile?.year ?? "",
      department: profile?.department || "",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Loader2 size={26} className="animate-spin" />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700">Loading your profile</p>
          <p className="mt-1 text-sm text-slate-500">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <UserRound size={27} />
          </div>
          <h1 className="mt-4 text-lg font-bold text-slate-900">Profile unavailable</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">We couldn’t load your profile information.</p>
          <button type="button" onClick={loadProfile} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            Try again
          </button>
        </div>
      </div>
    );
  }

  const active = Boolean(profile.active);

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 pb-10">
      <section className="rounded-3xl bg-indigo-600 px-6 py-8 text-white shadow-sm sm:px-8 sm:py-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white">
            <UserRound size={37} />
          </div>

          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              <GraduationCap size={14} />
              Student account
            </span>

            <h1 className="mt-3 truncate text-2xl font-bold tracking-tight sm:text-3xl">
              {profile.fullName || "My profile"}
            </h1>

            <p className="mt-1 text-sm text-indigo-100">
              {profile.role || "Student"}
              {profile.usn ? ` · ${profile.usn}` : ""}
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
              active
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                active ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            {active ? "Active account" : "Inactive account"}
          </span>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-6 sm:px-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Account information</h2>
            <p className="mt-1 text-sm text-slate-500">Some account identifiers are protected and cannot be edited.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <ReadOnlyField icon={Mail} label="Email address" value={profile.email} helper="Your registered email cannot be changed here." />
            <ReadOnlyField icon={GraduationCap} label="University seat number (USN)" value={profile.usn} helper="Your USN is managed by the institution." />
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Academic information</h2>
            <p className="mt-1 text-sm text-slate-500">Keep your student details accurate and up to date.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="year" className="mb-2 block text-sm font-semibold text-slate-700">Current year</label>
              <div className="relative">
                <GraduationCap className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  id="year"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="">Select your year</option>
                  <option value="1">1st year</option>
                  <option value="2">2nd year</option>
                  <option value="3">3rd year</option>
                  <option value="4">4th year</option>
                  <option value="5">5th year</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="department" className="mb-2 block text-sm font-semibold text-slate-700">Department</label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Enter your department"
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 px-5 py-5 sm:px-8">
          <div className={`flex items-start gap-3 rounded-xl border p-4 ${active ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
            <ShieldCheck className={`mt-0.5 h-5 w-5 shrink-0 ${active ? "text-emerald-700" : "text-rose-700"}`} />
            <div>
              <p className={`text-sm font-bold ${active ? "text-emerald-900" : "text-rose-900"}`}>Account status: {active ? "Active" : "Inactive"}</p>
              <p className={`mt-1 text-sm leading-5 ${active ? "text-emerald-800" : "text-rose-800"}`}>
                {active ? "Your student account is active and ready to use." : "Your student account is currently inactive. Contact your administrator if you need help."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
          <button
            type="button"
            onClick={resetForm}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw size={16} /> Reset changes
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
            {saving ? "Saving changes..." : "Save changes"}
          </button>
        </div>
      </form>

      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Profile tip</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Use your official name and current academic details so your event registrations stay consistent.
          </p>
        </div>
      </div>
    </main>
  );
}

function ReadOnlyField({ icon: Icon, label, value, helper }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          value={value || ""}
          readOnly
          aria-label={label}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-500 outline-none"
        />
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
        <LockKeyhole size={13} /> {helper}
      </p>
    </div>
  );
}

export default Profile;