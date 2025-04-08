export const typeDefs = `#graphql
   type User {
    id: Int!
    email: String!
    name: String
    createdAt: String!
    updatedAt: String!
  }

  type Article {
    id: Int!
    title: String!
    content: String!
    author: User!
    createdAt: String!
    updatedAt: String!
  }

  type Comment{
  id:Int!
  content: String!
  author: User!    
  article:  Article!
  createdAt: String!
  updatedAt: String! 
}
  

  type AuthPayload {
    token: String!
    user: User!
  }


  type Query {
    hello: String
    users: [User!]!
    articles(first: Int, after: Int): [Article!]! # All articles with pagination
    article(id: Int!): Article # Single article by ID
    articlesByAuthor(authorId: Int!, first: Int, after: Int): [Article!]! # Author-specific articles with pagination
  }

  type Mutation {
    createArticle(title: String!, content: String!): Article!
    updateArticle(id: Int!, title: String, content: String): Article!
    deleteArticle(id: Int!): Boolean!
    register(email: String!, password: String!, name: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createComment(content: String!, articleId: Int!): Comment!
  }
`;
