import { handleApolloError } from "@/utils/error";
import { ApolloError, type useMutation } from "@apollo/client";
import type { ZodType } from "@repo/utils/schemas";
import { updateArticleSchema } from "@repo/utils/schemas/article";
import { loginSchema, registerSchema } from "@repo/utils/schemas/auth";
import type { ErrorResponse } from "react-router";

export type State = {
  success: boolean;
  payload?: FormData;
  error?: Record<string, string> | null;
};

async function handleMutation<TData, Output extends {}>(
  state: State,
  payload: FormData,
  mutation: ReturnType<typeof useMutation<TData>>[0],
  schema: ZodType<Output>,
  dataExtractor: (payload: FormData) => Record<string, FormDataEntryValue | null>,
): Promise<State> {
  try {
    // Extract data from payload
    const extractedData = dataExtractor(payload);

    // Validate form data with zod
    const parsed = schema.safeParse(extractedData);
    if (!parsed.success) {
      const errorObj = Object.fromEntries(
        parsed.error.errors.map((error) => [error.path[0] === "name" ? "username" : error.path[0], error.message]),
      );
      return { ...state, payload, error: errorObj };
    }

    // Perform the mutation
    const { data, errors } = await mutation({ variables: parsed.data });

    // Handle errors from the mutation
    if (errors) {
      const errorMessage = errors.map((error) => error.message).join(", ");
      return {
        ...state,
        payload,
        error: { message: errorMessage, name: "GraphQL Error" },
      };
    }

    // Handle successful response
    if (data) {
      return { ...state, payload, error: null, success: true };
    }

    // Handle case where data is undefined
    return {
      ...state,
      payload,
      error: { message: "An unknown error occurred", name: "Unknown Error" },
    };
  } catch (error: unknown) {
    let apolloError: ErrorResponse | undefined;
    if (error instanceof ApolloError) {
      apolloError = handleApolloError(error);
    }

    return {
      ...state,
      payload,
      error: {
        message: apolloError?.data?.message || "An unknown error occurred",
        name: apolloError?.data?.name || "Unknown Error",
      },
    };
  }
}

export async function signInUser<TData>(
  state: State,
  payload: FormData,
  mutation: ReturnType<typeof useMutation<TData>>[0],
): Promise<State> {
  return handleMutation(state, payload, mutation, loginSchema, (payload: FormData) => ({
    email: payload.get("email"),
    password: payload.get("password"),
  }));
}

export async function signUpUser<TData>(
  state: State,
  payload: FormData,
  mutation: ReturnType<typeof useMutation<TData>>[0],
): Promise<State> {
  return handleMutation(state, payload, mutation, registerSchema, (payload: FormData) => ({
    name: payload.get("username"),
    email: payload.get("email"),
    password: payload.get("password"),
  }));
}

export async function updateArticle<TData>(
  state: State,
  payload: FormData,
  mutation: ReturnType<typeof useMutation<TData>>[0],
): Promise<State> {
  return handleMutation(state, payload, mutation, updateArticleSchema, (payload: FormData) => ({
    title: payload.get("title"),
    content: payload.get("content"),
  }));
}
