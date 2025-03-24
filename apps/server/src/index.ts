import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import type { DataSourceContext } from "./context";
import db from "./datasources/db.js";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./schema.js";
import { verifyToken } from "./utils/jwt.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    let user: { id: number } | undefined;
    if (token) {
      try {
        const { userId } = verifyToken(token);
        user = { id: userId };
      } catch (error) {
        if (error instanceof Error) {
          // biome-ignore lint/suspicious/noConsole: <explanation>
          console.warn("Invalid or expired token:", error.message);
        } else {
          // biome-ignore lint/suspicious/noConsole: <explanation>
          console.warn("Invalid or expired token:", error);
        }
      }
    }
    return {
      dataSources: { db },
      user,
    } satisfies DataSourceContext;
  },
});

// biome-ignore lint/suspicious/noConsole: <explanation>
console.log(`🚀 Server ready at ${url}`);
