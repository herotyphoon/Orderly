import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAuthMutation } from "./useAuthMutation.js";

export const useAuth = (endpoint, schema) => {
  const mutation = useAuthMutation(endpoint);

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { errors } = formState;

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return {
    register,
    onSubmit,
    errors,
    mutation,
  };
};
