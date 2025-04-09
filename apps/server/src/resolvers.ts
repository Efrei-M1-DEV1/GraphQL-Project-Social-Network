import type { RefreshToken } from "@prisma/client";
import { loginSchema, registerSchema } from "@repo/utils/schemas/auth";
import { cursorSchema } from "@repo/utils/schemas/cursor";
import bcrypt from "bcrypt";
import { DateTimeResolver } from "graphql-scalars";
import type { DataSourceContext } from "./context";
import type { Resolvers } from "./types";
import { generateRefreshToken, generateToken, verifyRefreshToken } from "./utils/jwt.js";

// Add this interface to define the cursor structure
type ArticleCursor = {
  createdAt: string;
  id: number;
};

// Helper function to parse and validate the cursor
const parseCursor = (after: string): ArticleCursor | null => {
  try {
    const decoded = Buffer.from(after, "base64").toString("utf-8");
    const cursor = cursorSchema.parse(JSON.parse(decoded));
    return cursor;
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.warn("Failed to parse cursor:", error);
    return null;
  }
};

// Helper function to simulate a delay in development environment
const simulateDelay = async () => {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
};

export const resolvers: Resolvers = {
  DateTime: DateTimeResolver,

  Query: {
    hello: async () => {
      await simulateDelay();
      return "Hello, GraphQL!";
    },
    users: async (_parent, _args, context: DataSourceContext) => {
      await simulateDelay();
      return context.dataSources.db.user.findMany();
    },
    article: async (_parent, { id }, context: DataSourceContext) => {
      await simulateDelay();
      return context.dataSources.db.article.findUnique({
        where: { id },
        include: { author: true, comments: { include: { author: true } } },
      });
    },
    articles: async (_parent, { first, after }, context: DataSourceContext) => {
      await simulateDelay();
      const take = first || 10;

      const cursor = after ? parseCursor(after) : null;
      if (after && !cursor) {
        throw new Error("Invalid cursor provided");
      }

      const where = cursor
        ? {
            OR: [
              { createdAt: { lt: new Date(cursor.createdAt) } },
              { createdAt: { equals: new Date(cursor.createdAt) }, id: { lt: cursor.id } },
            ],
          }
        : {};

      const articles = await context.dataSources.db.article.findMany({
        take: take + 1,
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: { author: true, comments: { include: { author: true } } },
      });

      const hasNextPage = articles.length > take;
      const nodes = hasNextPage ? articles.slice(0, take) : articles;

      const edges = nodes.map((article) => ({
        cursor: Buffer.from(
          JSON.stringify({
            createdAt: article.createdAt.toISOString(),
            id: article.id,
          }),
        ).toString("base64"),
        node: article,
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        },
      };
    },
    articlesByAuthor: async (_parent, { authorId, first, after }, context: DataSourceContext) => {
      await simulateDelay();
      const take = first || 10;

      const cursor = after ? parseCursor(after) : null;
      if (after && !cursor) {
        throw new Error("Invalid cursor provided");
      }

      const where = {
        authorId,
        ...(cursor
          ? {
              OR: [
                { createdAt: { lt: new Date(cursor.createdAt) } },
                { createdAt: { equals: new Date(cursor.createdAt) }, id: { lt: cursor.id } },
              ],
            }
          : {}),
      };

      const articles = await context.dataSources.db.article.findMany({
        take: take + 1,
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: { author: true, comments: { include: { author: true } } },
      });

      const hasNextPage = articles.length > take;
      const nodes = hasNextPage ? articles.slice(0, take) : articles;

      const edges = nodes.map((article) => ({
        cursor: Buffer.from(
          JSON.stringify({
            createdAt: article.createdAt.toISOString(),
            id: article.id,
          }),
        ).toString("base64"),
        node: article,
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        },
      };
    },
  },
  Mutation: {
    createArticle: async (_parent, { title, content }, context: DataSourceContext) => {
      await simulateDelay();
      if (!context.user) {
        throw new Error("Unauthorized: Please log in");
      }
      const article = await context.dataSources.db.article.create({
        data: { title, content, authorId: context.user.id },
        include: { author: true },
      });
      return { ...article, comments: [] };
    },
    updateArticle: async (_parent, { id, title, content }, context: DataSourceContext) => {
      await simulateDelay();
      if (!context.user) {
        throw new Error("Unauthorized: Please log in");
      }
      const article = await context.dataSources.db.article.findUnique({ where: { id } });
      if (!article) {
        throw new Error("Article not found");
      }
      if (article.authorId !== context.user.id) {
        throw new Error("Forbidden: You can only update your own articles");
      }
      return context.dataSources.db.article.update({
        where: { id },
        data: { title: title ?? undefined, content: content ?? undefined },
        include: { author: true, comments: { include: { author: true } } },
      });
    },
    deleteArticle: async (_parent, { id }, context: DataSourceContext) => {
      await simulateDelay();
      if (!context.user) {
        throw new Error("Unauthorized: Please log in");
      }
      const article = await context.dataSources.db.article.findUnique({ where: { id } });
      if (!article) {
        throw new Error("Article not found");
      }
      if (article.authorId !== context.user.id) {
        throw new Error("Forbidden: You can only delete your own articles");
      }
      await context.dataSources.db.article.delete({ where: { id } });
      return true;
    },
    createComment: async (_parent, { content, articleId }, context: DataSourceContext) => {
      await simulateDelay();
      if (!context.user) {
        throw new Error("Unauthorized: Please log in");
      }
      const article = await context.dataSources.db.article.findUnique({ where: { id: articleId } });
      if (!article) {
        throw new Error("Article not found");
      }
      return context.dataSources.db.comment.create({
        data: { content, articleId, authorId: context.user.id },
        include: { author: true, article: true },
      });
    },
    updateComment: async (_parent, { id, content }: { id: number; content: string }, context: DataSourceContext) => {
      await simulateDelay();
      if (!context.user) {
        throw new Error("Unauthorized: Please log in");
      }
      const comment = await context.dataSources.db.comment.findUnique({
        where: { id },
        include: { author: true },
      });
      if (!comment) {
        throw new Error("Comment not found");
      }
      if (comment.authorId !== context.user.id) {
        throw new Error("Forbidden: You can only update your own comments");
      }
      return context.dataSources.db.comment.update({
        where: { id },
        data: { content },
        include: { author: true, article: true },
      });
    },
    deleteComment: async (_parent, { id }: { id: number }, context: DataSourceContext) => {
      await simulateDelay();
      if (!context.user) {
        throw new Error("Unauthorized: Please log in");
      }
      const comment = await context.dataSources.db.comment.findUnique({ where: { id } });
      if (!comment) {
        throw new Error("Comment not found");
      }
      if (comment.authorId !== context.user.id) {
        throw new Error("Forbidden: You can only delete your own comments");
      }
      await context.dataSources.db.comment.delete({ where: { id } });
      return true;
    },
    register: async (_parent, args, context: DataSourceContext) => {
      await simulateDelay();
      const parsed = registerSchema.safeParse(args);
      if (!parsed.success) {
        throw new Error(`Validation failed: ${parsed.error.issues.map((i) => i.message).join(", ")}`);
      }
      const { email, password, name } = parsed.data;
      const existingUser = await context.dataSources.db.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await context.dataSources.db.user.create({
        data: { email, password: hashedPassword, name },
      });
      const token = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await context.dataSources.db.refreshToken.create({
        data: { token: hashedRefreshToken, userId: user.id },
      });
      return { token, refreshToken, user };
    },
    login: async (_parent, args, context: DataSourceContext) => {
      await simulateDelay();
      const parsed = loginSchema.safeParse(args);
      if (!parsed.success) {
        throw new Error(`Validation failed: ${parsed.error.issues.map((i) => i.message).join(", ")}`);
      }
      const { email, password } = parsed.data;
      const user = await context.dataSources.db.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid email or password");
      }
      const token = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await context.dataSources.db.refreshToken.create({
        data: { token: hashedRefreshToken, userId: user.id },
      });
      return { token, refreshToken, user };
    },
    logout: async (_parent, { refreshToken }, context: DataSourceContext): Promise<boolean> => {
      await simulateDelay();
      if (!context.user) {
        throw new Error("Unauthorized: Please log in to log out");
      }
      if (!refreshToken) {
        throw new Error("Refresh token required");
      }

      try {
        // NEW: Verify this is actually a valid refresh token
        verifyRefreshToken(refreshToken);

        // Find all refresh tokens for the user
        const userRefreshTokens = await context.dataSources.db.refreshToken.findMany({
          where: { userId: context.user.id },
        });

        // Check if the provided refresh token matches any of the stored hashed tokens
        let matchedToken: RefreshToken | null = null;
        for (const storedToken of userRefreshTokens) {
          const isMatch = await bcrypt.compare(refreshToken, storedToken.token);
          if (isMatch) {
            matchedToken = storedToken;
            break;
          }
        }

        if (!matchedToken) {
          throw new Error("Invalid refresh token");
        }

        // Delete the matched refresh token
        await context.dataSources.db.refreshToken.delete({
          where: { id: matchedToken.id },
        });

        return true;
      } catch (error) {
        throw new Error(`Logout failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    },
    likeArticle: async (_parent, { articleId }, context) => {
      const userId = context.user?.id;
      if (!userId) {
        throw new Error("Unauthorized");
      }
      if (!articleId) {
        throw new Error("Article ID is required");
      }
      const existingLike = await context.dataSources.db.like.findFirst({
        where: { userId, articleId },
      });
      if (existingLike) {
        throw new Error("You have already liked this article");
      }
      const article = await context.dataSources.db.article.findUnique({
        where: { id: articleId },
        include: { likes: true },
      });
      if (!article) {
        throw new Error("Article not found");
      }
      const like = await context.dataSources.db.like.create({
        data: { articleId, userId },
        include: {
          user: true,
          article: {
            include: { author: true, comments: { include: { author: true } } },
          },
        },
      });
      if (!like) {
        throw new Error("Failed to like article");
      }
      await context.dataSources.db.article.update({
        where: { id: articleId },
        data: { likes: { connect: { id: like.id } } },
      });
      return like;
    },
    unlikeArticle: async (_parent, { articleId }, context: DataSourceContext): Promise<boolean> => {
      await simulateDelay();
      if (!context.user) {
        throw new Error("Unauthorized: Please log in");
      }
      const existingLike = await context.dataSources.db.like.findFirst({
        where: { userId: context.user.id, articleId },
      });
      if (!existingLike) {
        throw new Error("Like not found");
      }
      await context.dataSources.db.like.delete({ where: { id: existingLike.id } });
      return true;
    },
  },
};
