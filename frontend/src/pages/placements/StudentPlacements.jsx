import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import Swal from "sweetalert2";

import {
  getStudentPlacementDrives,
  registerForPlacement,
} from "../../api/placementApi";

export default function StudentPlacements() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(new Set());

  async function load() {
    setLoading(true);

    try {
      const data = await getStudentPlacementDrives();
      setDrives(Array.isArray(data) ? data : []);
    } catch (error) {
      Swal.fire(
        "Unable to load placement drives",
        error.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function register(drive) {
    const result = await Swal.fire({
      title: "Register for this placement drive?",
      text: `${drive.companyName} — ${drive.jobTitle}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Register",
    });

    if (!result.isConfirmed) return;

    try {
      await registerForPlacement(drive.id);

      setRegistered(
        (previous) =>
          new Set([...previous, drive.id])
      );

      await Swal.fire(
        "Registration successful",
        "Your registration has been recorded.",
        "success"
      );

      await load();
    } catch (error) {
      Swal.fire(
        "Registration failed",
        error.message,
        "error"
      );
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-slate-500">
        Loading placement drives...
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Placement Drives
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Opportunities specifically invited to you by the
          placement administrator.
        </p>
      </div>

      {drives.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white p-12 text-center">
          <BriefcaseBusiness
            className="mx-auto mb-3 text-slate-400"
            size={36}
          />
          <h2 className="font-semibold">
            No placement invitations yet
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Invited companies will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {drives.map((drive) => {
            const deadlinePassed =
              drive.registrationDeadline &&
              new Date(
                `${drive.registrationDeadline}T23:59:59`
              ) < new Date();

            const isRegistered = registered.has(drive.id);

            return (
              <article
                key={drive.id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-indigo-600">
                      {drive.companyName}
                    </p>
                    <h2 className="mt-1 text-xl font-bold">
                      {drive.jobTitle}
                    </h2>
                  </div>

                  <BriefcaseBusiness className="text-indigo-500" />
                </div>

                <p className="mt-3 whitespace-pre-line text-sm text-slate-600">
                  {drive.jobDescription ||
                    "No job description provided."}
                </p>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p className="flex gap-2">
                    <MapPin size={17} />
                    {drive.location || "Location not specified"}
                  </p>

                  <p className="flex gap-2">
                    <CalendarDays size={17} />
                    Deadline:{" "}
                    {drive.registrationDeadline || "Not specified"}
                  </p>

                  <p>
                    Package: {drive.salaryMin ?? "—"}–
                    {drive.salaryMax ?? "—"}{" "}
                    {drive.salaryCurrency || "INR"} LPA
                  </p>

                  <p>
                    Interview:{" "}
                    {drive.interviewAt
                      ? new Date(
                          drive.interviewAt
                        ).toLocaleString()
                      : "To be announced"}
                  </p>

                  <p>
                    <b>Interview rounds:</b>{" "}
                    {drive.interviewRounds ||
                      "To be announced"}
                  </p>

                  <p>
                    <b>Eligibility:</b>{" "}
                    {drive.eligibilityDepartments ||
                      "As specified by the placement office"}
                  </p>

                  {drive.minimumCgpa != null && (
                    <p>
                      Minimum CGPA: {drive.minimumCgpa}
                    </p>
                  )}
                </div>

                {drive.companyWebsite && (
                  <a
                    className="mt-3 inline-block text-sm text-indigo-600 underline"
                    href={drive.companyWebsite}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Company website
                  </a>
                )}

                <button
                  type="button"
                  disabled={isRegistered || deadlinePassed}
                  onClick={() => register(drive)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 size={17} />
                      Registered
                    </>
                  ) : deadlinePassed ? (
                    "Registration closed"
                  ) : (
                    "Register for placement"
                  )}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}