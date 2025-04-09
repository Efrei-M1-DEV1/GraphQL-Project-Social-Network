import { type UixComponent, uix } from "@repo/ui/factory";
import { type VariantProps, cn, cva } from "@repo/utils/classes";
import { composeRefs } from "@repo/utils/compose-refs";
import type { Dict, Props } from "@repo/utils/types";
import { Children, cloneElement, isValidElement, useEffect, useRef } from "react";
import { withMask } from "use-mask-input";

const inputVariants = cva("", {
  variants: {
    /**
     * The size of the component.
     */
    size: {
      xs: "min-w-8 h-8 text-xs leading-4 px-2",
      sm: "min-w-9 h-9 text-sm leading-5 px-2.5",
      md: "min-w-10 h-10 text-sm leading-5 px-3",
      lg: "min-w-11 h-11 text-md leading-6 px-4",
    },

    /**
     * The variant of the component
     */
    variant: {
      flushed:
        "rounded-none border-b bg-transparent px-0 focus-visible:border-transparent focus-visible:shadow-[0_2px_0_0_var(--colors-focus-ring)] focus-visible:outline-transparent aria-[invalid=true]:border-[var(--colors-error)] aria-[invalid=true]:shadow-[var(--colors-error)]",
      outline:
        "border bg-transparent focus-visible:border-transparent aria-[invalid=true]:border-[var(--colors-error)] aria-[invalid=true]:outline-[var(--colors-error)]",
      subtle:
        "bg-[var(--colors-subtle)] aria-[invalid=true]:border aria-[invalid=true]:border-[var(--colors-error)] aria-[invalid=true]:outline-[var(--colors-error)]",
      plain: "",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "outline",
  },
});

type Mask =
  | "datetime"
  | "email"
  | "numeric"
  | "currency"
  | "decimal"
  | "integer"
  | "percentage"
  | "url"
  | "ip"
  | "mac"
  | "ssn"
  | "brl-currency"
  | "cpf"
  | "cnpj"
  | (string & {})
  | (string[] & {})
  | null;

type MaskOption = {
  type?: Mask;
  /**
   * Change the mask placeholder. Instead of "_", you can change the unfilled characters mask as you like, simply by adding the placeholder option. For example, placeholder: " " will change the default autofill with empty values.
   * @default "_"
   */
  placeholder?: string;
};

type InputProps = VariantProps<typeof inputVariants> & {
  /**
   * Mask type applied to the input (e.g., "datetime", "cpf", "numeric").
   */
  mask?: Mask | MaskOption;

  invalid?: boolean;
};

type InputGroupProps = {
  /**
   * If true, the elements are attached to each other.
   */
  attached?: boolean;

  /**
   * The start element of the input group.
   */
  startElement?: React.ReactNode;

  /**
   * The end element of the input group.
   */
  endElement?: React.ReactNode;
};

type InputAddonProps = VariantProps<typeof inputVariants> & {};

/**-----------------------------------------------------------------------------
 * Input Component
 * -----------------------------------------------------------------------------
 * Used to get user input in a text field.
 *
 * -----------------------------------------------------------------------------*/
export const Input: UixComponent<"input", InputProps> = (props) => {
  const { className, disabled, mask, placeholder, ref, size, variant, ...remainingProps } = props;

  const localRef = useRef<HTMLInputElement>(null);

  const { type: maskType, ...maskOption } = typeof mask === "string" ? { type: mask } : mask && "type" in mask ? mask : {};

  const inputRef = maskType ? composeRefs(withMask(maskType, { ...maskOption, clearMaskOnLostFocus: true }), localRef, ref) : ref;

  useEffect(() => {
    if (localRef.current && "inputmask" in localRef.current) {
      const { inputmask } = localRef.current as Dict;
      localRef.current.placeholder = placeholder || (inputmask.maskset.buffer as string[]).join("");
    }
  }, [placeholder]);

  return (
    <uix.input
      className={cn(
        "relative w-full appearance-none rounded-sm text-start focus-visible:outline-offset-0",
        disabled && "disabled:cursor-disabled disabled:opacity-50",
        inputVariants({ size, variant, className }),
      )}
      disabled={disabled}
      ref={inputRef}
      placeholder={placeholder}
      {...remainingProps}
    />
  );
};
Input.displayName = "Input";

/**-----------------------------------------------------------------------------
 * InputGroup Component
 * -----------------------------------------------------------------------------
 * Used to group elements together.
 *
 * -----------------------------------------------------------------------------*/
export const InputGroup: UixComponent<"div", InputGroupProps> = (props) => {
  const { attached, children, className, endElement, startElement, ...remainingProps } = props;

  const content = Children.map(children, (child) => {
    if (isValidElement(child)) {
      const childEl = child as React.ReactElement<Props>;
      return cloneElement(childEl, {
        className: cn(startElement && "pl-[calc(2.5rem-6px)]", endElement && "pr-[calc(2.5rem-6px)]", childEl.props.className),
      });
    }
    return child;
  });

  return (
    <uix.div
      className={cn(
        "relative isolate inline-flex items-center justify-start gap-2",
        attached ? "gap-0" : "items-center",
        className,
      )}
      data-attached={attached ? "" : undefined}
      // biome-ignore lint/a11y/useSemanticElements: <explanation>
      role="group"
      {...remainingProps}
    >
      {startElement ? (
        <uix.div className="pointer-events-none absolute z-[2] flex h-full items-center justify-center pl-3 text-[var(--colors-emphasized)] text-sm">
          {startElement}
        </uix.div>
      ) : null}
      {content}
      {endElement ? (
        <uix.div className="pointer-events-none absolute right-0 z-[2] flex h-full items-center justify-center pr-3 text-[var(--colors-emphasized)] text-sm">
          {endElement}
        </uix.div>
      ) : null}
    </uix.div>
  );
};
InputGroup.displayName = "InputGroup";

/**-----------------------------------------------------------------------------
 * InputAddon Component
 * -----------------------------------------------------------------------------
 * Used to add an element to the input.
 *
 * -----------------------------------------------------------------------------*/
export const InputAddon: UixComponent<"div", InputAddonProps> = (props) => {
  const { className, size, variant = "plain", ...remainingProps } = props;

  return (
    <uix.div
      className={cn(
        "flex w-auto flex-[0_0_auto] items-center self-stretch whitespace-nowrap rounded-sm border bg-[var(--colors-subtle)]",
        inputVariants({ size, variant, className }),
        className,
      )}
      {...remainingProps}
    />
  );
};
