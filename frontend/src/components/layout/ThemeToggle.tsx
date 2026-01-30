"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  iconWrapper?: string;
}

export default function ThemeToggle({ className, iconWrapper }: ThemeToggleProps) {
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
      className={className}
      aria-label="Toggle theme"
      data-mode={isDarkMode ? "dark" : "light"}
    >
      <div className={iconWrapper}>
        {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
      </div>
    </button>
  );
}