import { useMutation } from "@tanstack/react-query";
import { api } from "../../../api/api.js";
import { useAuthStore } from "../../../store/useAuthStore.js";

export const useAuthMutation = (endpoint) => {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (values) => {
      const { data } = await api.post(endpoint, values);
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
    },
  });
};
