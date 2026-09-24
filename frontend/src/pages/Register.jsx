import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-10">

      <div className="w-full max-w-lg rounded-2xl border bg-white p-8 shadow-sm">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <UserPlus size={28} />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Create Account
          </h1>

          <p className="mt-2 text-gray-600">
            Join CampusConnect today
          </p>

        </div>

        <form className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                USN
              </label>

              <input
                type="text"
                placeholder="Enter USN"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Year
              </label>

              <select
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Year
                </option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Department
            </label>

            <select
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
              defaultValue=""
            >
              <option value="" disabled>
                Select Department
              </option>
              <option value="CSE">
                Computer Science & Engineering
              </option>
              <option value="ISE">
                Information Science & Engineering
              </option>
              <option value="ECE">
                Electronics & Communication
              </option>
              <option value="ME">
                Mechanical Engineering
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Create password"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Create Account
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600"
          >
            Sign in
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;