import { apiFetch } from "./api";

// =====================================================
// ADMIN EVENTS
// =====================================================

export const getAdminEvents = async ({
  page = 0,
  size = 10,
  search = "",
  status = "",
} = {}) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("size", size);

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (status) {
    params.append("status", status);
  }

  return await apiFetch(
    `/admin/events?${params.toString()}`
  );
};


// =====================================================
// FEEDBACK EVENTS
// =====================================================

export const getFeedbackEvents = async () => {
  return await apiFetch(
    "/admin/feedback/events"
  );
};


// =====================================================
// FEEDBACK FOR SELECTED EVENT
// =====================================================

export const getEventFeedback = async (
  eventId
) => {
  if (!eventId) {
    throw new Error(
      "Event ID is required"
    );
  }

  return await apiFetch(
    `/admin/feedback/events/${eventId}`
  );
};

