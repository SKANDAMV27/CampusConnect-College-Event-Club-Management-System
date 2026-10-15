import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Search,
  TrendingUp,
} from "lucide-react";

import Swal from "sweetalert2";
import { apiFetch } from "../../api/api";

function MyMarks() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (semester) params.set("semester", semester);
      if (academicYear) params.set("academicYear", academicYear);

      const query = params.toString();

      const data = await apiFetch(
        `/student/marks${query ? `?${query}` : ""}`
      );

      setMarks(Array.isArray(data) ? data : []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to load results",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [semester, academicYear]);

  useEffect(() => {
    load();
  }, [load]);

  const summary = useMemo(() => {
    const total = marks.reduce(
      (sum, mark) => sum + Number(mark.totalMarks || 0),
      0
    );

    const max = marks.reduce(
      (sum, mark) => sum + Number(mark.totalMaxMarks || 0),
      0
    );

    return {
      total,
      max,
      percentage: max
        ? Math.round((total * 10000) / max) / 100
        : 0,
      passed: marks.filter(
        (mark) => mark.resultStatus === "PASS"
      ).length,
      failed: marks.filter(
        (mark) => mark.resultStatus === "FAIL"
      ).length,
    };
  }, [marks]);

  const years = [
    ...new Set(marks.map((mark) => mark.academicYear)),
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-600 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
              Student portal
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              My Academic Results
            </h1>

            <p className="mt-2 max-w-xl text-sm text-blue-100">
              Review your published subject-wise marks and academic
              performance.
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <GraduationCap size={30} />
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Subjects published",
            value: marks.length,
            icon: BookOpen,
          },
          {
            label: "Overall percentage",
            value: `${summary.percentage}%`,
            icon: TrendingUp,
          },
          {
            label: "Subjects passed",
            value: summary.passed,
            icon: CheckCircle2,
          },
          {
            label: "Total marks",
            value: `${summary.total}/${summary.max}`,
            icon: Award,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{label}</span>

              <span className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                <Icon size={19} />
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Results table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Subject-wise marks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Only results published by the administrator are shown.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
              value={semester}
              onChange={(event) => setSemester(event.target.value)}
            >
              <option value="">All semesters</option>

              {Array.from({ length: 8 }, (_, index) => (
                <option key={index + 1} value={String(index + 1)}>
                  Semester {index + 1}
                </option>
              ))}
            </select>

            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
              value={academicYear}
              onChange={(event) => setAcademicYear(event.target.value)}
            >
              <option value="">All academic years</option>

              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading your results...
          </div>
        ) : marks.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={25} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              No published results yet
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              Your marks will appear here after the administrator publishes
              them. Draft marks remain private.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {[
                    "Subject",
                    "Semester",
                    "Internal",
                    "External",
                    "Total",
                    "Percentage",
                    "Grade",
                    "Result",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 font-semibold"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {marks.map((mark) => (
                  <tr
                    key={mark.id}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {mark.subjectName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {mark.subjectCode} · {mark.examType}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p>Semester {mark.semester}</p>
                      <p className="text-xs text-slate-500">
                        {mark.academicYear}
                      </p>
                    </td>

                    <td className="px-5 py-4 tabular-nums">
                      {mark.internalMarks}/{mark.internalMaxMarks}
                    </td>

                    <td className="px-5 py-4 tabular-nums">
                      {mark.externalMarks}/{mark.externalMaxMarks}
                    </td>

                    <td className="px-5 py-4 font-bold tabular-nums text-slate-900">
                      {mark.totalMarks}/{mark.totalMaxMarks}
                    </td>

                    <td className="px-5 py-4">
                      {mark.percentage}%
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-indigo-50 px-2.5 py-1 font-bold text-indigo-700">
                        {mark.grade}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          mark.resultStatus === "PASS"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {mark.resultStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && marks.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            Totals are calculated from your published marks. Confirm your
            college's grading rules with your department.
          </div>
        )}
      </section>
    </div>
  );
}

export default MyMarks;