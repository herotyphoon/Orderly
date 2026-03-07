import { useMutation } from "@tanstack/react-query";
import { api } from "../../../api/api.js";

export const useResendResetCode = () => {
  return useMutation({
    mutationFn: async (email) => {
      const res = await api.post("/auth/resend-reset-code", { email });
      return res.data;
    },
    retry: false,
  });
};
