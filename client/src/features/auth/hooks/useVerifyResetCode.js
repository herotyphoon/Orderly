import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../api/api.js";
import { verifyCodeSchema } from "../schemas/forgotPasswordSchema.js";

export const useVerifyResetCode = () => {
  const mutation = useMutation({
    mutationFn: async ({ email, code }) => {
      const { data } = await api.post("/auth/verify-reset-code", {
        email,
        code,
      });
      return data;
    },
  });

  const { register, handleSubmit, formState, reset, setValue } = useForm({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const { errors, isSubmitSuccessful } = formState;

  const onSubmit = (email) =>
    handleSubmit((values) => mutation.mutate({ email, code: values.code }));

  return {
    register,
    reset,
    isSubmitSuccessful,
    onSubmit,
    errors,
    mutation,
    setValue,
  };
};
