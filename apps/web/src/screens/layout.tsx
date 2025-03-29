import { Box } from "@repo/ui/layout/box";
import { Container } from "@repo/ui/layout/container";

type RootLayoutProps = {
  children?: React.ReactNode;
};

export default function RootLayout(props: RootLayoutProps) {
  const { children } = props;

  return (
    <Container className="max-w-screen-md p-5 duration-moderate">
      <Box className="overflow-hidden rounded-xl border p-3">{children}</Box>
    </Container>
  );
}
