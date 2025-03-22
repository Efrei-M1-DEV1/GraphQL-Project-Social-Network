import { Box } from "@repo/ui/layout/box";
import { Container } from "@repo/ui/layout/container";
import { Heading } from "@repo/ui/typography/heading";

export default function Home() {
  return (
    <Container className="max-w-screen-md p-5 duration-moderate">
      <Box className="overflow-hidden rounded-xl border p-3">
        <Heading>Welcome to Our Social Network Platform!</Heading>
        <p className="mt-2 text-gray-500 text-sm">Connect with friends, share updates, and explore new communities.</p>
        <p className="mt-2 text-gray-500 text-sm">Get started by creating an account or logging in.</p>
      </Box>
    </Container>
  );
}
