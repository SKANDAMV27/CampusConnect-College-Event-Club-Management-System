import API_BASE_URL from "./api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
        ...(options.headers || {}),
      },
    }
  );

  const contentType =
    response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.error;

    throw new Error(
      message || `Request failed (${response.status})`
    );
  }

  return data;
}

export const getPlacementStudents = () =>
  request("/admin/placements/students");

export const getAdminPlacementDrives = () =>
  request("/admin/placements");

export const createPlacementDrive = (payload) =>
  request("/admin/placements", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getPlacementRegistrations = (driveId) =>
  request(`/admin/placements/${driveId}/registrations`);

export const updatePlacementRegistration = (
  driveId,
  registrationId,
  payload
) =>
  request(
    `/admin/placements/${driveId}/registrations/${registrationId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );

export const getStudentPlacementDrives = () =>
  request("/student/placements");

export const registerForPlacement = (driveId) =>
  request(`/student/placements/${driveId}/register`, {
    method: "POST",
  });