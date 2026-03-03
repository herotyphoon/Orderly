import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { completeProfileSchema } from "../schemas/completeProfileSchema.js";
import { useAuthStore } from "../../../store/useAuthStore.js";
import { api } from "../../../api/api.js";

export const useSetupProfile = ({ token }) => {
  const navigate = useNavigate();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  const mutation = useMutation({
    mutationFn: async ({ token, fullName }) => {
      const res = await api.post("/auth/setup-profile", {
        token,
        fullName,
      });
      return res.data;
    },
    retry: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      fullName: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(
      { token, fullName: data.fullName },
      {
        onSuccess: () => {
          setAuthenticated(true);
          navigate("/dashboard");
        },
      },
    );
  });

  return { mutation, register, onSubmit, errors };
};
