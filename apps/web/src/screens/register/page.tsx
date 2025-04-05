import { Button } from "@repo/ui/form/button";
import { Field } from "@repo/ui/form/field";
import { Link } from "@repo/ui/navigation/link";
import { Heading } from "@repo/ui/typography/heading";

export default function Register() {
  return (
    <form className="mx-auto grid max-w-screen-sm gap-4 sm:grid-cols-2 ">
      <Heading className="sm:col-span-2">Register</Heading>
      <Field label="Name" helperText="Enter your name" required>
        <input type="text" />
      </Field>
      <Field label="Email" helperText="Enter your email" errorText="Invalid email" required>
        <input type="text" />
      </Field>
      <Field label="Password" helperText="Enter your password" required>
        <input type="password" />
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
