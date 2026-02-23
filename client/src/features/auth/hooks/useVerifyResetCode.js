import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../api/api.js";
import { verifyCodeSchema } from "../schemas/forgotPasswordSchema.js";

export const useVerifyResetCode = (email) => {
  const mutation = useMutation({
    mutationFn: async ({ code }) => {
      const { data } = await api.post("/auth/verify-reset-code", {
        email,
        code,
      });
      return data;
    },
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = handleSubmit(({ code }) => {
    mutation.mutate({ code });
  });

  return {
    onSubmit,
    setValue,
    reset,
    mutation,
    errors,
  };
};
