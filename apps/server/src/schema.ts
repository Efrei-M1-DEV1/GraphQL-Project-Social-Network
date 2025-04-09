export const typeDefs = `#graphql
  scalar DateTime

  type User {
    id: Int!
    email: String!
    name: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Article {
    id: Int!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Like {
    id: Int!
    user: User!
    article: Article!
    createdAt: DateTime!
  }

  type Comment {
    id: Int!
    content: String!
    author: User!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    hello: String
    users: [User!]!
    articles(first: Int, after: Int): [Article!]!
    article(id: Int!): Article
    articlesByAuthor(authorId: Int!, first: Int, after: Int): [Article!]!
  }

  type Mutation {
    createArticle(title: String!, content: String!): Article!
    updateArticle(id: Int!, title: String, content: String): Article!
    deleteArticle(id: Int!): Boolean!
    register(email: String!, password: String!, name: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    likeArticle(articleId: Int!): Like!
    unlikeArticle(articleId: Int!): Boolean!
    createComment(content: String!, articleId: Int!): Comment!
    updateComment(id: Int!, content: String!): Comment!
    deleteComment(id: Int!): Boolean!
  }
`;
