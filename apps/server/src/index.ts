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

if (!process.env.PORT) {
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.error("No PORT environment variable set. Please set the PORT environment variable to start the server.");
  process.exit(1);
}

const { url } = await startStandaloneServer(server, {
  listen: { port: Number(process.env.PORT) },
  context: async ({ req }) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    let user: { id: number } | undefined;
    if (token) {
      try {
        const { userId } = verifyToken(token);
        const dbUser = await db.user.findUnique({ where: { id: userId } });
        if (dbUser) {
          user = { id: dbUser.id };
        }
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.warn("Token verification failed:", error);
      }
    }
    return {
      dataSources: { db },
      user,
      token,
    } satisfies DataSourceContext;
  },
});

// biome-ignore lint/suspicious/noConsole: <explanation>
console.log(`🚀 Server ready at ${url}`);
