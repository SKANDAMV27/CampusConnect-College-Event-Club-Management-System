const API_BASE_URL = "http://localhost:8080/api";

export async function apiFetch(path, options = {}) {

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers,
    }
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {

    throw new Error(
      data?.message ||
      data?.error ||
      (typeof data === "string"
        ? data
        : "Request failed")
    );
  }

  return data;
}

export default API_BASE_URL;