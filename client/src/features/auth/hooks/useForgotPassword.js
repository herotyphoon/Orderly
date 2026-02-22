import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../api/api.js";
import { forgotPasswordSchema } from "../schemas/forgotPasswordSchema.js";

export const useForgotPassword = () => {
  const mutation = useMutation({
    mutationFn: async (values) => {
      const { data } = await api.post("/auth/forgot-password", values);
      return data;
    },
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { errors, isSubmitSuccessful } = formState;

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return {
    register,
    reset,
    isSubmitSuccessful,
    onSubmit,
    errors,
    mutation,
  };
};
