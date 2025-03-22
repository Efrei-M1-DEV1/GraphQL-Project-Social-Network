import { type VariantProps, cn, cva } from "@repo/utils/classes";
import { composeRefs } from "@repo/utils/compose-refs";
import { createContext } from "@repo/utils/create-context";
import type { Assign } from "@repo/utils/types";
import { LuX } from "react-icons/lu";
import { type UixComponent, uix } from "../factory";
import { AbsoluteCenter } from "../layout/absolute-center";
import { Icon } from "../media/icon";

/**
 * The variants of the Button component.
 */
const buttonVariants = cva(
  "relative isolate inline-flex flex-shrink-0 cursor-button select-none appearance-none items-center justify-center whitespace-nowrap rounded-sm align-middle font-medium transition-common duration-moderate",
  {
    variants: {
      size: {
        "2xs": "h-6 min-w-6 gap-1 px-2 text-xs leading-4",
        xs: "h-8 min-w-8 gap-1 px-2.5 text-xs leading-4",
        sm: "h-9 min-w-9 gap-2 px-3.5 text-sm leading-5",
        md: "h-10 min-w-10 gap-2 px-4 text-sm leading-5",
        lg: "h-11 min-w-11 gap-3 px-5 text-md leading-6",
        xl: "h-12 min-w-12 gap-2.5 px-5 text-md leading-6",
      },
      variant: {
        ghost: "bg-current bg-opacity-0 text-gray-900 hover:bg-opacity-20 active:bg-opacity-10",
        link: "hover:underline active:text-opacity-70",
        outline:
          "border border-current border-opacity-20 bg-current bg-opacity-0 text-gray-900 hover:bg-opacity-20 active:bg-opacity-10",
        plain: "rounded-none",
        solid: "bg-gray-900 text-[var(--bg-contrast)] hover:bg-opacity-85 active:bg-opacity-100",
        subtle: "bg-current bg-opacity-10 text-gray-900 hover:bg-opacity-20 active:bg-opacity-10",
        unstyled: "h-auto min-w-0 gap-0 rounded-none px-0 leading-none",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "solid",
    },
  },
);

type ButtonVariant = VariantProps<typeof buttonVariants>;

/**
 * The props of the ButtonGroup component.
 */
export type ButtonGroupProps = ButtonVariant & {
  /**
   * If true, the buttons are attached to each other.
   */
  attached?: boolean;
};

/**
 * The props of the Button component.
 */
export type ButtonProps = ButtonVariant & {
  /**
   * Use the loading and loadingText prop to show a loading spinner.
   */
  loading?: boolean;

  /**
   * The text to show when the button is in a loading state.
   */
  loadingText?: string;

  /**
   * The spinner to show when the button is in a loading state.
   */
  spinner?: React.ReactElement;
};

/**-----------------------------------------------------------------------------
 * Dialog Context
 * -----------------------------------------------------------------------------
 * Provides state management for button components.
 *
 * -----------------------------------------------------------------------------*/
const buttonContext = createContext<ButtonVariant>({
  strict: true,
  hookName: "useButtonContext",
  providerName: "ButtonProvider",
  errorMessage: "useButtonContext: `context` is undefined. Seems you forgot to wrap component within `<ButtonProvider />`",
  defaultValue: {},
  name: "ButtonContext",
});

const [ButtonProvider, useButtonContext] = buttonContext;

/**-----------------------------------------------------------------------------
 * Button Component
 * -----------------------------------------------------------------------------
 * Used to trigger an action or event.
 *
 * -----------------------------------------------------------------------------*/
export const Button: UixComponent<"button", ButtonProps> = (props) => {
  const {
    asChild,
    children,
    className,
    disabled,
    loading,
    loadingText,
    ref,
    size: sizeProp,
    spinner: spinnerProp,
    type,
    variant: variantProp,
    ...remainingProps
  } = props;

  const { size: sizeContext, variant: variantContext } = useButtonContext();

  const size = sizeProp ?? sizeContext;
  const variant = variantProp ?? variantContext;

  const spinner = spinnerProp;

  const setButtonType = (element: HTMLElement | null) => {
    if (element && element.tagName === "BUTTON") {
      (element as HTMLButtonElement).type = type === undefined ? "button" : type;
    }
  };

  const buttonRef = composeRefs(ref, setButtonType);

  return (
    <uix.button
      ref={buttonRef}
      asChild={asChild}
      className={cn(
        buttonVariants({ size, variant }),
        disabled && "disabled:cursor-not-allowed disabled:bg-opacity-100 disabled:opacity-50",
        className,
      )}
      disabled={disabled || loading}
      type={type}
      {...remainingProps}
    >
      {loading ? (
        loadingText ? (
          <>
            {spinner}
            {loadingText}
          </>
        ) : (
          <>
            <AbsoluteCenter className="inline-flex items-center justify-center">{spinner}</AbsoluteCenter>
            <span className="invisible">{children}</span>
          </>
        )
      ) : (
        children
      )}
    </uix.button>
  );
};
Button.displayName = "Button";

/**-----------------------------------------------------------------------------
 * IconButton Component
 * -----------------------------------------------------------------------------
 * Used to render an icon within a button.
 *
 * -----------------------------------------------------------------------------*/
export const IconButton: UixComponent<"button", Assign<ButtonProps, { icon: React.ReactElement }>> = (props) => {
  const { children, className, icon, size = "md", ...remainingProps } = props;

  return (
    <Button className={cn("p-0", className)} size={size} {...remainingProps}>
      <Icon
        className={cn(
          "text-[1.2em]",
          size === "2xs" && "size-3",
          (size === "xs" || size === "sm") && "size-4",
          (size === "md" || size === "lg") && "size-5",
          size === "xl" && "size-6",
        )}
        asChild
      >
        {icon}
      </Icon>
      {children}
    </Button>
  );
};
IconButton.displayName = "IconButton";

/**-----------------------------------------------------------------------------
 * CloseButton Component
 * -----------------------------------------------------------------------------
 * Used to trigger close functionality.
 *
 * -----------------------------------------------------------------------------*/
export const CloseButton: UixComponent<"button", ButtonProps> = (props) => {
  const { children, className, size, variant = "ghost", ...remainingProps } = props;

  const { size: sizeContext, variant: variantContext } = useButtonContext();

  return (
    <IconButton icon={<LuX />} size={size || sizeContext} variant={variant || variantContext} {...(remainingProps as object)}>
      <span className="sr-only">Close</span>
    </IconButton>
  );
};
CloseButton.displayName = "CloseButton";

/**-----------------------------------------------------------------------------
 * ButtonGroup Component
 * -----------------------------------------------------------------------------
 * Used to group buttons together.
 *
 * -----------------------------------------------------------------------------*/
export const ButtonGroup: UixComponent<"div", ButtonGroupProps> = (props) => {
  const { attached, size, variant, className, children, ...remainingProps } = props;

  return (
    <uix.div
      data-attached={attached}
      // biome-ignore lint/a11y/useSemanticElements: <explanation>
      role="group"
      className={cn("relative isolate inline-flex items-center", attached ? "gap-0" : "gap-2", className)}
      {...remainingProps}
    >
      <ButtonProvider value={{ size, variant }}>{children}</ButtonProvider>
    </uix.div>
  );
};
ButtonGroup.displayName = "ButtonGroup";
