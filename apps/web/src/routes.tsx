import ErrorComponent from "@/screens/error";
import { handleApolloError } from "@/utils/error";
import { ApolloError } from "@apollo/client";
import {
  type ErrorResponse,
  Outlet,
  createBrowserRouter,
  isRouteErrorResponse,
  useParams,
  useRouteError,
  useSearchParams,
} from "react-router";

function LayoutWrapper<P extends object>(Component: React.ComponentType<P>): React.FC<P> {
  return function Layout(props: P): React.ReactElement {
    const params = useParams();

    return (
      <Component params={params} {...props}>
        <Outlet />
      </Component>
    );
  };
}

function PageWrapper<P extends {}>(Component: React.ComponentType<P>): React.FC<P> {
  return function Page(props: P): React.ReactElement {
    const params = useParams();
    const [searchParams] = useSearchParams();

    const searchParamsObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      searchParamsObj[key] = value;
    });

    return <Component params={params} searchParams={searchParamsObj} {...props} />;
  };
}

function ErrorWrapper<P extends {}>(Component: React.ComponentType<P>): React.FC<P> {
  return function ErrorBoundary(props: P): React.ReactElement {
    const error = useRouteError() as ErrorResponse | ApolloError | Error;

    const errorObj: Partial<ErrorResponse> = {};

    if (error instanceof ApolloError) {
      const apolloError = handleApolloError(error);
      const err = new Error(apolloError.data?.message);
      err.name = apolloError.data?.name || "Error";
      Object.assign(errorObj, apolloError, {
        error: err,
      });
    } else if (isRouteErrorResponse(error)) {
      Object.assign(errorObj, error);
    } else if (error instanceof Error) {
      Object.assign(errorObj, {
        status: "status" in error ? error.status : undefined,
        statusText: "statusText" in error ? error?.statusText : undefined,
        error,
      });
    }

    const reset = () => {
      window.location.reload();
    };

    return <Component error={errorObj} reset={reset} {...props} />;
  };
}

export const router = createBrowserRouter([
  {
    path: "",
    lazy: async () => ({
      Component: LayoutWrapper((await import("./screens/layout")).default),
    }),
    HydrateFallback: () => null,
    ErrorBoundary: ErrorWrapper(ErrorComponent),
    children: [
      {
        path: "",
        lazy: async () => ({
          Component: PageWrapper((await import("./screens/page")).default),
        }),
      },
      {
        path: "auth/login",
        lazy: async () => ({
          Component: PageWrapper((await import("./screens/auth/login/page")).default),
        }),
      },
      {
        path: "auth/register",
        lazy: async () => ({
          Component: PageWrapper((await import("./screens/auth/register/page")).default),
        }),
      },
      {
        path: "articles",
        children: [
          {
            path: "",
            lazy: async () => ({
              Component: PageWrapper((await import("./screens/articles/page")).default),
            }),
          },
          {
            path: "creation",
            lazy: async () => ({
              Component: PageWrapper((await import("./screens/articles/creation/page")).default),
            }),
          },
          {
            path: "update/:id",
            lazy: async () => ({
              Component: PageWrapper((await import("./screens/articles/update/[id]/page")).default),
            }),
          },
          {
            path: ":id",
            lazy: async () => ({
              Component: PageWrapper((await import("./screens/articles/[id]/page")).default),
            }),
          },
        ],
      },
      {
        path: "*",
        lazy: async () => ({
          Component: PageWrapper((await import("./components/not-found")).default),
        }),
      },
    ],
  },
]);
