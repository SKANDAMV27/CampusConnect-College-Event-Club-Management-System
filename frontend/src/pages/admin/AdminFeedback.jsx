import { useEffect, useMemo, useState } from "react";
import {
  MessageSquareText,
  Search,
  Star,
  Users,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";

import {
  getFeedbackEvents,
  getEventFeedback,
} from "../../api/adminApi";

const questions = [
  "Overall quality of the event?",
  "How was the event organization?",
  "How would you rate the content/session quality?",
  "How knowledgeable was the speaker/resource person?",
  "How clear was the presentation?",
  "How relevant was the event to your academic/career goals?",
  "How would you rate the venue/facilities?",
  "How was the time management?",
  "How engaging and interactive was the event?",
  "How likely are you to recommend similar events?",
];

const AdminFeedback = () => {
  const [events, setEvents] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const [selectedEventId, setSelectedEventId] = useState("");

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedFeedback, setSelectedFeedback] =
    useState(null);

  // =====================================================
  // LOAD EVENTS
  // =====================================================

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoadingEvents(true);

        const response = await getFeedbackEvents();

        const eventList = Array.isArray(response)
          ? response
          : response?.content ||
            response?.data ||
            [];

        setEvents(eventList);

        if (eventList.length > 0) {
          setSelectedEventId(
            String(eventList[0].id)
          );
        }
      } catch (error) {
        console.error(
          "Failed to load feedback events:",
          error
        );

        Swal.fire({
          icon: "error",
          title: "Failed to Load Events",
          text:
            error?.message ||
            "Unable to load events.",
        });
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  // =====================================================
  // LOAD FEEDBACK
  // =====================================================

  useEffect(() => {
    if (!selectedEventId) {
      setFeedback([]);
      return;
    }

    const loadFeedback = async () => {
      try {
        setLoadingFeedback(true);

        const response = await getEventFeedback(
          selectedEventId
        );

        const feedbackList = Array.isArray(response)
          ? response
          : response?.content ||
            response?.data ||
            [];

        setFeedback(feedbackList);
      } catch (error) {
        console.error(
          "Failed to load feedback:",
          error
        );

        setFeedback([]);

        Swal.fire({
          icon: "error",
          title: "Failed to Load Feedback",
          text:
            error?.message ||
            "Unable to load feedback.",
        });
      } finally {
        setLoadingFeedback(false);
      }
    };

    loadFeedback();
  }, [selectedEventId]);

  // =====================================================
  // CALCULATE INDIVIDUAL AVERAGE
  // =====================================================

  const calculateAverage = (item) => {
    const ratings = Array.from(
      { length: 10 },
      (_, index) =>
        Number(
          item[`question${index + 1}Rating`]
        ) || 0
    );

    const validRatings = ratings.filter(
      (rating) => rating > 0
    );

    if (validRatings.length === 0) {
      return 0;
    }

    const total = validRatings.reduce(
      (sum, rating) => sum + rating,
      0
    );

    return total / validRatings.length;
  };

  // =====================================================
  // FILTER FEEDBACK
  // =====================================================

  const filteredFeedback = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    if (!searchValue) {
      return feedback;
    }

    return feedback.filter((item) => {
      const studentName =
        item.studentName?.toLowerCase() || "";

      const studentUsn =
        item.studentUsn?.toLowerCase() || "";

      return (
        studentName.includes(searchValue) ||
        studentUsn.includes(searchValue)
      );
    });
  }, [feedback, search]);

  // =====================================================
  // OVERALL AVERAGE
  // =====================================================

  const overallAverage = useMemo(() => {
    if (feedback.length === 0) {
      return 0;
    }

    const total = feedback.reduce(
      (sum, item) =>
        sum + calculateAverage(item),
      0
    );

    return total / feedback.length;
  }, [feedback]);

  // =====================================================
  // SELECTED EVENT
  // =====================================================

  const selectedEvent = events.find(
    (event) =>
      String(event.id) ===
      String(selectedEventId)
  );

  return (
    <div className="space-y-6">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <MessageSquareText
              size={26}
              className="text-blue-600"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Event Feedback
            </h1>

            <p className="text-sm text-gray-500">
              View feedback submitted by students
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          EVENT SELECTOR
      ================================================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Select Event
        </label>

        {loadingEvents ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2
              size={18}
              className="animate-spin"
            />

            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
            No events are available.
          </div>
        ) : (
          <select
            value={selectedEventId}
            onChange={(e) =>
              setSelectedEventId(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              Select an event
            </option>

            {events.map((event) => (
              <option
                key={event.id}
                value={event.id}
              >
                {event.title ||
                  event.eventTitle ||
                  `Event #${event.id}`}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      {selectedEventId && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Total Responses */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Responses
                </p>

                <h2 className="mt-1 text-3xl font-bold text-gray-900">
                  {feedback.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Users
                  size={24}
                  className="text-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Average Rating
                </p>

                <h2 className="mt-1 text-3xl font-bold text-gray-900">
                  {overallAverage.toFixed(1)}

                  <span className="text-base font-normal text-gray-400">
                    {" "}
                    / 10
                  </span>
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                <Star
                  size={24}
                  className="fill-yellow-500 text-yellow-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          FEEDBACK TABLE
      ================================================= */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Table Header */}
        <div className="border-b border-gray-200 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Submitted Feedback
              </h2>

              {selectedEvent && (
                <p className="mt-1 text-sm text-gray-500">
                  {selectedEvent.title ||
                    selectedEvent.eventTitle}
                </p>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search student or USN..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Loading */}
        {loadingFeedback ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <Loader2
              size={22}
              className="mr-2 animate-spin"
            />

            Loading feedback...
          </div>
        ) : filteredFeedback.length === 0 ? (
          /* Empty */
          <div className="py-16 text-center">
            <MessageSquareText
              size={42}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-4 text-lg font-semibold text-gray-700">
              No Feedback Found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              No students have submitted feedback for
              this event yet.
            </p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">
                    Student
                  </th>

                  <th className="px-6 py-4">
                    USN
                  </th>

                  <th className="px-6 py-4">
                    Rating
                  </th>

                  <th className="px-6 py-4">
                    Submitted
                  </th>

                  <th className="px-6 py-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredFeedback.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.studentName ||
                        "Unknown Student"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {item.studentUsn || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 font-semibold text-yellow-700">
                        <Star
                          size={14}
                          className="fill-yellow-500 text-yellow-500"
                        />

                        {calculateAverage(item).toFixed(
                          1
                        )}
                        /10
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {item.submittedAt
                        ? new Date(
                            item.submittedAt
                          ).toLocaleString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFeedback(item)
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                      >
                        <Eye size={16} />

                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =================================================
          FEEDBACK DETAILS MODAL
      ================================================= */}

      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Feedback Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedFeedback.studentName ||
                    "Unknown Student"}

                  {" • "}

                  {selectedFeedback.studentUsn ||
                    "-"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedFeedback(null)
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            {/* Questions */}
            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
              {questions.map((question, index) => {
                const rating =
                  selectedFeedback[
                    `question${index + 1}Rating`
                  ];

                return (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <p className="text-sm font-medium text-gray-700">
                      {index + 1}. {question}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <Star
                        size={18}
                        className="fill-yellow-500 text-yellow-500"
                      />

                      <span className="text-lg font-bold text-gray-900">
                        {rating || 0}
                      </span>

                      <span className="text-sm text-gray-400">
                        / 10
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Description */}
            <div className="px-6 pb-6">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Additional Comments
              </h3>

              <div className="rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                {selectedFeedback.description ||
                  "No additional comments provided."}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  setSelectedFeedback(null)
                }
                className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;