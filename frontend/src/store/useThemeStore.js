import { create } from "zustand";

const getInitialTheme = () =>
  document.documentElement.getAttribute("data-theme") || "dark";

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => set(() => ({ theme })),
}));
