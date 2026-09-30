import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  GraduationCap,
  Building2,
  ShieldCheck,
  Save,
} from "lucide-react";
import Swal from "sweetalert2";

import {
  getStudentProfile,
  updateStudentProfile,
} from "../../api/studentApi";

function Profile() {

  const [profile, setProfile] =
    useState(null);

  const [form, setForm] =
    useState({
      fullName: "",
      year: "",
      department: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

    loadProfile();

  }, []);

  const loadProfile = async () => {

    try {

      setLoading(true);

      const data =
        await getStudentProfile();

      setProfile(data);

      setForm({
        fullName: data.fullName || "",
        year: data.year || "",
        department:
          data.department || "",
      });

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Unable to load profile",
        text: error.message,
      });

    } finally {

      setLoading(false);
    }
  };

  const handleChange = (event) => {

    const { name, value } =
      event.target;

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
        fullName: form.fullName,
        year: Number(form.year),
        department: form.department,
      });

      await Swal.fire({
        icon: "success",
        title: "Profile updated",
        text: "Your profile has been updated successfully.",
      });

      await loadProfile();

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Unable to update profile",
        text: error.message,
      });

    } finally {

      setSaving(false);
    }
  };

  if (loading) {

    return (
      <div className="py-16 text-center text-slate-500">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="max-w-3xl">

      <div className="mb-7">

        <h1 className="text-3xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-2 text-slate-500">
          View and update your student information.
        </p>

      </div>

      <div className="rounded-2xl border border-slate-300 bg-white p-8 shadow-sm">

        {/* HEADER */}

        <div className="mb-8 flex items-center gap-4">

          <div className="rounded-full bg-purple-100 p-4">
            <UserRound
              className="h-8 w-8 text-purple-600"
            />
          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              {profile.fullName}
            </h2>

            <p className="text-sm text-slate-500">
              {profile.role}
            </p>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* NAME */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>

            <div className="relative">

              <UserRound
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              />

              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

            </div>

          </div>

          {/* EMAIL */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <div className="relative">

              <Mail
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              />

              <input
                value={profile.email}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-500"
              />

            </div>

            <p className="mt-1 text-xs text-slate-400">
              Email cannot be changed here.
            </p>

          </div>

          {/* USN */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              USN
            </label>

            <input
              value={profile.usn}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
            />

          </div>

          {/* YEAR */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Year
            </label>

            <div className="relative">

              <GraduationCap
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              />

              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              >

                <option value="">
                  Select Year
                </option>

                <option value="1">
                  1st Year
                </option>

                <option value="2">
                  2nd Year
                </option>

                <option value="3">
                  3rd Year
                </option>

                <option value="4">
                  4th Year
                </option>

                <option value="5">
                  5th Year
                </option>

              </select>

            </div>

          </div>

          {/* DEPARTMENT */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Department
            </label>

            <div className="relative">

              <Building2
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              />

              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

            </div>

          </div>

          {/* STATUS */}

          <div className="rounded-xl bg-green-50 p-4">

            <div className="flex items-center gap-3">

              <ShieldCheck className="h-5 w-5 text-green-600" />

              <div>

                <p className="font-medium text-green-800">
                  Account Status
                </p>

                <p className="text-sm text-green-700">
                  {profile.active
                    ? "Active"
                    : "Inactive"}
                </p>

              </div>

            </div>

          </div>

          {/* SAVE */}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <Save className="h-5 w-5" />

            {saving
              ? "Saving..."
              : "Save Changes"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default Profile;