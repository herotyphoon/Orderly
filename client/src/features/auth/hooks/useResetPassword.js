import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../api/api.js";
import { resetPasswordSchema } from "../schemas/forgotPasswordSchema.js";

export const useResetPassword = () => {
  const mutation = useMutation({
    mutationFn: async ({ email, code, password }) => {
      const { data } = await api.post("/auth/reset-password", {
        email,
        code,
        password,
      });
      return data;
    },
  });

  const { register, handleSubmit, formState, reset, watch } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { errors, isSubmitSuccessful } = formState;

  const onSubmit = (email, code) =>
    handleSubmit((values) =>
      mutation.mutate({ email, code, password: values.password }),
    );

  return {
    register,
    reset,
    isSubmitSuccessful,
    onSubmit,
    errors,
    mutation,
    watch,
  };
};
