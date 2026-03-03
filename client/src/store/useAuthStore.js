import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user }),

  setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),

  logout: () => set({ user: null, isAuthenticated: false }),
}));
