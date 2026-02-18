import { api } from "./api.js";

export const fetchMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
