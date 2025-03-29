import HelloMessage from "@/components/hello-message";
import { Spinner } from "@repo/ui/feedback/spinner";
import { Heading } from "@repo/ui/typography/heading";
import { Suspense } from "react";

function FallbackLoading() {
  return (
    <div className="mt-2 flex flex-row items-center gap-1 text-gray-500 text-sm">
      <p>Server says:</p>
      <Spinner size="sm" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Heading>Welcome to Our Social Network Platform!</Heading>
      <p className="mt-2 text-gray-500 text-sm">Connect with friends, share updates, and explore new communities.</p>
      <p className="mt-2 text-gray-500 text-sm">Get started by creating an account or logging in.</p>
      <Suspense fallback={<FallbackLoading />}>
        <HelloMessage />
      </Suspense>
    </>
  );
}
