import {
  createTheme,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueenProvider } from "./context/QueenProvider.tsx";
const theme = createTheme({ palette: { mode: "dark" } });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueenProvider>
          <App />
        </QueenProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
