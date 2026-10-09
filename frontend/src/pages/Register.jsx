import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Building2, CalendarDays, CheckCircle2,
  Eye, EyeOff, GraduationCap, Hash, LockKeyhole, Mail, UserPlus, UserRound
} from "lucide-react";
import Swal from "sweetalert2";
import API_BASE_URL from "../api/api";

const initialFormData = {
  fullName: "", email: "", usn: "", year: "", department: "",
  password: "", confirmPassword: "",
};

const inputClass =
  "block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 disabled:cursor-not-allowed disabled:bg-slate-100";
const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: name === "usn" ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const usn = formData.usn.trim().toUpperCase();

    if (!fullName || !email || !usn || !formData.year || !formData.department) {
      await Swal.fire({
        icon: "warning",
        title: "Complete your details",
        text: "Please fill in all required fields.",
        confirmButtonText: "Review details",
        confirmButtonColor: "#4338ca",
      });
      return;
    }

    if (formData.password.length < 8) {
      await Swal.fire({
        icon: "warning",
        title: "Password is too short",
        text: "Use at least 8 characters for your password.",
        confirmButtonText: "OK",
        confirmButtonColor: "#4338ca",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      await Swal.fire({
        icon: "warning",
        title: "Passwords don't match",
        text: "Check both password fields and try again.",
        confirmButtonText: "Review password",
        confirmButtonColor: "#4338ca",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          usn,
          year: Number(formData.year),
          department: formData.department,
          password: formData.password,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : { message: await response.text() };

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Registration failed. Please try again."
        );
      }

      await Swal.fire({
        icon: "success",
        title: "Account created!",
        text: "Your student account has been created successfully.",
        confirmButtonText: "Go to sign in",
        confirmButtonColor: "#4338ca",
      });
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Registration error:", error);
      await Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: error?.message || "Something went wrong. Please try again.",
        confirmButtonText: "Try again",
        confirmButtonColor: "#4338ca",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link to="/login" className="flex items-center gap-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-600/15">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-700 text-white shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight text-slate-900">CampusConnect</span>
              <span className="block text-xs text-slate-500">College Community Platform</span>
            </span>
          </Link>
          <Link to="/login" className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-indigo-700 sm:inline-flex">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </header>

        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-800 p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[45px] border-white/[0.06]" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-[50px] border-white/[0.06]" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100">
                <CheckCircle2 className="h-4 w-4" /> GET STARTED IN MINUTES
              </span>
              <h1 className="mt-7 text-3xl font-bold leading-tight xl:text-4xl">Your campus journey starts here.</h1>
              <p className="mt-4 text-sm leading-7 text-indigo-100/80">
                Create your student account to discover campus events, manage registrations, and stay connected with your college community.
              </p>
            </div>
            <div className="relative z-10 mt-12 space-y-5">
              <div className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10"><CalendarDays className="h-5 w-5 text-indigo-200" /></span>
                <div><p className="text-sm font-semibold">Find campus events</p><p className="mt-1 text-xs leading-5 text-indigo-100/70">Keep track of activities and upcoming events.</p></div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10"><UserRound className="h-5 w-5 text-indigo-200" /></span>
                <div><p className="text-sm font-semibold">One student profile</p><p className="mt-1 text-xs leading-5 text-indigo-100/70">Keep your student details together in one place.</p></div>
              </div>
            </div>
            <p className="relative z-10 mt-12 border-t border-white/15 pt-5 text-xs text-indigo-100/60">College Event &amp; Club Management System</p>
          </aside>

          <section className="p-5 sm:p-8 lg:p-10 xl:p-12">
            <div className="mx-auto max-w-xl">
              <div className="mb-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 lg:hidden"><UserPlus className="h-6 w-6" /></div>
                <p className="text-sm font-semibold text-indigo-700">STUDENT REGISTRATION</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Create your account</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Fill in your details to join CampusConnect. Fields marked <span className="text-rose-600">*</span> are required.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className={labelClass}>Full name <span className="text-rose-600">*</span></label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                      <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" autoComplete="name" maxLength={100} required disabled={loading} className={`${inputClass} pl-10`} />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="email" className={labelClass}>Email address <span className="text-rose-600">*</span></label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                      <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" autoCapitalize="none" spellCheck="false" maxLength={254} required disabled={loading} className={`${inputClass} pl-10`} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="usn" className={labelClass}>Student USN <span className="text-rose-600">*</span></label>
                    <div className="relative">
                      <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                      <input id="usn" name="usn" type="text" value={formData.usn} onChange={handleChange} placeholder="Enter your USN" autoCapitalize="characters" maxLength={30} required disabled={loading} className={`${inputClass} pl-10 uppercase`} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="year" className={labelClass}>Current year <span className="text-rose-600">*</span></label>
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                      <select id="year" name="year" value={formData.year} onChange={handleChange} required disabled={loading} className={`${inputClass} appearance-none pl-10`}>
                        <option value="">Select year</option><option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="department" className={labelClass}>Department <span className="text-rose-600">*</span></label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                      <select id="department" name="department" value={formData.department} onChange={handleChange} required disabled={loading} className={`${inputClass} appearance-none pl-10`}>
                        <option value="">Select your department</option>
                        <option value="CSE">Computer Science &amp; Engineering</option>
                        <option value="ISE">Information Science &amp; Engineering</option>
                        <option value="ECE">Electronics &amp; Communication</option>
                        <option value="ME">Mechanical Engineering</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className={labelClass}>Password <span className="text-rose-600">*</span></label>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                      <input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="At least 8 characters" autoComplete="new-password" minLength={8} maxLength={128} required disabled={loading} className={`${inputClass} pl-10 pr-11`} />
                      <button type="button" onClick={() => setShowPassword((previous) => !previous)} disabled={loading} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/20">
                        {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">Use 8 or more characters.</p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className={labelClass}>Confirm password <span className="text-rose-600">*</span></label>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                      <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" autoComplete="new-password" minLength={8} maxLength={128} required disabled={loading} className={`${inputClass} pl-10 pr-11`} />
                      <button type="button" onClick={() => setShowConfirmPassword((previous) => !previous)} disabled={loading} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/20">
                        {showConfirmPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                      </button>
                    </div>
                  </div>
                </div>

                {formData.confirmPassword.length > 0 && (
                  <p className={`flex items-center gap-2 text-xs ${formData.password === formData.confirmPassword ? "text-emerald-700" : "text-rose-600"}`} aria-live="polite">
                    <CheckCircle2 className="h-4 w-4" />
                    {formData.password === formData.confirmPassword ? "Passwords match" : "Passwords do not match yet"}
                  </p>
                )}

                <button type="submit" disabled={loading} className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? (
                    <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Creating account...</>
                  ) : (
                    <><UserPlus className="h-[18px] w-[18px]" />Create student account<ArrowRight className="h-[17px] w-[17px] transition-transform group-hover:translate-x-1" /></>
                  )}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-medium text-slate-400">ALREADY REGISTERED?</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="text-center text-sm text-slate-600">
                Have an account?{" "}
                <Link to="/login" className="font-semibold text-indigo-700 transition hover:text-indigo-900 hover:underline">Sign in</Link>
              </p>

              <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
                <CheckCircle2 className="h-4 w-4" /> Your student details are used to set up your campus profile.
              </p>
            </div>
          </section>
        </div>

        <footer className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} CampusConnect. All rights reserved.
        </footer>
      </div>
    </main>
  );
}

export default Register;