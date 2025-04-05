import { Card, CardBody } from "@repo/ui/data-display/card";
import { Button } from "@repo/ui/form/button";
import { Box } from "@repo/ui/layout/box";
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
    <Container centerContent className="min-h-screen p-4">
      <Box className="max-w-lg">
        <Card>
          <CardBody>
            <Heading size="3xl" className="mb-4 text-center">
              Whoops!
            </Heading>
            <p className="mb-6 text-center opacity-60">Something went wrong while loading this page.</p>
            <Card>
              <CardBody>
                <Heading size="xl" className="mb-2 text-center text-red-600">
                  {errorName}
                </Heading>
                <p className="text-center text-red-500">{errorMessage}</p>
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
            </Card>
            <Button className="mx-auto mt-6" onClick={reset}>
              Refresh Page
            </Button>
          </CardBody>
        </Card>
      </Box>
    </Container>
  );
}
