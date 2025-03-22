import { type VariantProps, cn, cva } from "@repo/utils/classes";
import { Children, cloneElement } from "react";
import { type UixComponent, uix } from "../factory";

/**
 * The Stack component variants.
 */
const stackVariants = cva("flex gap-2", {
  variants: {
    /**
     * Use the direction prop to change the direction of the stack.
     */
    direction: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    direction: "vertical",
  },
});

/**
 * The Stack component props.
 */
type StackProps = VariantProps<typeof stackVariants> & {
  /**
   * Use the separator prop to add a separator between the stack items.
   */
  separator?: React.ReactElement;
};

/**-----------------------------------------------------------------------------
 * Stack
 * -----------------------------------------------------------------------------
 * Used to layout its children in a vertical or horizontal stack.
 *
 * @param props - The component props.
 * @returns The Stack component.
 *
 * -----------------------------------------------------------------------------*/
export const Stack: UixComponent<"div", StackProps> = (props) => {
  const { children, className, direction, separator, ...remainingProps } = props;

  const content = Children.toArray(children).reduce((acc: React.ReactNode[], child, index) => {
    if (index > 0 && separator) {
      const key = `separator-${index}`;
      acc.push(cloneElement(separator, { key }));
    }
    acc.push(child);
    return acc;
  }, []);

  return (
    <uix.div className={cn(stackVariants({ direction, className }))} {...remainingProps}>
      {content}
    </uix.div>
  );
};

Stack.displayName = "Stack";
