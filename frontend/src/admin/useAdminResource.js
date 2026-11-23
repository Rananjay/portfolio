import useSWR from "swr";
import { apiFetch, authedFetcher } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function useAdminResource(resource) {
  const { token } = useAuth();
  const { data, error, isLoading, mutate } = useSWR(
    token ? [`/${resource}`, token] : null,
    authedFetcher,
  );

  async function request(path, method, body) {
    const result = await apiFetch(`/${resource}${path}`, { token, method, body });
    await mutate();
    return result;
  }

  return {
    records: data || [],
    error,
    isLoading,
    create: body => request("", "POST", body),
    update: (id, body) => request(`/${id}`, "PUT", body),
    remove: id => request(`/${id}`, "DELETE"),
  };
}
