import { loginSchema, registerSchema } from "@repo/utils/schemas/auth";
import bcrypt from "bcrypt";
import type { DataSourceContext } from "./context";
import type { Resolvers } from "./types"; // Generated by GraphQL Codegen
import { generateToken } from "./utils/jwt.js";

// Helper function to simulate a delay in development environment
const simulateDelay = async () => {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};

export const resolvers: Resolvers = {
  Query: {
    hello: async () => {
      // Simulate a delay for demonstration purposes
      await simulateDelay();

      return "Hello, GraphQL!";
    },
    users: async (_parent, _args, context: DataSourceContext) => {
      // Simulate a delay for demonstration purposes
      await simulateDelay();

      const users = await context.dataSources.db.user.findMany();
      return users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(), // Convert Date to ISO string
        updatedAt: user.updatedAt.toISOString(), // Convert Date to ISO string
      }));
    },
    article: async (_parent, { id }, context: DataSourceContext) => {
      // Simulate a delay for demonstration purposes
      await simulateDelay();

      const article = await context.dataSources.db.article.findUnique({
        where: { id },
        include: {
          author: true,
          comments: {
            include: {
              author: true,
            },
          },
        },
      });
      if (!article) {
        return null;
      }
      return {
        ...article,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
        author: {
          ...article.author,
          createdAt: article.author.createdAt.toISOString(),
          updatedAt: article.author.updatedAt.toISOString(),
        },
        comments: article.comments.map((comment) => ({
          ...comment,
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt.toISOString(),

          author: {
            ...comment.author,
            createdAt: comment.author.createdAt.toISOString(),
            updatedAt: comment.author.updatedAt.toISOString(),
          },
        })),
      };
    },
    articles: async (_parent, { first, after }, context: DataSourceContext) => {
      // Simulate a delay for demonstration purposes
      await simulateDelay();

      const articles = await context.dataSources.db.article.findMany({
        take: first || 10,
        skip: after || 0,
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          comments: {
            include: { author: true },
          },
        },
      });

      return articles.map((article) => ({
        ...article,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
        author: {
          ...article.author,
          createdAt: article.author.createdAt.toISOString(),
          updatedAt: article.author.updatedAt.toISOString(),
        },
        comments: article.comments.map((comment) => ({
          ...comment,
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt.toISOString(),
          author: {
            ...comment.author,
            createdAt: comment.author.createdAt.toISOString(),
            updatedAt: comment.author.updatedAt.toISOString(),
          },
        })),
      }));
    },
    articlesByAuthor: async (_parent, { authorId, first, after }, context: DataSourceContext) => {
      // Simulate a delay for demonstration purposes
      await simulateDelay();

      const articles = await context.dataSources.db.article.findMany({
        where: { authorId },
        take: first || 10,
        skip: after || 0,
        orderBy: { createdAt: "desc" },
        include: { author: true, comments: { include: { author: true } } },
      });
      return articles.map((article) => ({
        ...article,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
        author: {
          ...article.author,
          createdAt: article.author.createdAt.toISOString(),
          updatedAt: article.author.updatedAt.toISOString(),
        },
        comments: article.comments.map((comment) => ({
          ...comment,
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt.toISOString(),
          author: {
            ...comment.author,
            createdAt: comment.author.createdAt.toISOString(),
            updatedAt: comment.author.updatedAt.toISOString(),
          },
        })),
      }));
    },
  },
  Mutation: {
    createArticle: async (_parent, { title, content }, context: DataSourceContext) => {
      // Simulate a delay for demonstration purposes
      await simulateDelay();

      if (!context.user) {
        throw new Error("Unauthorized: Please log in");
      }
      const article = await context.dataSources.db.article.create({
        data: {
          title,
          content,
          authorId: context.user.id,
        },
        include: { author: true },
      });
      return {
        ...article,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
        author: {
          ...article.author,
          createdAt: article.author.createdAt.toISOString(),
          updatedAt: article.author.updatedAt.toISOString(),
        },
        comments: [],
      };
    },
    updateArticle: async (_parent, { id, title, content }, context: DataSourceContext) => {
      // Simulate a delay for demonstration purposes
      await simulateDelay();

      if (!context.user) {
        throw new Error("Unauthorized: Please log in");
      }
      const article = await context.dataSources.db.article.findUnique({
        where: { id },
      });
      if (!article) {
        throw new Error("Article not found");
      }
      if (article.authorId !== context.user.id) {
        throw new Error("Forbidden: You can only update your own articles");
      }

      const updatedArticle = await context.dataSources.db.article.update({
        where: { id },
        data: { title: title ?? undefined, content: content ?? undefined },
        include: {
          author: true,
          comments: {
            include: { author: true },
          },
        },
      });

      return {
        ...updatedArticle,
        createdAt: updatedArticle.createdAt.toISOString(),
        updatedAt: updatedArticle.updatedAt.toISOString(),
        author: {
          ...updatedArticle.author,
          createdAt: updatedArticle.author.createdAt.toISOString(),
          updatedAt: updatedArticle.author.updatedAt.toISOString(),
        },
        comments: updatedArticle.comments.map((comment) => ({
          ...comment,
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt.toISOString(),
          author: {
            ...comment.author,
            createdAt: comment.author.createdAt.toISOString(),
            updatedAt: comment.author.updatedAt.toISOString(),
          },
        })),
      };
    },
    deleteArticle: async (_parent, { id }, context: DataSourceContext) => {
      // Simulate a delay for demonstration purposes
      await simulateDelay();

      if (!context.user) {
        throw new Error("Unauthorized: Please log in");
      }
      const article = await context.dataSources.db.article.findUnique({
        where: { id },
      });
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

      const article = await context.dataSources.db.article.findUnique({
        where: { id: articleId },
      });

      if (!article) {
        throw new Error("Article not found");
      }

      const comment = await context.dataSources.db.comment.create({
        data: {
          content,
          articleId,
          authorId: context.user.id,
        },
        include: {
          author: true,
          article: true,
        },
      });

      return {
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
        author: {
          ...comment.author,
          createdAt: comment.author.createdAt.toISOString(),
          updatedAt: comment.author.updatedAt.toISOString(),
        },
      };
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
      const updatedComment = await context.dataSources.db.comment.update({
        where: { id },
        data: { content },
        include: { author: true, article: true },
      });
      return {
        ...updatedComment,
        createdAt: updatedComment.createdAt.toISOString(),
        updatedAt: updatedComment.updatedAt.toISOString(),
        author: {
          ...updatedComment.author,
          createdAt: updatedComment.author.createdAt.toISOString(),
          updatedAt: updatedComment.author.updatedAt.toISOString(),
        },
        article: {
          ...updatedComment.article,
          createdAt: updatedComment.article.createdAt.toISOString(),
          updatedAt: updatedComment.article.updatedAt.toISOString(),
        },
      };
    },

    deleteComment: async (_parent, { id }: { id: number }, context: DataSourceContext) => {
      await simulateDelay();

      if (!context.user) {
        throw new Error("Unauthorized: Please log in");
      }
      const comment = await context.dataSources.db.comment.findUnique({
        where: { id },
      });
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
      // Simulate a delay for demonstration purposes
      await simulateDelay();

      const parsed = registerSchema.safeParse(args);
      if (!parsed.success) {
        throw new Error(`Validation failed: ${parsed.error.issues.map((i) => i.message).join(", ")}`);
      }
      const { email, password, name } = parsed.data;

      const existingUser = await context.dataSources.db.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await context.dataSources.db.user.create({
        data: { email, password: hashedPassword, name },
      });
      const token = generateToken(user.id);
      return {
        token,
        user: {
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      };
    },
    login: async (_parent, args, context: DataSourceContext) => {
      // Simulate a delay for demonstration purposes
      await simulateDelay();

      const parsed = loginSchema.safeParse(args);
      if (!parsed.success) {
        throw new Error(`Validation failed: ${parsed.error.issues.map((i) => i.message).join(", ")}`);
      }
      const { email, password } = parsed.data;

      const user = await context.dataSources.db.user.findUnique({
        where: { email },
      });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid email or password");
      }

      const token = generateToken(user.id);
      return {
        token,
        user: {
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      };
    },
  },
};
