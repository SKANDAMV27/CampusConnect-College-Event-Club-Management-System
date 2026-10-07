import { apiFetch } from "./api";

export const getStudentDashboard = () => {
  return apiFetch("/student/dashboard");
};

export const getStudentEvents = ({
  page = 0,
  size = 10,
  search = "",
} = {}) => {

  const params = new URLSearchParams();

  params.set("page", page);
  params.set("size", size);

  if (search.trim()) {
    params.set("search", search.trim());
  }

  return apiFetch(`/student/events?${params.toString()}`);
};

export const getStudentEvent = (id) => {
  return apiFetch(`/student/events/${id}`);
};

export const registerForEvent = (eventId) => {
  return apiFetch(`/student/events/${eventId}/register`, {
    method: "POST",
  });
};

export const getMyRegistrations = () => {
  return apiFetch("/student/registrations");
};

export const cancelRegistration = (registrationId) => {
  return apiFetch(
    `/student/registrations/${registrationId}`,
    {
      method: "DELETE",
    }
  );
};

export const getStudentProfile = () => {
  return apiFetch("/student/profile");
};

export const updateStudentProfile = (data) => {
  return apiFetch("/student/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const submitEventFeedback = async (
  eventId,
  feedback
) => {
  return apiFetch(
    `/student/events/${eventId}/feedback`,
    {
      method: "POST",
      body: JSON.stringify(feedback),
    }
  );
};

export const getEventFeedbackStatus = async (
  eventId
) => {
  return apiFetch(
    `/student/events/${eventId}/feedback`
  );
};