import { useMutation } from "@tanstack/react-query";
import { api } from "../../../api/api.js";

export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: async (email) => {
      const res = await api.post("/auth/resend-verification", {
        email,
      });

      return res.data;
    },

    retry: false,

    onError: (err) => {
      console.error("Resend verification error:", err?.response?.data || err);
    },
  });
};
