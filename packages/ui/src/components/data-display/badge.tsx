import { type VariantProps, cn, cva } from "@repo/utils/classes";
import type { Props } from "@repo/utils/types";
import { Children, cloneElement, isValidElement } from "react";
import { LuX } from "react-icons/lu";
import { type UixComponent, uix } from "../factory";
import { Icon } from "../media/icon";

const badgeVariant = cva("inline-flex items-center rounded-sm gap-1 font-medium tabular-nums whitespace-nowrap select-none", {
  variants: {
    /**
     * The size of the component.
     */
    size: {
      xs: "min-h-4 px-1 text-2xs leading-3",
      sm: "min-h-5 px-1.5 text-xs leading-4",
      md: "min-h-6 px-2 text-sm leading-5",
      lg: "min-h-7 px-2.5 text-sm leading-5",
    },
    /**
     * The variant of the componentĆ
     */
    variant: {
      outline: "border border-current border-opacity-5",
      solid: "bg-gray-900 text-[var(--bg-contrast)]",
      subtle: "bg-current bg-opacity-5",
      tag: "border border-current border-opacity-5 bg-current bg-opacity-5",
    },
  },
  defaultVariants: {
    variant: "subtle",
    size: "sm",
  },
});

type BadgeVariant = VariantProps<typeof badgeVariant>;

type BadgeProps = BadgeVariant & {
  closable?: boolean;
};

export const Badge: UixComponent<"span", BadgeProps> = (props) => {
  const { children, className, closable, onClick, size, variant, ...remainingProps } = props;

  const content = Children.map(children, (child) => {
    if (isValidElement(child)) {
      const childEl = child as React.ReactElement<Props>;
      return cloneElement(childEl, {
        className: cn(
          size === "xs" && "size-3 text-2xs leading-3",
          size === "sm" && "size-3.5 text-xs leading-4",
          size === "md" && "size-4 text-sm leading-5",
          size === "lg" && "size-5 text-sm leading-5",
          childEl.props.className,
        ),
      });
    }
    if (typeof child === "string" || typeof child === "number") {
      return <span className="line-clamp-1 text-wrap">{child}</span>;
    }
    return child;
  });

  return (
    <uix.span className={cn(badgeVariant({ variant, size, className }))} {...remainingProps}>
      {content}
      {closable ? (
        <button className="inline-flex items-center justify-center" type="button" onClick={onClick}>
          <Icon as={LuX} />
        </button>
      ) : null}
    </uix.span>
  );
};
