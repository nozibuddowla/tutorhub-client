import { useEffect, useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

const useDarkMode = () => {
  const [isDark, setIsDark] = useLocalStorage("tutorhub-theme", false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((prev) => !prev), [setIsDark]);

  return { isDark, toggle };
};

export default useDarkMode;
