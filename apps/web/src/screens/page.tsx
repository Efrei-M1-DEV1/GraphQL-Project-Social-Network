import HelloMessage from "@/components/hello-message";
import { RefreshSpinner } from "@/components/refresh-spinner";
import { Heading } from "@repo/ui/typography/heading";
import { Suspense } from "react";

function FallbackLoading() {
  return (
    <div className="mt-2 flex flex-row items-center gap-1 text-sm opacity-60">
      <p>Server says:</p>
      <RefreshSpinner />
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative m-5 space-y-2 rounded-xl border p-3">
      <Heading>Welcome to Our Social Network Platform!</Heading>
      <p className="sticky top-0 text-sm opacity-60">Connect with friends, share updates, and explore new communities.</p>
      <p className="text-sm opacity-60">Get started by creating an account or logging in.</p>
      <Suspense fallback={<FallbackLoading />}>
        <HelloMessage />
      </Suspense>
    </div>
  );
}
