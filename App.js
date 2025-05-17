import React from "react";
import { ThemeProvider } from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import { colors } from "./src/infrastructure/theme/colors";
import { Navigation } from "./src/infrastructure/navigation/index";
import { ThemeContextProvider, ThemeContext } from "./src/infrastructure/theme/theme.context";

export default function App() {
  return (
    <ThemeContextProvider>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <>
            <ThemeProvider theme={theme}>
              <Navigation />
            </ThemeProvider>
            <StatusBar style={theme.colors.bg.primary === "#22223b" ? "light" : "dark"} backgroundColor={theme.colors.bg.primary} />
          </>
        )}
      </ThemeContext.Consumer>
    </ThemeContextProvider>
  );
}
