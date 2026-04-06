import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeProvider, useThemeDispatch } from "@/theme";

export type AppearanceMode = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

export const APPEARANCE_MODE_STORAGE_KEY = "appearance-mode";
export const APPEARANCE_OPTIONS: AppearanceMode[] = ["system", "light", "dark"];

interface AppearanceContextValue {
  mode: AppearanceMode;
  resolvedTheme: ResolvedTheme;
  setMode: (nextMode: AppearanceMode) => Promise<void>;
}

const AppearanceContext = createContext<AppearanceContextValue | undefined>(
  undefined,
);

function isAppearanceMode(value: string | null): value is AppearanceMode {
  return !!value && APPEARANCE_OPTIONS.includes(value as AppearanceMode);
}

function ThemeSync({
  children,
  resolvedTheme,
}: PropsWithChildren<{ resolvedTheme: ResolvedTheme }>) {
  const { setTheme } = useThemeDispatch();

  useEffect(() => {
    setTheme(resolvedTheme);
  }, [resolvedTheme, setTheme]);

  return <>{children}</>;
}

export function AppearanceProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<AppearanceMode>("system");

  useEffect(() => {
    let isMounted = true;

    const loadMode = async () => {
      const storedMode = await AsyncStorage.getItem(
        APPEARANCE_MODE_STORAGE_KEY,
      );

      if (isMounted && isAppearanceMode(storedMode)) {
        setModeState(storedMode);
      }
    };

    void loadMode();

    return () => {
      isMounted = false;
    };
  }, []);

  const setMode = useCallback(async (nextMode: AppearanceMode) => {
    setModeState(nextMode);
    await AsyncStorage.setItem(APPEARANCE_MODE_STORAGE_KEY, nextMode);
  }, []);

  const resolvedTheme: ResolvedTheme =
    mode === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : mode;

  const value = useMemo(
    () => ({ mode, resolvedTheme, setMode }),
    [mode, resolvedTheme, setMode],
  );

  return (
    <AppearanceContext.Provider value={value}>
      <ThemeProvider initialTheme={resolvedTheme}>
        <ThemeSync resolvedTheme={resolvedTheme}>{children}</ThemeSync>
      </ThemeProvider>
    </AppearanceContext.Provider>
  );
}

export function useAppearanceSettings() {
  const context = useContext(AppearanceContext);

  if (!context) {
    throw new Error(
      "useAppearanceSettings must be used within an AppearanceProvider",
    );
  }

  return context;
}
