import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/data-display/card";
import { Button } from "@repo/ui/form/button";
import { Container } from "@repo/ui/layout/container";
import { Heading } from "@repo/ui/typography/heading";
import type { ErrorResponse } from "react-router";

type ErrorBoundaryProps = {
  error?: ErrorResponse & { error: Error };
  reset?: () => void;
};

export default function ErrorBoundary(props: ErrorBoundaryProps) {
  const { error, reset } = props;

  // Extract values safely, providing defaults
  const errorMessage = error?.error?.message || "An unexpected error occurred.";
  const errorName = error?.error?.name || "Error";
  const errorStatus = error?.status;
  const errorStatusText = error?.statusText;
  const errorStack = error?.error?.stack;

  return (
    <Container centerContent className="max-w-screen-md pt-5">
      <Card className="w-full max-w-lg border-0 bg-white shadow-md dark:bg-gray-950">
        <CardHeader>
          <CardTitle className="text-center text-3xl leading-[2.375rem]">Whoops!</CardTitle>
          <CardDescription className="text-center opacity-60">Something went wrong while loading this page.</CardDescription>
        </CardHeader>
        <CardBody>
          <Heading size="xl" className="text-center text-red-600">
            {errorName}
          </Heading>
          <p className="mt-2 text-center text-red-500">{errorMessage}</p>
          {errorStatus ? (
            <p className="text-center text-red-500">
              {errorStatus} - {errorStatusText}
            </p>
          ) : null}
          {errorStack ? (
            <pre className="mt-4 overflow-x-auto rounded bg-[var(--colors-subtle)] p-4">
              <code>{errorStack}</code>
            </pre>
          ) : null}
        </CardBody>
        <CardFooter className="justify-center">
          <Button className="bg-gray-950 hover:scale-105 dark:bg-gray-50" onClick={reset}>
            Refresh Page
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
}
