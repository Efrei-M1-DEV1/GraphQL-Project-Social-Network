import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { scan } from "react-scan";
import { ThemeProvider } from "./providers/theme";
import { router } from "./routes";
import "./styles/globals.css";

scan({
  enabled: true,
});

const client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql",
  cache: new InMemoryCache(),
});

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>,
);
