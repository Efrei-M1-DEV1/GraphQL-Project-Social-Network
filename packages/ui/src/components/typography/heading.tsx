import { type VariantProps, cn, cva } from "@repo/utils/classes";
import { type UixComponent, uix } from "../factory";

const headingVariants = cva("font-semibold", {
  variants: {
    size: {
      sm: "text-sm leading-5",
      md: "text-md leading-6",
      lg: "text-lg leading-7",
      xl: "text-xl leading-[1.875rem]",
      "2xl": "text-xl leading-8",
      "3xl": "text-3xl leading-[2.375rem]",
      "4xl": "text-4xl leading-[2.75rem] tracking-tight",
      "5xl": "text-5xl leading-[3.75rem] tracking-tight",
      "6xl": "text-6xl leading-[4.5rem] tracking-tight",
    },
  },
  defaultVariants: {
    size: "xl",
  },
});

type HeadingVariant = VariantProps<typeof headingVariants>;

export type HeadingProps = HeadingVariant;

/**-----------------------------------------------------------------------------
 * Heading Component
 * -----------------------------------------------------------------------------
 * Used to render semantic HTML heading elements.
 *
 * -----------------------------------------------------------------------------*/
export const Heading: UixComponent<"h2", HeadingProps> = (props) => {
  const { className, size, ...remainingProps } = props;

  return <uix.h2 className={cn(headingVariants({ size, className }))} {...remainingProps} />;
};

Heading.displayName = "Heading";
