import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { scan } from "react-scan";
import { ThemeProvider } from "./providers/theme";
import "./styles/globals.css";
import { RouterProvider } from "react-router";
import { router } from "./routes";

scan({
  enabled: true,
});

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
