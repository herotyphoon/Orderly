import { useMutation } from "@tanstack/react-query";
import { api } from "../../../api/api.js";

export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: async (email) => {
      const res = await api.post("/auth/resend-verification", { email });
      return res.data;
    },
    retry: false,
  });
};
