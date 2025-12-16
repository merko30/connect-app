import {
  createThemedBaseStylesCreator,
  initThemeProvider,
  useStyle,
} from "@pavelgric/react-native-theme-provider";

const SPACING = {
  xl: 32,
  lg: 24,
  md: 16,
  sm: 12,
  xs: 8,
};

const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

/** Light theme: blue/green primary */
const lightTheme = {
  colors: {
    primary: "#3BC27D", // Dodger Blue
    secondary: "#2D88E5", // Lime Green
    background: "#FFFFFF",
    surface: "#F5F5F5",
    text: "#111111",
    accent: "#3BC27D", // Dark Turquoise
  },
  spacing: SPACING,
  radii: RADIUS,
};

/** Dark theme: blue/green primary */
const darkTheme = {
  colors: {
    primary: "#3BC27D", // Dodger Blue
    secondary: "#2D88E5", // Lime Green
    background: "#121212",
    surface: "#1E1E1E",
    text: "#EEEEEE",
    accent: "#3BC27D",
  },
  spacing: SPACING,
  radii: RADIUS,
};

/** Exported themes object */
export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

/** Type of themes for TS */
export type Themes = typeof themes;
export type Theme = typeof lightTheme;

/** Base globally available styles */
export const baseStylesCreator = createThemedBaseStylesCreator<Themes>()(
  (t) => ({
    page: {
      flex: 1,
      backgroundColor: t.colors.background,
    },
    flex: {
      flex: 1,
    },
    flexCenter: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  })
);

/** Init theme provider */
export const {
  createUseStyle,
  createStyle,
  useTheme,
  useThemeDispatch,
  ThemeProvider,
  useStyle: useStyleThemed,
  useStyleWithParams: useStyleThemedWithParams,
} = initThemeProvider({ themes, initialTheme: "light", baseStylesCreator });

/** Export plain useStyle if needed */
export { useStyle };
