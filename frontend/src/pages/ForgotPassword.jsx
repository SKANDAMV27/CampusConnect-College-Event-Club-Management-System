import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Mail,
  ShieldCheck,
} from "lucide-react";

import Swal from "sweetalert2";

import API_BASE_URL from "../api/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email address.",
        confirmButtonColor: "#15803d",
      });

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: trimmedEmail,
          }),
        }
      );

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
            "Unable to send password reset email."
        );
      }

      setSent(true);

    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Unable to Send Reset Link",
        text:
          error.message ||
          "Please check your email and try again.",
        confirmButtonColor: "#15803d",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-5
            py-4
            sm:px-8
          "
        >

          <Link
            to="/login"
            className="flex items-center gap-3"
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-green-700
              "
            >
              <GraduationCap
                className="h-5 w-5 text-white"
              />
            </div>

            <div>

              <p className="text-base font-bold text-slate-900">
                CampusConnect
              </p>

              <p className="text-[11px] text-slate-500">
                College Community Platform
              </p>

            </div>

          </Link>

          <Link
            to="/login"
            className="
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-600
              hover:text-green-700
            "
          >
            <ArrowLeft size={16} />

            Back to Login
          </Link>

        </div>

      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main
        className="
          flex
          min-h-[calc(100vh-73px)]
          items-center
          justify-center
          px-5
          py-10
          sm:px-8
        "
      >

        <div className="w-full max-w-md">

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

            {!sent ? (
              <>

                {/* ICON */}

                <div
                  className="
                    mb-6
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-green-50
                  "
                >
                  <Mail
                    className="h-7 w-7 text-green-700"
                  />
                </div>

                {/* HEADER */}

                <p className="mb-2 text-sm font-semibold text-green-700">
                  Account Recovery
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
                  Forgot your password?
                </h1>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  Enter the email address associated with
                  your CampusConnect account. We'll send you
                  a secure link to reset your password.
                </p>

                {/* FORM */}

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 space-y-5"
                >

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
                        placeholder="Enter your registered email"
                        autoComplete="email"
                        disabled={loading}
                        required
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
                          placeholder:text-slate-400
                          hover:border-slate-400
                          focus:border-green-600
                          focus:ring-4
                          focus:ring-green-100
                          disabled:bg-slate-100
                        "
                      />

                    </div>

                  </div>

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
                      hover:bg-green-800
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

                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link

                        <ArrowRight
                          size={17}
                          className="
                            transition
                            group-hover:translate-x-1
                          "
                        />
                      </>
                    )}

                  </button>

                </form>

                {/* SECURITY */}

                <div
                  className="
                    mt-6
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    bg-slate-50
                    p-4
                  "
                >

                  <ShieldCheck
                    size={18}
                    className="
                      mt-0.5
                      shrink-0
                      text-green-700
                    "
                  />

                  <p className="text-xs leading-5 text-slate-500">
                    For your security, the reset link will
                    expire after 15 minutes.
                  </p>

                </div>

              </>
            ) : (
              <>

                {/* SUCCESS */}

                <div
                  className="
                    mx-auto
                    mb-6
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-green-50
                  "
                >
                  <CheckCircle2
                    className="h-8 w-8 text-green-600"
                  />
                </div>

                <div className="text-center">

                  <p className="text-sm font-semibold text-green-700">
                    Check Your Email
                  </p>

                  <h1
                    className="
                      mt-2
                      text-2xl
                      font-bold
                      text-slate-900
                    "
                  >
                    Reset link sent
                  </h1>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-6
                      text-slate-500
                    "
                  >
                    If an account exists with{" "}

                    <span className="font-medium text-slate-700">
                      {email}
                    </span>

                    , you will receive a password reset
                    link shortly.
                  </p>

                  <div
                    className="
                      mt-6
                      rounded-xl
                      bg-slate-50
                      p-4
                      text-left
                    "
                  >

                    <p className="text-xs leading-5 text-slate-500">
                      Didn't receive the email?
                    </p>

                    <ul className="mt-2 space-y-1 text-xs text-slate-500">
                      <li>
                        • Check your spam or junk folder.
                      </li>

                      <li>
                        • Make sure the email address is correct.
                      </li>

                      <li>
                        • The reset link expires in 15 minutes.
                      </li>
                    </ul>

                  </div>

                  <Link
                    to="/login"
                    className="
                      mt-6
                      inline-flex
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-green-700
                      hover:text-green-800
                    "
                  >
                    <ArrowLeft size={16} />

                    Back to Login
                  </Link>

                </div>

              </>
            )}

          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} CampusConnect.
            All rights reserved.
          </p>

        </div>

      </main>

    </div>
  );
}

export default ForgotPassword;