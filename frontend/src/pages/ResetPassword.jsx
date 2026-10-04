import { useState } from "react";
import {
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import Swal from "sweetalert2";

import API_BASE_URL from "../api/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Invalid Reset Link",
        text: "This password reset link is invalid.",
        confirmButtonColor: "#15803d",
      });

      return;
    }

    if (password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Password Too Short",
        text: "Password must contain at least 8 characters.",
        confirmButtonColor: "#15803d",
      });

      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Passwords Don't Match",
        text: "Please make sure both passwords are the same.",
        confirmButtonColor: "#15803d",
      });

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/reset-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token,
            password,
            confirmPassword,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = {
          message: await response.text(),
        };
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Unable to reset password."
        );
      }

      setSuccess(true);

    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text:
          error.message ||
          "This reset link may be expired or invalid.",
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

            {!success ? (
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
                  <LockKeyhole
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
                  Create new password
                </h1>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  Choose a strong password for your
                  CampusConnect account.
                </p>

                {/* FORM */}

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 space-y-5"
                >

                  {/* NEW PASSWORD */}

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
                      New Password
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
                        placeholder="Enter new password"
                        autoComplete="new-password"
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
                          pr-12
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
                          hover:bg-slate-100
                          hover:text-slate-700
                        "
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>

                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      Minimum 8 characters
                    </p>

                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div>

                    <label
                      htmlFor="confirmPassword"
                      className="
                        mb-2
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Confirm Password
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
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value
                          )
                        }
                        placeholder="Confirm your password"
                        autoComplete="new-password"
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
                          pr-12
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

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
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
                          hover:bg-slate-100
                          hover:text-slate-700
                        "
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* SUBMIT */}

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

                        Updating Password...
                      </>
                    ) : (
                      <>
                        Reset Password

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
                    Your new password will be securely
                    encrypted before it is stored.
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
                    Password Updated
                  </p>

                  <h1
                    className="
                      mt-2
                      text-2xl
                      font-bold
                      text-slate-900
                    "
                  >
                    Password reset successful
                  </h1>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-6
                      text-slate-500
                    "
                  >
                    Your password has been updated
                    successfully. You can now sign in
                    using your new password.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="
                      mt-7
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
                      transition
                      hover:bg-green-800
                    "
                  >
                    Go to Login

                    <ArrowRight size={17} />
                  </button>

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

export default ResetPassword;