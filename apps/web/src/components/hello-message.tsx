import { graphql } from "@/gql";
import type { HelloQuery } from "@/gql/graphql";
import { useSuspenseQuery } from "@apollo/client";
import { Button } from "@repo/ui/form/button";
import { Icon } from "@repo/ui/media/icon";
import { LuRefreshCcw } from "react-icons/lu";

const HELLO_QUERY = graphql(`
  query Hello {
    hello
  }
`);

export default function HelloMessage() {
  const { data, error, refetch } = useSuspenseQuery<HelloQuery>(HELLO_QUERY, {
    errorPolicy: "all",
  });

  const refetchData = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="flex items-center gap-1">
        <p className="text-sm opacity-60">
          Server says: <span className="text-[var(--colors-error)]">{error.message}</span>
        </p>
        <Button variant="link" onClick={refetchData} className="h-[inherit] p-0 [&>svg]:hover:animate-spin">
          Retry
          <Icon as={LuRefreshCcw} className="!duration-slowest rotate-180" />
        </Button>
      </div>
    );
  }

  return <p className="text-sm opacity-60">Server says: {data?.hello} 🚀</p>;
}
