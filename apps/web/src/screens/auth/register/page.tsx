import { Link } from "@/components/link";
import { RefreshSpinner } from "@/components/refresh-spinner";
import { type UserState, signUpUser } from "@/data-access/user";
import { graphql } from "@/gql";
import type { RegisterMutation } from "@/gql/graphql";
import { useMutation } from "@apollo/client";
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/data-display/card";
import { Button } from "@repo/ui/form/button";
import { Field } from "@repo/ui/form/field";
import { Input } from "@repo/ui/form/input";
import { Image } from "@repo/ui/media/image";
import { cn } from "@repo/utils/classes";
import { useActionState, useEffect } from "react";
import { useNavigate } from "react-router";

const SIGN_UP = graphql(`
  mutation Register($email: String!, $password: String!, $name: String!) {
    register(email: $email, password: $password, name: $name) {
      token
      user {
        id
        name
      }
    }
  }
`);

export default function RegisterPage() {
  const navigate = useNavigate();
  const [signUpMutation, { data }] = useMutation<RegisterMutation>(SIGN_UP);

  const [state, submitAction, loading] = useActionState<UserState, FormData>(
    async (prevState, payload) => {
      const state = await signUpUser(prevState, payload, signUpMutation);
      return state;
    },
    {
      success: false,
    },
  );

  const getError = (field: string) => state?.error?.[field]; // Helper function

  useEffect(() => {
    const handleRegisterSuccess = async () => {
      if (data?.register?.token) {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate a delay
        const token = data?.register?.token;
        localStorage.setItem("token", token || "");

        navigate("/");
      }
    };

    handleRegisterSuccess();
  }, [data, navigate]);

  return (
    <div className="flex h-dvh w-full items-center justify-center py-6">
      <Card
        as="form"
        action={submitAction}
        className="max-h-full max-w-lg overflow-hidden rounded-xl border-0 bg-white shadow-md md:max-w-full md:flex-row dark:bg-gray-950"
      >
        <Image src="/public/static/assets/images/register_image.jpg" className="max-h-40 w-full md:max-h-full md:max-w-80" />
        <div className="flex w-full flex-col overflow-auto">
          <CardHeader>
            <CardTitle className="text-2xl leading-8">Share Your Insights!</CardTitle>
            <CardDescription className="text-gray-500 text-sm dark:text-gray-400">
              Join us and explore a diverse range of new perspectives.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              {/* Name */}
              <Field
                id="name"
                label="Name"
                helperText="This is your name"
                errorText={getError("username")}
                disabled={loading || state.success}
                invalid={!!getError("username")}
                className="sm:col-span-2 md:col-span-1 lg:col-span-2"
              >
                <Input
                  name="username"
                  type="text"
                  mask="Aa{2,10}[ Aa{2,10}[ Aa{2,10}]]"
                  variant="subtle"
                  className="focus-within:outline-pink-600 dark:focus-within:outline-pink-400"
                  defaultValue={(state?.payload?.get("username") as string) || undefined}
                />
              </Field>
              {/* Email */}
              <Field
                id="email"
                label="Email"
                helperText="This is your email"
                errorText={getError("email")}
                disabled={loading || state.success}
                invalid={!!getError("email")}
                required
              >
                <Input
                  name="email"
                  type="text"
                  mask="email"
                  variant="subtle"
                  className="focus-within:outline-pink-600 dark:focus-within:outline-pink-400"
                  defaultValue={(state?.payload?.get("email") as string) || undefined}
                />
              </Field>
              {/* Password */}
              <Field
                id="password"
                label="Password"
                helperText="This is your password"
                errorText={getError("password")}
                disabled={loading || state.success}
                invalid={!!getError("password")}
                required
              >
                <Input
                  name="password"
                  type="password"
                  placeholder="_"
                  variant="subtle"
                  className="focus-within:outline-pink-600 dark:focus-within:outline-pink-400"
                  defaultValue={(state?.payload?.get("password") as string) || undefined}
                />
              </Field>
              {/* Error Message */}
              <div
                className={cn(
                  "grid transition-all duration-slower sm:col-span-2 md:col-span-1 lg:col-span-2",
                  loading ? "[grid-template-rows:0fr]" : "[grid-template-rows:1fr]",
                  state.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
                )}
              >
                <span className="overflow-hidden text-sm">
                  {state.success ? (
                    <>
                      Register successful! Please wait... <RefreshSpinner />
                    </>
                  ) : getError("name") && getError("name") ? (
                    `${getError("name")}: ${getError("message")}`
                  ) : null}
                </span>
              </div>
            </div>
          </CardBody>
          <CardFooter className="flex-col">
            <Button
              type="submit"
              variant="solid"
              className="w-full bg-pink-600"
              disabled={state.success}
              loading={loading}
              loadingText="Signing up..."
              spinner={<RefreshSpinner />}
            >
              Sign Up
            </Button>
            <span className="text-center text-gray-500 text-sm dark:text-gray-400">
              By signing up, you agree to our{" "}
              <Link to="#" className="text-pink-600 dark:text-pink-400">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="#" className="text-pink-600 dark:text-pink-400">
                Privacy Policy
              </Link>
            </span>
            <span className="text-center text-gray-500 text-sm dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-pink-600 dark:text-pink-400">
                Sign in
              </Link>
            </span>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
