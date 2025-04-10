import type { PrismaClient } from "@prisma/client";

export type DataSourceContext = {
  dataSources: {
    db: PrismaClient;
  };
  user?: { id: number };
  token?: string;
};
