import { type UixComponent, uix } from "@repo/ui/factory";
import { cn } from "@repo/utils/classes";
import { uuid } from "@repo/utils/functions";

type FieldProps = {
  /**
   * Indicates whether the field is disabled.
   */
  disabled?: boolean;

  /**
   * Indicate that the field is invalid.
   */
  errorText?: string;

  /**
   * Add helper text to the field.
   */
  helperText?: string;

  /**
   * Indicates whether the field is invalid.
   */
  invalid?: boolean;

  /**
   * The label for the field.
   */
  label?: string;

  /**
   * Indicate that the field is optional.
   */
  optionalText?: React.ReactElement;

  /**
   * Indicates whether the field is read-only.
   */
  readOnly?: boolean;

  /**
   * Indicates whether the field is required.
   */
  required?: boolean;
};

const DATA_SCOPE = "field";

/**-----------------------------------------------------------------------------
 * Field Component
 * -----------------------------------------------------------------------------
 * Used to add labels, help text, and error messages to form fields.
 *
 * -----------------------------------------------------------------------------*/
export const Field: UixComponent<"fieldset", FieldProps> = (props) => {
  const {
    asChild,
    children,
    className,
    disabled,
    errorText,
    helperText,
    id: idProp,
    invalid,
    label,
    optionalText,
    readOnly,
    required,
    ...remainingProps
  } = props;

  const id = idProp ?? `:${uuid()}:`;

  const ids = {
    root: `field::${id}`,
    label: `field::${id}::label`,
    input: id,
    errorText: `field::${id}::error-text`,
    helperText: `field::${id}::helper-text`,
  };

  return (
    <uix.fieldset
      asChild={asChild}
      className={cn("relative flex w-full flex-col gap-1.5", className)}
      data-part="root"
      data-readonly={readOnly ? "" : undefined}
      data-scope={DATA_SCOPE}
      id={ids.root}
      {...remainingProps}
    >
      {label ? (
        <label
          className={cn(
            "flex select-none items-center gap-1 text-start font-medium text-sm leading-5",
            disabled && "data-[disabled]:opacity-50",
          )}
          data-disabled={disabled ? "" : undefined}
          data-invalid={invalid ? "" : undefined}
          data-part="label"
          data-readonly={readOnly ? "" : undefined}
          data-scope={DATA_SCOPE}
          htmlFor={ids.input} // Set initial values
          id={ids.label} // Set initial values
        >
          {label}
          {optionalText}
          {required ? <span className="text-[var(--colors-error)] leading-none">*</span> : null}
        </label>
      ) : null}
      <uix.input
        aria-invalid={invalid || undefined}
        asChild
        className={cn(disabled && "disabled:cursor-disabled disabled:opacity-50")}
        data-invalid={invalid ? "" : undefined}
        data-part="root"
        data-readonly={readOnly ? "" : undefined}
        data-scope="input"
        disabled={disabled}
        id={ids.input}
        readOnly={readOnly}
        required={required}
      >
        {children}
      </uix.input>
      {invalid && errorText ? (
        <span
          className="inline-flex items-center gap-1 font-medium text-[var(--colors-error)] text-xs leading-4"
          aria-live="polite"
          data-part="error-text"
          data-scope="input"
          id={ids.errorText}
        >
          {errorText}
        </span>
      ) : null}
      {helperText ? (
        <p className="text-xs leading-4" data-part="helper-text" data-scope="input" id={ids.helperText}>
          {helperText}
        </p>
      ) : null}
    </uix.fieldset>
  );
};

Field.displayName = "Field";
