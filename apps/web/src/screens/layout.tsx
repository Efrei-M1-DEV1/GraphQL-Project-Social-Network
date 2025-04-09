import { Container } from "@repo/ui/layout/container";

type RootLayoutProps = {
  children?: React.ReactNode;
};

export default function RootLayout(props: RootLayoutProps) {
  const { children } = props;

  return <Container className="max-w-screen-md duration-moderate">{children}</Container>;
}
