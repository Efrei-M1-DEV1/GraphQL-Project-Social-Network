import type { DataSourceContext } from "./context";
import type { Resolvers } from "./types"; // Import generated types

export const resolvers: Resolvers = {
  Query: {
    hello: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return "Hello, GraphQL!";
    },
    users: async (_parent, _args, context: DataSourceContext) => {
      return context.dataSources.db.user.findMany();
    },
  },
};
