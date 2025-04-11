import { cn } from "@repo/utils/classes";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

type ReadingProgressBarProps = {
  /**
   * The target element to track scroll progress on
   */
  target: React.RefObject<HTMLElement | null>;

  /**
   * Additional class name for the progress bar container
   */
  className?: string;

  /**
   * Class name for the actual progress indicator
   */
  barClassName?: string;

  /**
   * Callback function that receives the current progress percentage (0-100)
   */
  onProgressChange?: (progress: number) => void;
};

export function ReadingProgressBar({ target, className, barClassName, onProgressChange }: ReadingProgressBarProps) {
  const [progressWidth, setProgressWidth] = useState(0);

  // Scroll progress tracking
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const progress = Math.min(100, Math.round(latest * 100));
    setProgressWidth(progress);

    if (onProgressChange) {
      onProgressChange(progress);
    }
  });

  return (
    <div className={cn("sticky top-0 z-50 h-1 w-full bg-gray-100 dark:bg-gray-800", className)}>
      <motion.div
        className={cn("h-full bg-gradient-to-r from-purple-500 to-indigo-500", barClassName)}
        style={{ width: `${progressWidth}%` }}
      />
    </div>
  );
}
