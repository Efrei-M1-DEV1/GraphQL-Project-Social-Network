import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, from, fromPromise } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { scan } from "react-scan"; // must be imported before React and React DOM
import { ThemeProvider } from "./providers/theme";
import { router } from "./routes";
import "./styles/globals.css";
import type { Callable } from "@repo/utils/types";
import { graphql } from "./gql";

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

// GraphQL mutation for refreshing the token
const REFRESH_TOKEN = graphql(`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      token
      refreshToken
    }
  }
`);

// Create HttpLink for GraphQL API
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
});

// Create a function to handle token refresh
let isRefreshing = false;
let pendingRequests: Callable[] = [];

const resolvePendingRequests = () => {
  for (const callback of pendingRequests) {
    callback();
  }
  pendingRequests = [];
};

// Setup error handling link to intercept authentication errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      // Handle authentication errors
      if (err.extensions?.code === "UNAUTHENTICATED" || err.message.includes("Unauthorized")) {
        if (!isRefreshing) {
          isRefreshing = true;

          // Get refreshToken from localStorage
          const refreshToken = localStorage.getItem("refreshToken");

          if (!refreshToken) {
            // No refresh token means we can't recover the session
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/auth/login";
            return forward(operation); // Return the operation to prevent errors
          }

          // Try to get a new token pair using the refresh token
          return fromPromise(
            client
              .mutate({
                mutation: REFRESH_TOKEN,
                variables: {
                  token: refreshToken,
                },
              })
              .then(({ data }) => {
                // Success - store new tokens
                const { token, refreshToken: newRefreshToken } = data.refreshToken;
                localStorage.setItem("token", token);
                localStorage.setItem("refreshToken", newRefreshToken);

                // Retry all pending requests with the new token
                resolvePendingRequests();
              })
              .catch((error) => {
                // Refresh token is invalid, clear auth and redirect to login
                // biome-ignore lint/suspicious/noConsole: <explanation>
                console.error("Error refreshing token:", error);
                pendingRequests = [];
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                window.location.href = "/auth/login";
              })
              .finally(() => {
                isRefreshing = false;
              }),
          ).flatMap(() => {
            // Return the forward operation after token refresh
            return forward(operation);
          });
        }

        // If we're already refreshing, queue this request
        return fromPromise(
          new Promise<void>((resolve) => {
            pendingRequests.push(() => resolve());
          }),
        ).flatMap(() => {
          // Correctly return the forward operation
          return forward(operation);
        });
      }
    }
  }

  // Handle network errors
  if (networkError) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(`[Network Error]: ${networkError}`);
  }

  // Return the forward operation to continue the request
  return forward(operation);
});
// Authentication link to add headers to every request
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create Apollo Client
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

// App render
createRoot(root).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>,
);
