import { loginSchema, registerSchema } from "@repo/utils/schemas/auth";
import bcrypt from "bcrypt";
import { DateTimeResolver } from "graphql-scalars";
import type { DataSourceContext } from "./context";
import type { Resolvers } from "./types";
import { generateToken } from "./utils/jwt.js";

// Helper function to simulate a delay in development environment
const simulateDelay = async () => {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
};

export const resolvers: Resolvers = {
  DateTime: DateTimeResolver, // Add the DateTime scalar resolver

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
        include: {
          author: true,
          comments: {
            include: { author: true },
          },
        },
      });
      return article;
    },
    articles: async (_parent, { first, after }, context: DataSourceContext) => {
      await simulateDelay();
      return context.dataSources.db.article.findMany({
        take: first || 10,
        skip: after || 0,
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          comments: { include: { author: true } },
        },
      });
    },
    articlesByAuthor: async (_parent, { authorId, first, after }, context: DataSourceContext) => {
      await simulateDelay();
      return context.dataSources.db.article.findMany({
        where: { authorId },
        take: first || 10,
        skip: after || 0,
        orderBy: { createdAt: "desc" },
        include: { author: true, comments: { include: { author: true } } },
      });
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
      return { token, user };
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
      return { token, user };
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
