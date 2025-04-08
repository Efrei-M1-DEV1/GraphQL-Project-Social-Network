import { Link as UILink } from "@repo/ui/navigation/link";
import type { Assign, PropsOf } from "@repo/utils/types";
import { Link as RouterLink } from "react-router";

type LinkProps = Assign<PropsOf<typeof UILink>, PropsOf<typeof RouterLink>>;

/**
 * A wrapper component combining UI link with router link.
 */
export const Link = (props: LinkProps) => {
  const { children, to, ...remainingProps } = props;

  return (
    <UILink asChild {...remainingProps}>
      <RouterLink to={to}>{children}</RouterLink>
    </UILink>
  );
};
