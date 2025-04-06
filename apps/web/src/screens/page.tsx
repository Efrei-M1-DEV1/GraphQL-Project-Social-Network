import HelloMessage from "@/components/hello-message";
import { Icon } from "@repo/ui/media/icon";
import { Heading } from "@repo/ui/typography/heading";
import { Suspense } from "react";
import { LuRefreshCcw } from "react-icons/lu";

function FallbackLoading() {
  return (
    <div className="mt-2 flex flex-row items-center gap-1 text-sm opacity-60">
      <p>Server says:</p>
      <Icon as={LuRefreshCcw} className="!duration-slowest rotate-180 animate-spin" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="m-5 space-y-2 overflow-hidden rounded-xl border p-3">
      <Heading>Welcome to Our Social Network Platform!</Heading>
      <p className="text-sm opacity-60">Connect with friends, share updates, and explore new communities.</p>
      <p className="text-sm opacity-60">Get started by creating an account or logging in.</p>
      <Suspense fallback={<FallbackLoading />}>
        <HelloMessage />
      </Suspense>
    </div>
  );
}
