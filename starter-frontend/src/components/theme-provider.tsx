"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
     children: React.ReactNode;
     defaultTheme?: Theme;
     storageKey?: string;
}

interface ThemeProviderState {
     theme: Theme;
     setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
     children,
     defaultTheme = "system",
     storageKey = "starter-app-theme",
     ...props
}: ThemeProviderProps) {
     const [theme, setThemeState] = useState<Theme>(defaultTheme);

     useEffect(() => {
          if (typeof window !== "undefined") {
               const savedTheme = localStorage.getItem(storageKey) as Theme | null;
               if (savedTheme) {
                    setThemeState(savedTheme);
               }
          }
     }, [storageKey]);

     useEffect(() => {
          const root = window.document.documentElement;
          root.classList.remove("light", "dark");

          if (theme === "system") {
               const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";
               root.classList.add(systemTheme);
               return;
          }

          root.classList.add(theme);
     }, [theme]);

     useEffect(() => {
          if (theme !== "system") return;

          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          const handleChange = () => {
               const root = window.document.documentElement;
               root.classList.remove("light", "dark");
               const newSystemTheme = mediaQuery.matches ? "dark" : "light";
               root.classList.add(newSystemTheme);
          };

          mediaQuery.addEventListener("change", handleChange);
          return () => mediaQuery.removeEventListener("change", handleChange);
     }, [theme]);

     const setTheme = (theme: Theme) => {
          if (typeof window !== "undefined") {
               localStorage.setItem(storageKey, theme);
          }
          setThemeState(theme);
     };

     return (
          <ThemeProviderContext.Provider value={{ theme, setTheme }} {...props}>
               {children}
          </ThemeProviderContext.Provider>
     );
}

export const useTheme = () => {
     const context = useContext(ThemeProviderContext);
     if (context === undefined) {
          throw new Error("useTheme must be used within a ThemeProvider");
     }
     return context;
};
