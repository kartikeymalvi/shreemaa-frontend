import React, { createContext, useState, useEffect, useContext } from "react";

// Context banaya
const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // Default values localStorage se lenge, warna default set karenge
  const [theme, setTheme] = useState(
    localStorage.getItem("app_theme") || "system",
  );
  const [density, setDensity] = useState(
    localStorage.getItem("table_density") || "comfortable",
  );

  // Jab bhi Theme change ho, HTML <html> tag par class lagao aur save karo
  useEffect(() => {
    localStorage.setItem("app_theme", theme);
    const root = document.documentElement;

    // Purani classes hatao
    root.classList.remove("light", "dark", "theme-blue", "theme-gray");

    if (theme === "system") {
      // System ki default theme check karo
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.add(systemPrefersDark ? "dark" : "light");
    } else {
      root.classList.add(
        theme === "dark"
          ? "dark"
          : theme === "blue"
            ? "theme-blue"
            : theme === "gray"
              ? "theme-gray"
              : "light",
      );
    }
  }, [theme]);

  // Jab bhi Density change ho, use save karo
  useEffect(() => {
    localStorage.setItem("table_density", density);
  }, [density]);

  return (
    <SettingsContext.Provider value={{ theme, setTheme, density, setDensity }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom Hook banaya taaki kisi bhi component me easily use kar sakein
export const useSettings = () => useContext(SettingsContext);
