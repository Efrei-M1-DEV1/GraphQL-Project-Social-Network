import type { ApolloError, ServerError } from "@apollo/client";
import type { ErrorResponse } from "react-router";

export function handleApolloError(err: ApolloError): ErrorResponse {
  let errorMessage = "An unknown error occurred";

  if (err.graphQLErrors.length > 0) {
    // Handle GraphQL errors
    errorMessage = `${err.graphQLErrors.map((error) => error.message).join(", ")}`;
    return {
      status: 400,
      statusText: "Bad Request",
      data: {
        message: errorMessage,
        name: "GraphQL Error",
      },
    };
  }

  if (err.networkError) {
    const response = "response" in err.networkError ? err.networkError.response : null;
    const status = response?.status || 500;
    const statusText = response?.statusText || "Internal Server Error";

    switch (err.networkError?.name) {
      case "ServerError": {
        const serverError = err.networkError as ServerError;
        // Handle server errors
        if (
          typeof serverError.result === "object" &&
          "errors" in serverError.result &&
          Array.isArray(serverError.result.errors)
        ) {
          // Handle specific server errors
          errorMessage = `${serverError.result.errors.map((error) => error.message).join(", ")}`;
          return {
            status,
            statusText,
            data: {
              message: errorMessage,
              name: serverError.name,
            },
          };
        }
        break;
      }
      default: {
        // Handle other network errors
        errorMessage = `${err.networkError?.message}`;
        return {
          status,
          statusText,
          data: {
            message: errorMessage,
            name: "Network error",
          },
        };
      }
    }
  }

  return {
    status: 500,
    statusText: "Internal Server Error",
    data: {
      message: errorMessage,
      name: "Apollo Error",
    },
  };
}
