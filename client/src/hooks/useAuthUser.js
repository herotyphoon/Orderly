import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../api/auth";

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
