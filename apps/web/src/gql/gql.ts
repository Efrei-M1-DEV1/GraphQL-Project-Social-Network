import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
/* eslint-disable */
import * as types from "./graphql";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  "\n  query Hello {\n    hello\n  }\n": typeof types.HelloDocument;
  "\n  query GetArticle($id: Int!) {\n    article(id: $id) {\n      id\n      title\n      content\n      createdAt\n      author {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetArticleDocument;
  "\n  mutation CreateArticle($title: String!, $content: String!) {\n  createArticle(title: $title, content: $content) {\n    id\n    author {\n      name\n    }\n  }\n}\n": typeof types.CreateArticleDocument;
  "\n  query Articles($first: Int, $after: Int) {\n    articles(first: $first, after: $after) {\n      id,\n      title\n      content\n    }\n  }\n": typeof types.ArticlesDocument;
  "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      token\n      user {\n        id\n        name\n      }\n    }\n  }\n": typeof types.LoginDocument;
  "\n  mutation Register($email: String!, $password: String!, $name: String!) {\n    register(email: $email, password: $password, name: $name) {\n      token\n      user {\n        id\n        name\n      }\n    }\n  }\n": typeof types.RegisterDocument;
};
const documents: Documents = {
  "\n  query Hello {\n    hello\n  }\n": types.HelloDocument,
  "\n  query GetArticle($id: Int!) {\n    article(id: $id) {\n      id\n      title\n      content\n      createdAt\n      author {\n        id\n        name\n      }\n    }\n  }\n":
    types.GetArticleDocument,
  "\n  mutation CreateArticle($title: String!, $content: String!) {\n  createArticle(title: $title, content: $content) {\n    id\n    author {\n      name\n    }\n  }\n}\n":
    types.CreateArticleDocument,
  "\n  query Articles($first: Int, $after: Int) {\n    articles(first: $first, after: $after) {\n      id,\n      title\n      content\n    }\n  }\n":
    types.ArticlesDocument,
  "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      token\n      user {\n        id\n        name\n      }\n    }\n  }\n":
    types.LoginDocument,
  "\n  mutation Register($email: String!, $password: String!, $name: String!) {\n    register(email: $email, password: $password, name: $name) {\n      token\n      user {\n        id\n        name\n      }\n    }\n  }\n":
    types.RegisterDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Hello {\n    hello\n  }\n"): (typeof documents)["\n  query Hello {\n    hello\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetArticle($id: Int!) {\n    article(id: $id) {\n      id\n      title\n      content\n      createdAt\n      author {\n        id\n        name\n      }\n    }\n  }\n",
): (typeof documents)["\n  query GetArticle($id: Int!) {\n    article(id: $id) {\n      id\n      title\n      content\n      createdAt\n      author {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateArticle($title: String!, $content: String!) {\n  createArticle(title: $title, content: $content) {\n    id\n    author {\n      name\n    }\n  }\n}\n",
): (typeof documents)["\n  mutation CreateArticle($title: String!, $content: String!) {\n  createArticle(title: $title, content: $content) {\n    id\n    author {\n      name\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query Articles($first: Int, $after: Int) {\n    articles(first: $first, after: $after) {\n      id,\n      title\n      content\n    }\n  }\n",
): (typeof documents)["\n  query Articles($first: Int, $after: Int) {\n    articles(first: $first, after: $after) {\n      id,\n      title\n      content\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      token\n      user {\n        id\n        name\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      token\n      user {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation Register($email: String!, $password: String!, $name: String!) {\n    register(email: $email, password: $password, name: $name) {\n      token\n      user {\n        id\n        name\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation Register($email: String!, $password: String!, $name: String!) {\n    register(email: $email, password: $password, name: $name) {\n      token\n      user {\n        id\n        name\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<infer TType, any>
  ? TType
  : never;
