import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  LogIn,
  Mail,
  LockKeyhole,
  GraduationCap,
  CalendarDays,
  Users,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import toast, { Toaster } from "react-hot-toast";

import API_BASE_URL from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const trimmedEmail = email.trim();

    // =======================================================
    // VALIDATION
    // =======================================================

    if (!trimmedEmail || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // =====================================================
      // API REQUEST
      // =====================================================

      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: trimmedEmail,
            password,
          }),
        }
      );

      // =====================================================
      // READ RESPONSE
      // =====================================================

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

      console.log("Login API Response:", data);

      // =====================================================
      // LOGIN FAILED
      // =====================================================

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Invalid email or password."
        );
      }

      // =====================================================
      // GET TOKEN
      // =====================================================

      const token =
        data?.token ||
        data?.accessToken ||
        data?.jwt ||
        data?.data?.token ||
        data?.data?.accessToken;

      if (!token) {
        console.error(
          "Token not found in login response:",
          data
        );

        throw new Error(
          "Login failed because the authentication token was not received."
        );
      }

      // =====================================================
      // GET ROLE
      // =====================================================

      const role = String(
        data?.role ||
          data?.user?.role ||
          data?.data?.role ||
          data?.data?.user?.role ||
          ""
      ).toUpperCase();

      if (!role) {
        console.error(
          "Role not found in login response:",
          data
        );

        throw new Error(
          "Login failed because the user role was not received."
        );
      }

      // =====================================================
      // GET USER NAME
      // =====================================================

      const userName =
        data?.name ||
        data?.username ||
        data?.user?.name ||
        data?.data?.name ||
        data?.data?.user?.name ||
        "User";

      // =====================================================
      // GET USER EMAIL
      // =====================================================

      const userEmail =
        data?.email ||
        data?.user?.email ||
        data?.data?.email ||
        data?.data?.user?.email ||
        trimmedEmail;

      // =====================================================
      // STORE AUTHENTICATION
      // =====================================================

      localStorage.setItem("token", token);

      localStorage.setItem("role", role);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: userName,
          email: userEmail,
          role: role,
        })
      );

      localStorage.setItem(
        "rememberMe",
        rememberMe ? "true" : "false"
      );

      // =====================================================
      // DEBUG
      // =====================================================

      console.log("=================================");
      console.log("LOGIN SUCCESSFUL");
      console.log("Token:", token ? "RECEIVED" : "MISSING");
      console.log("Role:", role);
      console.log("Name:", userName);
      console.log("Email:", userEmail);
      console.log("=================================");

      // =====================================================
      // SUCCESS TOAST
      // =====================================================

      toast.success(
        `Login successful. Welcome back, ${userName}!`
      );

      // =====================================================
      // NAVIGATION
      // =====================================================

      if (role === "ADMIN") {
        setTimeout(() => {
          navigate("/admin/dashboard", {
            replace: true,
          });
        }, 500);

        return;
      }

      if (role === "STUDENT") {
        setTimeout(() => {
          navigate("/dashboard", {
            replace: true,
          });
        }, 500);

        return;
      }

      // =====================================================
      // UNKNOWN ROLE
      // =====================================================

      console.error("Unknown role:", role);

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      toast.error(
        "Your account role is not recognized."
      );

    } catch (error) {
      // =====================================================
      // LOGIN ERROR
      // =====================================================

      console.error("Login Error:", error);

      // Remove invalid authentication information
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      toast.error(
        error?.message ||
          "Unable to login. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FORGOT PASSWORD
  // =========================================================

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <>
      {/* =====================================================
          TOASTER
      ===================================================== */}

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,

          style: {
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
          },

          success: {
            duration: 2500,
          },

          error: {
            duration: 3500,
          },
        }}
      />

      <div className="min-h-screen bg-slate-50 lg:flex">

        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

        <section
          className="
            relative
            hidden
            min-h-screen
            overflow-hidden
            bg-green-900
            lg:flex
            lg:w-[56%]
            xl:w-[58%]
          "
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-green-900 to-emerald-800" />

          {/* Decorative shapes */}

          <div
            className="
              absolute
              -right-32
              -top-32
              h-[420px]
              w-[420px]
              rounded-full
              border-[70px]
              border-white/5
            "
          />

          <div
            className="
              absolute
              -bottom-40
              -left-40
              h-[500px]
              w-[500px]
              rounded-full
              border-[80px]
              border-white/5
            "
          />

          <div
            className="
              absolute
              right-20
              top-1/3
              h-3
              w-3
              rounded-full
              bg-green-300/60
            "
          />

          <div
            className="
              absolute
              right-36
              top-[42%]
              h-2
              w-2
              rounded-full
              bg-white/40
            "
          />

          {/* Main content */}

          <div
            className="
              relative
              z-10
              flex
              min-h-screen
              w-full
              flex-col
              justify-between
              px-10
              py-10
              xl:px-16
              xl:py-12
            "
          >

            {/* LOGO */}

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white
                  shadow-lg
                "
              >
                <GraduationCap
                  className="h-7 w-7 text-green-700"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  CampusConnect
                </h2>

                <p className="text-xs text-green-100">
                  College Community Platform
                </p>
              </div>

            </div>

            {/* HERO */}

            <div className="max-w-xl">

              <div
                className="
                  mb-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/10
                  bg-white/10
                  px-3
                  py-1.5
                  backdrop-blur-sm
                "
              >
                <Sparkles className="h-4 w-4 text-green-300" />

                <span className="text-xs font-medium text-green-50">
                  Your Campus, Connected
                </span>
              </div>

              <h1
                className="
                  text-4xl
                  font-bold
                  leading-[1.1]
                  tracking-tight
                  text-white
                  xl:text-6xl
                "
              >
                Your Campus.
                <br />

                <span className="text-green-300">
                  Your Community.
                </span>
              </h1>

              <p
                className="
                  mt-6
                  max-w-lg
                  text-base
                  leading-7
                  text-green-50/80
                  xl:text-lg
                "
              >
                Discover college events, participate in
                activities, connect with your community and
                manage your campus experience from one simple
                platform.
              </p>

              {/* FEATURES */}

              <div className="mt-8 grid max-w-lg grid-cols-2 gap-3">

                <div
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/10
                    p-4
                    backdrop-blur-sm
                  "
                >

                  <div
                    className="
                      mb-3
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                    "
                  >
                    <CalendarDays className="h-5 w-5 text-green-700" />
                  </div>

                  <p className="text-sm font-semibold text-white">
                    College Events
                  </p>

                  <p className="mt-1 text-xs leading-5 text-green-100/70">
                    Discover and register for upcoming events.
                  </p>

                </div>

                <div
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/10
                    p-4
                    backdrop-blur-sm
                  "
                >

                  <div
                    className="
                      mb-3
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                    "
                  >
                    <Users className="h-5 w-5 text-green-700" />
                  </div>

                  <p className="text-sm font-semibold text-white">
                    Student Community
                  </p>

                  <p className="mt-1 text-xs leading-5 text-green-100/70">
                    Stay connected with your college community.
                  </p>

                </div>

              </div>

              {/* TRUST POINTS */}

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-300" />

                  <span className="text-xs text-green-50/80">
                    Easy Event Registration
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-300" />

                  <span className="text-xs text-green-50/80">
                    Student Friendly
                  </span>
                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div
              className="
                flex
                flex-col
                gap-3
                border-t
                border-white/10
                pt-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <p className="text-xs text-green-100/60">
                College Event & Club Management System
              </p>

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-green-300" />

                <span className="text-xs font-medium text-green-100/70">
                  CampusConnect Portal
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            RIGHT SIDE - LOGIN
        ===================================================== */}

        <section
          className="
            flex
            min-h-screen
            w-full
            items-center
            justify-center
            bg-slate-50
            px-5
            py-8
            sm:px-8
            lg:w-[44%]
            xl:w-[42%]
            xl:px-12
          "
        >

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}

            <div
              className="
                mb-8
                flex
                items-center
                gap-3
                lg:hidden
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-700
                  shadow-sm
                "
              >
                <GraduationCap
                  className="h-6 w-6 text-white"
                />
              </div>

              <div>

                <p className="text-lg font-bold text-slate-900">
                  CampusConnect
                </p>

                <p className="text-xs text-slate-500">
                  College Community Platform
                </p>

              </div>

            </div>

            {/* LOGIN CARD */}

            <div
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-xl
                shadow-slate-200/60
                sm:p-8
              "
            >

              {/* HEADER */}

              <div className="mb-7">

                <div
                  className="
                    mb-5
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-green-50
                  "
                >
                  <ShieldCheck className="h-6 w-6 text-green-700" />
                </div>

                <p className="mb-2 text-sm font-semibold text-green-700">
                  CampusConnect Portal
                </p>

                <h1
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-900
                    sm:text-3xl
                  "
                >
                  Welcome back
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sign in to access your college community.
                </p>

              </div>

              {/* LOGIN FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Email Address
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
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        pl-11
                        pr-4
                        text-sm
                        text-slate-900
                        outline-none
                        transition
                        duration-200
                        placeholder:text-slate-400
                        hover:border-slate-400
                        focus:border-green-600
                        focus:ring-4
                        focus:ring-green-100
                        disabled:cursor-not-allowed
                        disabled:bg-slate-100
                      "
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div>

                  <label
                    htmlFor="password"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
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
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        pl-11
                        pr-12
                        text-sm
                        text-slate-900
                        outline-none
                        transition
                        duration-200
                        placeholder:text-slate-400
                        hover:border-slate-400
                        focus:border-green-600
                        focus:ring-4
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
                        rounded-lg
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

                {/* REMEMBER + FORGOT */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-2
                      text-sm
                      text-slate-600
                    "
                  >

                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) =>
                        setRememberMe(
                          e.target.checked
                        )
                      }
                      disabled={loading}
                      className="
                        h-4
                        w-4
                        rounded
                        border-slate-300
                        text-green-600
                        accent-green-600
                        focus:ring-green-500
                      "
                    />

                    <span>
                      Remember me
                    </span>

                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="
                      text-sm
                      font-semibold
                      text-green-700
                      transition
                      hover:text-green-800
                      hover:underline
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    Forgot password?
                  </button>

                </div>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-green-700
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-green-700/20
                    transition
                    duration-200
                    hover:bg-green-800
                    hover:shadow-green-700/30
                    focus:outline-none
                    focus:ring-4
                    focus:ring-green-200
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {loading ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white/30
                          border-t-white
                        "
                      />

                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />

                      Log In

                      <ArrowRight
                        size={17}
                        className="
                          transition
                          duration-200
                          group-hover:translate-x-1
                        "
                      />
                    </>
                  )}

                </button>

              </form>

              {/* REGISTER */}

              <div className="my-7 flex items-center gap-3">

                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-medium text-slate-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-200" />

              </div>

              <div className="text-center">

                <p className="text-sm text-slate-600">
                  Don't have an account?{" "}

                  <Link
                    to="/register"
                    className="
                      font-semibold
                      text-green-700
                      transition
                      hover:text-green-800
                      hover:underline
                    "
                  >
                    Create an account
                  </Link>
                </p>

              </div>

            </div>

            {/* SECURITY */}

            <div
              className="
                mt-5
                flex
                items-center
                justify-center
                gap-2
                text-xs
                text-slate-400
              "
            >
              <ShieldCheck size={14} />

              <span>
                Secure CampusConnect authentication
              </span>
            </div>

            {/* FOOTER */}

            <p className="mt-5 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} CampusConnect.
              All rights reserved.
            </p>

          </div>

        </section>

      </div>
    </>
  );
}

export default Login;