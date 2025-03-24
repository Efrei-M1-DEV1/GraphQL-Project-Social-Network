import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import type { DataSourceContext } from "./context";
import db from "./datasources/db.js";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./schema.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => {
    return {
      dataSources: { db },
      user: { id: 2 }, // Mock user (ID 1); replace with real auth later
    } satisfies DataSourceContext;
  },
});

// biome-ignore lint/suspicious/noConsole: <explanation>
console.log(`🚀 Server ready at ${url}`);
