"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode === null) return;
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  if (isDarkMode === null) return null;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      data-mode={isDarkMode ? "dark" : "light"}
      className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 text-white/60 hover:text-white hover:bg-white/10 active:scale-95"
    >
      <div className="flex items-center justify-center">
        {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
      </div>
    </button>
  );
}