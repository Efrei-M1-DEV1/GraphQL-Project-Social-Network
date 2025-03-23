export const typeDefs = `#graphql
  type User {
    id: Int!
    email: String!
    name: String
  }
  type Query {
    hello: String
    users: [User!]!
  }
`;
