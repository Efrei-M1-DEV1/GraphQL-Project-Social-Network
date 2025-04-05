import ArticleList from "@/screens/articles/page";
import ErrorBoundary from "@/screens/error";
import RootLayout from "@/screens/layout";
import Home from "@/screens/page";
import { type ErrorResponse, Outlet, createBrowserRouter, isRouteErrorResponse, useRouteError } from "react-router";
import { useParams, useSearchParams } from "react-router";
import ArticleDetails from "./screens/articles/[id]/page";
import Login from "./screens/login/page";
import Register from "./screens/register/page";

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
    const error = useRouteError() as ErrorResponse | Error;

    const errorObj: Partial<ErrorResponse> = {};

    if (isRouteErrorResponse(error)) {
      Object.assign(errorObj, error);
    } else if (error instanceof Error) {
      Object.assign(errorObj, {
        status: "status" in error ? error.status : undefined,
        statusText: "statusText" in error ? error?.statusText : undefined,
        error,
      });
    }

    return <Component error={errorObj} {...props} />;
  };
}

export const router = createBrowserRouter([
  {
    path: "",
    Component: LayoutWrapper(RootLayout),
    ErrorBoundary: ErrorWrapper(ErrorBoundary),
    children: [
      {
        children: [
          {
            path: "/",
            Component: PageWrapper(Home),
          },
          {
            path: "/login",
            Component: PageWrapper(Login),
          },
          {
            path: "/register",
            Component: PageWrapper(Register),
          },
          {
            path: "/articles",
            Component: PageWrapper(ArticleList),
          },
          {
            path: "/articles/:id",
            Component: PageWrapper(ArticleDetails),
          },
        ],
      },
    ],
  },
]);
