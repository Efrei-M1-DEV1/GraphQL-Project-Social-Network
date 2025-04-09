import { cn } from "@repo/utils/classes";
import { Children, cloneElement } from "react";
import { type UixComponent, uix } from "../factory";

/**
 * The Stack component props.
 */
type StackProps = {
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
  const { children, className, separator, ...remainingProps } = props;

  const content = Children.toArray(children).reduce((acc: React.ReactNode[], child, index) => {
    if (index > 0 && separator) {
      const key = `stack-separator-${index}`;
      acc.push(cloneElement(separator, { key }));
    }
    acc.push(child);
    return acc;
  }, []);

  return (
    <uix.div className={cn("flex flex-col gap-2", className)} {...remainingProps}>
      {content}
    </uix.div>
  );
};

Stack.displayName = "Stack";
