import { Icon } from "@repo/ui/media/icon";
import { cn } from "@repo/utils/classes";
import { LuRefreshCcw } from "react-icons/lu";

type RefreshSpinnerProps = {
  className?: string;
};

/**
 * A loading indicator component.
 */
export function RefreshSpinner(props: RefreshSpinnerProps) {
  const { className } = props;

  return (
    <div className="flex items-center justify-center">
      <Icon as={LuRefreshCcw} className={cn("!duration-slowest rotate-180 animate-spin", className)} />
    </div>
  );
}
