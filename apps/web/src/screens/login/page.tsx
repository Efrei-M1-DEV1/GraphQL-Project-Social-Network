import { Button } from "@repo/ui/form/button";
import { Field } from "@repo/ui/form/field";
import { Link } from "@repo/ui/navigation/link";
import { Heading } from "@repo/ui/typography/heading";

export default function Login() {
  return (
    <form className="mx-auto grid max-w-screen-sm gap-4 sm:grid-cols-2 ">
      <Heading className="sm:col-span-2">Login</Heading>
      <Field label="Email" helperText="Enter your email" errorText="Invalid email" required>
        <input type="text" />
      </Field>
      <Field label="Password" helperText="Enter your password" required>
        <input type="password" />
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
