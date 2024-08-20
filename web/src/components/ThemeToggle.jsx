import React, { useState, useEffect } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") || "light";
    setIsDarkMode(currentTheme === "dark");
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
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
        // <span className="material-icons">dark_mode</span>
        <IconMoon stroke={2} />
      ) : (
        // <span className="material-icons"></span>
        <IconSun stroke={2} />
      )}
    </button>
  );
};

export default ThemeToggle;
