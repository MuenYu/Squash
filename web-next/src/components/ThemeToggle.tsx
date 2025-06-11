"use client"

import React, { useState, useEffect } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";

type Theme = "light" | "dark";

const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const currentTheme = (localStorage.getItem("theme") as Theme) || "light";
    setIsDarkMode(currentTheme === "dark");
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, []);

  const toggleTheme = (): void => {
    const newTheme: Theme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <button
      className="btn btn-circle btn-ghost fixed bottom-10 right-10"
      onClick={toggleTheme}
    >
      {isDarkMode ? (
        <IconMoon stroke={2} />
      ) : (
        <IconSun stroke={2} />
      )}
    </button>
  );
};

export default ThemeToggle;
