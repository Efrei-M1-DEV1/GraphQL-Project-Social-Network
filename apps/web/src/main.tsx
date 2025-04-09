import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router"; // ensure using react-router-dom 6.4+
import { scan } from "react-scan"; // must be imported before React and React DOM
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

if (!import.meta.env.VITE_GRAPHQL_ENDPOINT) {
  throw new Error("VITE_GRAPHQL_ENDPOINT is not defined, please set it in your .env file");
}

const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

createRoot(root).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>,
);
