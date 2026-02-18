import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getSystemTheme } from "../utils/getSystemTheme.js";

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "light" || getSystemTheme(),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }),
    { name: "theme-store" },
  ),
);
