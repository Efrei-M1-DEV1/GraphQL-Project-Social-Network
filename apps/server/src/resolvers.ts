export const resolvers = {
  Query: {
    hello: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return "Hello, GraphQL!";
    },
  },
};
