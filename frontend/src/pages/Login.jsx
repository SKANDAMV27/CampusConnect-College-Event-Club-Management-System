import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LogIn,
  Mail,
  LockKeyhole,
} from "lucide-react";
import Swal from "sweetalert2";

import API_BASE_URL from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------
  // Login
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please enter your email and password.",
        confirmButtonColor: "#16a34a",
      });

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        data = {
          message: text,
        };
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Invalid email or password"
        );
      }

      // -----------------------------------------------------
      // Store authentication information
      // -----------------------------------------------------
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.name,
          email: data.email,
        })
      );

      localStorage.setItem(
        "rememberMe",
        rememberMe ? "true" : "false"
      );

      console.log("Login successful:", data);

      // -----------------------------------------------------
      // Success message
      // -----------------------------------------------------
      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome back, ${data.name}`,
        showConfirmButton: false,
        timer: 1500,
      });

      // -----------------------------------------------------
      // Role based navigation
      // -----------------------------------------------------
      const role = String(data.role || "").toUpperCase();

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "STUDENT") {
        navigate("/dashboard");
      } else {
        await Swal.fire({
          icon: "warning",
          title: "Unknown Role",
          text: "Your account role is not recognized.",
          confirmButtonColor: "#16a34a",
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.message ||
          "Invalid email or password",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#16a34a",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Social login placeholder
  // ---------------------------------------------------------
  const handleSocialLogin = (provider) => {
    Swal.fire({
      icon: "info",
      title: `${provider} Login`,
      text: `${provider} authentication is not configured yet.`,
      confirmButtonColor: "#16a34a",
    });
  };

  return (
    <div className="min-h-screen bg-white lg:flex">

      {/* =====================================================
          LEFT SIDE
      ====================================================== */}
      <div className="relative hidden min-h-screen overflow-hidden bg-[#090909] lg:flex lg:w-[60%]">

        {/* Background globe */}
        <div className="absolute inset-0 overflow-hidden">

          {/* Main globe */}
          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-[850px]
              w-[850px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border
              border-slate-700/40
              bg-[radial-gradient(circle_at_35%_30%,rgba(100,116,139,0.16),rgba(15,23,42,0.05)_45%,rgba(0,0,0,0.85)_75%)]
              shadow-[inset_-80px_-40px_180px_rgba(0,0,0,0.9),0_0_100px_rgba(30,41,59,0.18)]
            "
          >

            {/* Latitude */}
            <div
              className="
                absolute
                left-[8%]
                top-[28%]
                h-[45%]
                w-[84%]
                rounded-[50%]
                border
                border-slate-600/30
              "
            />

            <div
              className="
                absolute
                left-[13%]
                top-[40%]
                h-[20%]
                w-[74%]
                rounded-[50%]
                border
                border-slate-600/20
              "
            />

            {/* Longitude */}
            <div
              className="
                absolute
                left-[30%]
                top-[3%]
                h-[94%]
                w-[40%]
                rounded-[50%]
                border
                border-slate-600/25
              "
            />

            <div
              className="
                absolute
                left-[43%]
                top-[2%]
                h-[96%]
                w-[14%]
                rounded-[50%]
                border
                border-slate-600/20
              "
            />

            {/* Globe light points */}
            <div className="absolute left-[25%] top-[27%] h-1 w-1 rounded-full bg-slate-300/70 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />

            <div className="absolute left-[58%] top-[34%] h-1 w-1 rounded-full bg-slate-300/60 shadow-[0_0_10px_rgba(255,255,255,0.4)]" />

            <div className="absolute left-[66%] top-[53%] h-1 w-1 rounded-full bg-slate-300/50 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />

            <div className="absolute left-[35%] top-[61%] h-1 w-1 rounded-full bg-slate-300/50 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />

            <div className="absolute left-[73%] top-[44%] h-1 w-1 rounded-full bg-slate-300/50 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />

            <div className="absolute left-[45%] top-[22%] h-1 w-1 rounded-full bg-slate-300/50 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />

            <div className="absolute left-[20%] top-[48%] h-1 w-1 rounded-full bg-slate-300/40 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
          </div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.65)_100%)]" />
        </div>

        {/* Left content */}
        <div className="relative z-10 flex min-h-screen w-full flex-col justify-between px-16 py-14 xl:px-20">

          {/* Logo */}
          <div>
            <div className="flex items-center gap-2">

              <span className="text-4xl font-bold leading-none text-white">
                C
              </span>

              <span className="h-8 w-5 rounded-sm bg-green-500" />

            </div>
          </div>

          {/* Welcome section */}
          <div className="mb-16 max-w-xl">

            <p className="mb-3 text-xl font-medium text-slate-300">
              Welcome to
            </p>

            <h2 className="text-5xl font-bold tracking-tight text-white xl:text-6xl">
              CampusConnect
            </h2>

            <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
              Your college community platform for events,
              clubs, announcements and student activities.
            </p>

            <button
              type="button"
              onClick={() =>
                Swal.fire({
                  icon: "info",
                  title: "CampusConnect",
                  text:
                    "Connect with your college community and stay updated with campus activities.",
                  confirmButtonColor: "#16a34a",
                })
              }
              className="mt-4 text-sm font-medium text-green-400 transition hover:text-green-300"
            >
              Know more
            </button>

          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}
      <div className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-10 sm:px-10 lg:w-[40%] lg:px-12 xl:px-16">

        <div className="w-full max-w-[520px]">

          {/* Heading */}
          <div className="mb-8">

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back!
            </h1>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Login to your account
            </h2>

            <p className="mt-5 text-sm text-slate-600 sm:text-base">
              It's nice to see you again. Ready to connect?
            </p>

          </div>

          {/* =================================================
              LOGIN FORM
          ================================================== */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="
                    h-12
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    pl-11
                    pr-4
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-green-600
                    focus:ring-2
                    focus:ring-green-100
                    disabled:cursor-not-allowed
                    disabled:bg-slate-100
                  "
                />

              </div>
            </div>

            {/* Password */}
            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="
                    h-12
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    pl-11
                    pr-12
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-green-600
                    focus:ring-2
                    focus:ring-green-100
                    disabled:cursor-not-allowed
                    disabled:bg-slate-100
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={loading}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    rounded-md
                    p-1.5
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-green-600
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-green-700
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
                focus:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              <LogIn size={18} />

              {loading
                ? "Signing In..."
                : "Log In"}

            </button>

          </form>

          {/* Remember me / Forgot */}
          <div className="mt-4 flex items-center justify-between">

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
                className="
                  h-4
                  w-4
                  rounded
                  border-slate-300
                  text-green-600
                  focus:ring-green-500
                "
              />

              <span>
                Remember me
              </span>

            </label>

            <button
              type="button"
              onClick={() =>
                Swal.fire({
                  icon: "info",
                  title: "Forgot password?",
                  text:
                    "Password reset functionality can be added to CampusConnect.",
                  confirmButtonColor: "#16a34a",
                })
              }
              className="
                text-sm
                font-medium
                text-blue-600
                transition
                hover:text-blue-700
                hover:underline
              "
            >
              Forgot password?
            </button>

          </div>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">

            <div className="h-px flex-1 bg-slate-300" />

            <span className="text-sm text-slate-400">
              or
            </span>

            <div className="h-px flex-1 bg-slate-300" />

          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() =>
              handleSocialLogin("Google")
            }
            className="
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-3
              rounded-lg
              border
              border-slate-300
              bg-white
              text-sm
              font-semibold
              text-slate-800
              transition
              hover:bg-slate-50
            "
          >

            <span className="text-lg font-bold text-[#4285F4]">
              G
            </span>

            Continue with Google

          </button>

          {/* LinkedIn / GitHub */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* LinkedIn */}
            <button
              type="button"
              onClick={() =>
                handleSocialLogin("LinkedIn")
              }
              className="
                flex
                h-12
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-slate-300
                bg-white
                text-sm
                font-semibold
                text-slate-800
                transition
                hover:bg-slate-50
              "
            >

              <span
                className="
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-sm
                  bg-[#0A66C2]
                  text-xs
                  font-bold
                  text-white
                "
              >
                in
              </span>

              LinkedIn

            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={() =>
                handleSocialLogin("GitHub")
              }
              className="
                flex
                h-12
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-slate-300
                bg-white
                text-sm
                font-semibold
                text-slate-800
                transition
                hover:bg-slate-50
              "
            >

              <span
                className="
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-900
                  text-[10px]
                  font-bold
                  text-white
                "
              >
                GH
              </span>

              GitHub

            </button>

          </div>

          {/* Register */}
          <p className="mt-10 text-center text-sm text-slate-600">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="
                font-medium
                text-blue-600
                transition
                hover:text-blue-700
                hover:underline
              "
            >
              Sign up
            </Link>

          </p>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} CampusConnect.
            All rights reserved.
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;