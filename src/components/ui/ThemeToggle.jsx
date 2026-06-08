"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const initialTheme =
        stored ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(initialTheme);
    } catch (_) {}
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch (_) {}

    const meta = document.querySelector('meta[name="color-scheme"]');
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      if (meta) meta.content = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      if (meta) meta.content = "light";
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2.5 rounded-xl bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-300 border border-border flex items-center justify-center cursor-pointer group active:scale-95 shadow-sm outline-none"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="size-4.5 text-amber-500 animate-spin-slow transition-transform group-hover:rotate-45" />
      ) : (
        <Moon className="size-4.5 text-indigo-500 transition-transform group-hover:-rotate-12" />
      )}
    </button>
  );
}
