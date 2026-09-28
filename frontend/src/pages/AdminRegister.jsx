import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldPlus } from "lucide-react";

import API_BASE_URL from "../api/api";

function AdminRegister() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        `${API_BASE_URL}/auth/register/admin`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password
          })
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(
          data || "Admin registration failed"
        );
      }

      alert("Admin account created successfully!");

      navigate("/login");

    } catch (error) {

      console.error(error);

      alert(error.message);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <ShieldPlus size={28} />
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            Create Admin Account
          </h1>

          <p className="mt-2 text-gray-600">
            Create a CampusConnect administrator
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div>

            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              type="text"
              placeholder="Enter admin name"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter admin email"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Create password"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>

            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder="Confirm password"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >

            {loading
              ? "Creating Admin..."
              : "Create Admin Account"
            }

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

export default AdminRegister;