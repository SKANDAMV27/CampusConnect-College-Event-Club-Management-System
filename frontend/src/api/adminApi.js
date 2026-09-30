import { apiFetch } from "./api";

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