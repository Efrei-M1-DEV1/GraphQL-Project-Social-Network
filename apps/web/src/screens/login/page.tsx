import { Button } from "@repo/ui/form/button";
import { Field } from "@repo/ui/form/field";
import { Link } from "@repo/ui/navigation/link";
import { Heading } from "@repo/ui/typography/heading";
import { loginSchema } from "@repo/utils/schemas/auth";
import { useState } from "react";

export default function Login() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    // console.log("Form submitted:", { email, password });
    // Validation of inputs:
    const parseData = loginSchema.safeParse({
      email,
      password,
    });
    if (!parseData.success) {
      // console.log("Validation failed:", parseData.error.format());
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
    // If validation is successful, you can proceed with your logic
    // console.log("Form submitted:", parseData.data);
    setErrors({});
  }

  return (
    <form className="mx-auto grid max-w-screen-sm gap-4 sm:grid-cols-2 " onSubmit={submitForm}>
      <Heading className="sm:col-span-2">Login</Heading>
      <Field label="Email" helperText="Enter your email" invalid={!!errors.email} errorText={errors.email} required>
        <input type="text" name="email" />
      </Field>
      <Field label="Password" errorText={errors.password} invalid={!!errors.password} helperText="Enter your password" required>
        <input type="password" name="password" />
      </Field>

      <Button type="submit" className="bg-purple-600 sm:col-span-2">
        Login
      </Button>
      <span className="text-xs">
        Don't have an account?{" "}
        <Link href="/register" className="text-purple-600">
          Register
        </Link>
      </span>
    </form>
  );
}
