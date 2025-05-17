import React, { createContext, useState, useMemo } from "react";
import { theme as baseTheme } from "./index";

export const ThemeContext = createContext({
  mode: "light",
  setMode: () => {},
  customColor: baseTheme.colors.bg.primary,
  setCustomColor: () => {},
});

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState("light");
  const [customColor, setCustomColor] = useState(baseTheme.colors.bg.primary);

  // Tạo theme mới dựa trên mode và customColor
  const theme = useMemo(() => {
    const t = { ...baseTheme };
    t.colors = { ...t.colors };

    if (mode === "dark") {
      // Luôn dùng màu nền đen và chữ trắng cho dark mode
      t.colors.bg = { primary: "#181a20" };
      t.colors.ui = {
        primary: "#23262f",
        secondary: "#23262f",
      };
      t.colors.text = {
        primary: "#fff",
        secondary: "#ccc",
        disabled: "#888",
        error: "tomato",
        link: "#ffb86c",
      };
    } else {
      t.colors.bg = { primary: customColor || "#fff" };
      t.colors.ui = {
        primary: "#f5f5f5",
        secondary: "#e0e0e0",
      };
      t.colors.text = {
        primary: "#222",
        secondary: "#555",
        disabled: "#aaa",
        error: "tomato",
        link: "tomato",
      };
    }
    return t;
  }, [mode, customColor]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, customColor, setCustomColor, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
