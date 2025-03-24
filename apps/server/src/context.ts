import type { PrismaClient } from "@prisma/client";

export type DataSourceContext = {
  dataSources: {
    db: PrismaClient;
  };
  user?: { id: number }; // Authenticated user; undefined if not logged in
};
