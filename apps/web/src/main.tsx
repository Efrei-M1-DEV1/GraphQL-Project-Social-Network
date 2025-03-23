import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router";
import { scan } from "react-scan";
import { store } from "./app/store";
import { ThemeProvider } from "./providers/theme";
import { router } from "./routes";
import "./styles/globals.css";

scan({
  enabled: true,
});

const root = document.getElementById("root");
if (!root) {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  );
}
createRoot(root).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>,
);
