export const typeDefs = `#graphql
  scalar DateTime

  enum SortOrder {
    ASC
    DESC
  }

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
    commentCount: Int
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
    article: Article!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    token: String!
    refreshToken: String!
    user: User!
  }

  type ArticleConnection {
    edges: [ArticleEdge!]!
    pageInfo: PageInfo!
  }

  type ArticleEdge {
    node: Article!
    cursor: String!
  }

  type CommentConnection {
    edges: [CommentEdge!]!
    pageInfo: PageInfo!
  }

  type CommentEdge {
    node: Comment!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type Query {
    hello: String
    users: [User!]!
    articles(first: Int, after: String): ArticleConnection!
    article(id: Int!): Article
    articlesByAuthor(authorId: Int!, first: Int, after: String): ArticleConnection!
    commentsByArticle(articleId: Int!, first: Int, after: String, sort: SortOrder): CommentConnection!
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
    logout(refreshToken: String!): Boolean!
  }
`;
