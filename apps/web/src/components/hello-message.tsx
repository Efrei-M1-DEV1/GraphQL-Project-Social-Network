import { gql, useSuspenseQuery } from "@apollo/client";

const HELLO_QUERY = gql`
  query Hello {
    hello
  }
`;

export default function HelloMessage() {
  const { data, error } = useSuspenseQuery<{ hello: string }>(HELLO_QUERY);

  if (error) {
    return <p className="text-red-500">An error occurred: {error.message}</p>;
  }

  return <p className="mt-2 text-gray-500 text-sm">Server says: {data.hello} 🚀</p>;
}
