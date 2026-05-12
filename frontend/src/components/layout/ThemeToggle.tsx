"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import styles from "@/src/styles/layout/theme-toggle.module.css";

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

  if (isDarkMode === null) return null;

  return (
    <button
      onClick={() => setIsDarkMode(prev => !prev)}
      aria-label="Toggle theme"
      className={styles.toggle}
    >
      <div className={styles.icon}>
        {isDarkMode ? <Moon /> : <Sun />}
      </div>
    </button>
  );
}