import type { RefreshToken } from "@prisma/client";
import { createArticleSchema } from "@repo/utils/schemas/article";
import { loginSchema, registerSchema } from "@repo/utils/schemas/auth";
import { createCommentSchema, updateCommentSchema } from "@repo/utils/schemas/comment";
import { cursorSchema } from "@repo/utils/schemas/cursor";
import bcrypt from "bcrypt";
import { DateTimeResolver } from "graphql-scalars";
import type { DataSourceContext } from "./context";
import type { Resolvers } from "./types";
import { generateRefreshToken, generateToken, verifyRefreshToken } from "./utils/jwt.js";

type ArticleCursor = {
  createdAt: string;
  id: number;
};

type CommentCursor = {
  createdAt: string;
  id: number;
};

// Helper function to parse and validate the cursor
const parseCursor = (after: string): ArticleCursor | CommentCursor | null => {
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

  Article: {
    commentCount: async (article, _args, context: DataSourceContext) => {
      return context.dataSources.db.comment.count({
        where: { articleId: article.id },
      });
    },
    likeCount: async (article, _args, context: DataSourceContext) => {
      return context.dataSources.db.like.count({
        where: { articleId: article.id },
      });
    },
  },

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
      const article = await context.dataSources.db.article.findUnique({
        where: { id },
        include: { author: true },
      });
      if (!article) {
        throw new Error(`Article not found: Article with ID ${id} does not exist`);
      }
      return article;
    },
    articles: async (_parent, { first, after }, context: DataSourceContext) => {
      await simulateDelay();
      const take = first || 10;

      // Validate cursor
      const cursor = after ? parseCursor(after) : null;
      if (after && !cursor) {
        throw new Error("Invalid cursor provided: The provided cursor is not valid");
      }

      // Construct the where clause based on the cursor
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
        include: { author: true },
      });

      // Check if there are more articles
      const hasNextPage = articles.length > take;
      // If there are more articles, slice the array to return only the requested number
      const nodes = hasNextPage ? articles.slice(0, take) : articles;
      // Map the articles to edges
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

      // Validate authorId
      const author = await context.dataSources.db.user.findUnique({ where: { id: authorId } });
      if (!author) {
        throw new Error(`Author not found: User with ID ${authorId} does not exist`);
      }

      // Validate cursor
      const cursor = after ? parseCursor(after) : null;
      if (after && !cursor) {
        throw new Error("Invalid cursor provided: The provided cursor is not valid");
      }

      // Construct the where clause based on the cursor
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
        include: { author: true },
      });

      // Check if there are more articles
      const hasNextPage = articles.length > take;
      // If there are more articles, slice the array to return only the requested number
      const nodes = hasNextPage ? articles.slice(0, take) : articles;
      // Map the articles to edges
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
    commentsByArticle: async (_parent, { articleId, first, after, sort }, context: DataSourceContext) => {
      await simulateDelay();
      const take = first || 10;

      // Validate the article exists
      const article = await context.dataSources.db.article.findUnique({ where: { id: articleId } });
      if (!article) {
        throw new Error("Article not found");
      }

      // Validate cursor
      const cursor = after ? parseCursor(after) : null;
      if (after && !cursor) {
        throw new Error("Invalid cursor provided");
      }

      // Construct the where clause based on the cursor
      const where = {
        articleId,
        ...(cursor
          ? {
              OR: [
                { createdAt: { lt: new Date(cursor.createdAt) } },
                { createdAt: { equals: new Date(cursor.createdAt) }, id: { lt: cursor.id } },
              ],
            }
          : {}),
      };

      // Determine the order direction based on the sort argument
      const orderDirection = sort === "ASC" ? "asc" : "desc";

      const comments = await context.dataSources.db.comment.findMany({
        take: take + 1,
        where,
        orderBy: [{ createdAt: orderDirection }, { id: orderDirection }],
        include: { author: true, article: { include: { author: true } } },
      });

      // Check if there are more comments
      const hasNextPage = comments.length > take;
      // If there are more comments, slice the array to return only the requested number
      const nodes = hasNextPage ? comments.slice(0, take) : comments;
      // Map the comments to edges
      const edges = nodes.map((comment) => ({
        cursor: Buffer.from(
          JSON.stringify({
            createdAt: comment.createdAt.toISOString(),
            id: comment.id,
          }),
        ).toString("base64"),
        node: comment,
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
        throw new Error("Unauthorized: You must be logged in to create an article");
      }

      const parsed = createArticleSchema.safeParse({ title, content });

      if (!parsed.success) {
        throw new Error(`Validation failed: ${parsed.error.issues.map((i) => i.message).join(", ")}`);
      }

      const article = await context.dataSources.db.article.create({
        data: { title: parsed.data.title, content: parsed.data.content, authorId: context.user.id },
        include: { author: true },
      });
      return article;
    },
    updateArticle: async (_parent, { id, title, content }, context: DataSourceContext) => {
      await simulateDelay();
      if (!context.user) {
        throw new Error("Unauthorized: You must be logged in to update an article");
      }
      const article = await context.dataSources.db.article.findUnique({ where: { id } });
      if (!article) {
        throw new Error(`Article not found: Article with ID ${id} does not exist`);
      }
      if (article.authorId !== context.user.id) {
        throw new Error("Forbidden: You can only update articles that you created");
      }
      return context.dataSources.db.article.update({
        where: { id },
        data: { title: title ?? undefined, content: content ?? undefined },
        include: { author: true },
      });
    },
    deleteArticle: async (_parent, { id }, context: DataSourceContext) => {
      await simulateDelay();
      if (!context.user) {
        throw new Error("Unauthorized: You must be logged in to delete an article");
      }
      const article = await context.dataSources.db.article.findUnique({ where: { id } });
      if (!article) {
        throw new Error(`Article not found: Article with ID ${id} does not exist`);
      }
      if (article.authorId !== context.user.id) {
        throw new Error("Forbidden: You can only delete articles that you created");
      }

      const commentCount = await context.dataSources.db.comment.count({ where: { articleId: id } });
      await context.dataSources.db.article.delete({ where: { id } });
      return true;
    },
    createComment: async (_parent, args, context: DataSourceContext) => {
      await simulateDelay();
      if (!context.user) {
        throw new Error("Unauthorized: You must be logged in to create a comment");
      }

      // Validate input
      const parsed = createCommentSchema.safeParse(args);
      if (!parsed.success) {
        throw new Error(`Validation failed: ${parsed.error.issues.map((i) => i.message).join(", ")}`);
      }
      const { content, articleId } = parsed.data;

      const article = await context.dataSources.db.article.findUnique({ where: { id: articleId } });
      if (!article) {
        throw new Error("Article not found: The specified article does not exist");
      }

      return context.dataSources.db.comment.create({
        data: { content, articleId, authorId: context.user.id },
        include: { author: true, article: { include: { author: true } } },
      });
    },
    updateComment: async (_parent, args, context: DataSourceContext) => {
      await simulateDelay();
      if (!context.user) {
        throw new Error("Unauthorized: You must be logged in to update a comment");
      }

      // Validate input
      const parsed = updateCommentSchema.safeParse(args);
      if (!parsed.success) {
        throw new Error(`Validation failed: ${parsed.error.issues.map((i) => i.message).join(", ")}`);
      }
      const { id, content } = parsed.data;

      const comment = await context.dataSources.db.comment.findUnique({
        where: { id },
        include: { author: true },
      });
      if (!comment) {
        throw new Error("Comment not found: The specified comment does not exist");
      }
      if (comment.authorId !== context.user.id) {
        throw new Error("Forbidden: You can only update your own comments");
      }
      return context.dataSources.db.comment.update({
        where: { id },
        data: { content },
        include: { author: true, article: { include: { author: true } } },
      });
    },
    deleteComment: async (_parent, { id }: { id: number }, context: DataSourceContext) => {
      await simulateDelay();
      if (!context.user) {
        throw new Error("Unauthorized: You must be logged in to delete a comment");
      }
      const comment = await context.dataSources.db.comment.findUnique({
        where: { id },
        include: { author: true },
      });
      if (!comment) {
        throw new Error("Comment not found: The specified comment does not exist");
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
        throw new Error("Unauthorized: You must be logged in to log out");
      }
      if (!refreshToken) {
        throw new Error("Refresh token required");
      }

      try {
        verifyRefreshToken(refreshToken);

        const userRefreshTokens = await context.dataSources.db.refreshToken.findMany({
          where: { userId: context.user.id },
        });

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

        await context.dataSources.db.refreshToken.delete({
          where: { id: matchedToken.id },
        });

        return true;
      } catch (error) {
        throw new Error(`Logout failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    },
    refreshToken: async (_parent, { token }, context: DataSourceContext) => {
      await simulateDelay();
      if (!context.user) {
        throw new Error("Unauthorized: You must be logged in to refresh the token");
      }
      if (!token) {
        throw new Error("Refresh token required");
      }

      try {
        const userRefreshTokens = await context.dataSources.db.refreshToken.findMany({
          where: { userId: context.user.id },
        });

        let matchedToken: RefreshToken | null = null;
        for (const storedToken of userRefreshTokens) {
          const isMatch = await bcrypt.compare(token, storedToken.token);
          if (isMatch) {
            matchedToken = storedToken;
            break;
          }
        }

        if (!matchedToken) {
          throw new Error("Invalid refresh token");
        }

        const user = await context.dataSources.db.user.findUnique({
          where: { id: context.user.id },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const newToken = generateToken(context.user.id);
        const newRefreshToken = generateRefreshToken(context.user.id);
        const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);

        await context.dataSources.db.refreshToken.update({
          where: { id: matchedToken.id },
          data: { token: hashedNewRefreshToken },
        });

        return { token: newToken, refreshToken: newRefreshToken, user };
      } catch (error) {
        throw new Error(`Failed to refresh token: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    },
    likeArticle: async (_parent, { articleId }, context: DataSourceContext) => {
      await simulateDelay();
      const userId = context.user?.id;
      if (!userId) {
        throw new Error("Unauthorized: You must be logged in to like an article");
      }
      const existingLike = await context.dataSources.db.like.findFirst({
        where: { userId, articleId },
      });
      if (existingLike) {
        throw new Error("You have already liked this article");
      }
      const articleExists = await context.dataSources.db.article.count({ where: { id: articleId } });
      if (articleExists === 0) {
        throw new Error("Article not found");
      }
      const like = await context.dataSources.db.like.create({
        data: { articleId, userId },
        include: {
          user: true,
          article: { include: { author: true } },
        },
      });
      return like;
    },
    unlikeArticle: async (_parent, { articleId }, context: DataSourceContext): Promise<boolean> => {
      await simulateDelay();
      if (!context.user) {
        throw new Error("Unauthorized: You must be logged in to unlike an article");
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
