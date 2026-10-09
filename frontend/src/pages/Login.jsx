import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const contentType = response.headers.get("content-type") || "";
      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Invalid email or password."
        );
      }

      const token =
        data?.token ||
        data?.accessToken ||
        data?.jwt ||
        data?.data?.token ||
        data?.data?.accessToken;

      const role = String(
        data?.role ||
          data?.user?.role ||
          data?.data?.role ||
          data?.data?.user?.role ||
          ""
      ).toUpperCase();

      if (!token) {
        throw new Error(
          "Login failed because the authentication token was not received."
        );
      }

      if (!role) {
        throw new Error("Login failed because the user role was not received.");
      }

      const userName =
        data?.name ||
        data?.username ||
        data?.user?.name ||
        data?.data?.name ||
        data?.data?.user?.name ||
        "User";

      const userEmail =
        data?.email ||
        data?.user?.email ||
        data?.data?.email ||
        data?.data?.user?.email ||
        trimmedEmail;

      if (role !== "ADMIN" && role !== "STUDENT") {
        throw new Error("Your account role is not recognized.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem(
        "user",
        JSON.stringify({ name: userName, email: userEmail, role })
      );
      localStorage.setItem("rememberMe", String(rememberMe));

      toast.success(`Welcome back, ${userName}!`);

      navigate(role === "ADMIN" ? "/admin/dashboard" : "/dashboard", {
        replace: true,
      });
    } catch (error) {
      // Clear stale authentication data when sign-in fails.
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      toast.error(error?.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => navigate("/forgot-password");

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 500,
          },
        }}
      />

      <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        {/* Brand panel */}
        <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-teal-800 px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12">
          <div className="pointer-events-none absolute -right-32 -top-36 h-[440px] w-[440px] rounded-full border-[70px] border-white/[0.06]" />
          <div className="pointer-events-none absolute -bottom-44 -left-32 h-[480px] w-[480px] rounded-full border-[80px] border-white/[0.06]" />
          <div className="pointer-events-none absolute right-24 top-1/3 h-3 w-3 rounded-full bg-emerald-300/70" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-black/10">
              <GraduationCap className="h-7 w-7 text-emerald-800" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">CampusConnect</p>
              <p className="mt-0.5 text-xs text-emerald-100/80">
                College Community Platform
              </p>
            </div>
          </div>

          <div className="relative z-10 my-14 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur">
              <Sparkles className="h-4 w-4 text-emerald-200" />
              <span className="text-xs font-semibold tracking-wide text-emerald-50">
                YOUR CAMPUS, CONNECTED
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.12] tracking-tight xl:text-6xl">
              One campus.
              <br />
              <span className="text-emerald-300">Endless possibilities.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-emerald-50/80 xl:text-lg">
              Discover college events, join student activities, and stay
              connected with everything happening across your campus.
            </p>

            <div className="mt-9 grid max-w-lg grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-800">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold">Campus Events</h2>
                <p className="mt-1.5 text-xs leading-5 text-emerald-50/70">
                  Explore events and manage your registrations.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-800">
                  <Users className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold">Student Community</h2>
                <p className="mt-1.5 text-xs leading-5 text-emerald-50/70">
                  Stay informed and connected with your college.
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs text-emerald-50/80">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Easy event registration
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                One student portal
              </span>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between gap-4 border-t border-white/15 pt-5 text-xs text-emerald-50/60">
            <span>College Event &amp; Club Management System</span>
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              CampusConnect Portal
            </span>
          </div>
        </section>

        {/* Login panel */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-10 xl:px-16">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-9 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800 shadow-sm">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight text-slate-900">
                  CampusConnect
                </p>
                <p className="text-xs text-slate-500">
                  College Community Platform
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9">
              <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                  <ShieldCheck className="h-6 w-6 text-emerald-800" />
                </div>

                <p className="mb-2 text-sm font-semibold text-emerald-800">
                  Welcome to CampusConnect
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-[2rem]">
                  Sign in to your account
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter your details to continue to your campus portal.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@college.edu"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck="false"
                      required
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={loading}
                      className="text-xs font-semibold text-emerald-800 transition hover:text-emerald-950 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-[18px] w-[18px]" />
                      ) : (
                        <Eye className="h-[18px] w-[18px]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    disabled={loading}
                    className="h-4 w-4 rounded border-slate-300 accent-emerald-700 focus:ring-emerald-700"
                  />
                  Remember me
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-900 hover:shadow-emerald-900/20 focus:outline-none focus:ring-4 focus:ring-emerald-700/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-[18px] w-[18px]" />
                      Sign in
                      <ArrowRight className="h-[17px] w-[17px] transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-medium text-slate-400">NEW TO CAMPUSCONNECT?</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-emerald-800 transition hover:text-emerald-950 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Secure CampusConnect authentication</span>
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} CampusConnect. All rights reserved.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Login;
