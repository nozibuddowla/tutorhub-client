import { useEffect, useState } from "react";

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    // SSR guard
    if (typeof window === "undefined") return false;

    const stored = localStorage.getItem("tutorhub-theme");
    if (stored) return stored === "dark";

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("tutorhub-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      localStorage.setItem("tutorhub-theme", "light");
    }
  }, [isDark]);

  // Sync with system preference changes (only if user hasn't made a choice)
  useEffect(() => {
    const stored = localStorage.getItem("tutorhub-theme");
    if (stored) return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = () => setIsDark((prev) => !prev);

  return { isDark, toggle };
};

export default useDarkMode;
