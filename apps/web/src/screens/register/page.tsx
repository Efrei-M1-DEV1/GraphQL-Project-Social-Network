import { Button } from "@repo/ui/form/button";
import { Field } from "@repo/ui/form/field";
import { Link } from "@repo/ui/navigation/link";
import { Heading } from "@repo/ui/typography/heading";
import { registerSchema } from "@repo/utils/schemas/auth";
import { useState } from "react";

export default function Register() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    // console.log("Form submitted:", { name, email, password });
    // Validation of inputs:
    const parseData = registerSchema.safeParse({
      name,
      email,
      password,
    });
    if (!parseData.success) {
      // Handle validation errors
      // You can display error messages to the user or take other actions
      const formattedErrors: Record<string, string> = {};
      for (const [key, value] of Object.entries(parseData.error.format())) {
        if (value && "_errors" in value) {
          formattedErrors[key] = value._errors.join(", ");
        }
      }
      setErrors(formattedErrors);
      return;
    }
    setErrors({});
  }

  return (
    <form className="mx-auto grid max-w-screen-sm gap-4 sm:grid-cols-2 " onSubmit={submitForm}>
      <Heading className="sm:col-span-2">Register</Heading>
      <Field label="Name" helperText="Enter your name" errorText={errors.name} invalid={!!errors.name} required>
        <input type="text" name="name" />
      </Field>
      <Field label="Email" helperText="Enter your email" errorText={errors.email} invalid={!!errors.email} required>
        <input type="text" name="email" />
      </Field>
      <Field label="Password" helperText="Enter your password" errorText={errors.password} invalid={!!errors.password} required>
        <input type="password" name="password" />
      </Field>

      <Button type="submit" className="bg-purple-600 sm:col-span-2">
        Register
      </Button>
      <span className="text-xs">
        Have already an account?{" "}
        <Link href="/login" className="text-purple-600">
          Login
        </Link>
      </span>
    </form>
  );
}
