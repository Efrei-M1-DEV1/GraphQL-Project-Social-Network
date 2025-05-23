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
  "\n  query ArticleDetails($articleId: Int!) {\n    article(id: $articleId) {\n      id\n      title\n      content\n      createdAt\n      commentCount\n      likeCount\n      author {\n        id\n        name\n      }\n    }\n  }\n": typeof types.ArticleDetailsDocument;
  "\n  mutation LikeArticle($articleId: Int!) {\n    likeArticle(articleId: $articleId) {\n      id\n      article {\n        id\n        likeCount\n      }\n    }\n  }\n": typeof types.LikeArticleDocument;
  "\n  mutation UnlikeArticle($articleId: Int!) {\n    unlikeArticle(articleId: $articleId)\n  }\n": typeof types.UnlikeArticleDocument;
  "\n  mutation UpdateArticleQ1($updateArticleId: Int!, $title: String, $content: String) {\n    updateArticle(id: $updateArticleId, title: $title, content: $content) {\n      id\n      title\n      content\n      updatedAt\n    }\n  }\n": typeof types.UpdateArticleQ1Document;
  "\n  query PaginatedArticleComments($articleId: Int!, $first: Int, $after: String, $sort: SortOrder) {\n    commentsByArticle(articleId: $articleId, first: $first, after: $after, sort: $sort) {\n      edges {\n        node {\n          id\n          content\n          createdAt\n          author {\n            id\n            name\n          }\n        }\n        cursor\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": typeof types.PaginatedArticleCommentsDocument;
  "\n  mutation CreateArticleComment($content: String!, $articleId: Int!) {\n    createComment(content: $content, articleId: $articleId) {\n      id\n      content\n      createdAt\n      author {\n        id\n        name\n      }\n    }\n  }\n": typeof types.CreateArticleCommentDocument;
  "\n  mutation DeleteArticleComment($deleteCommentId: Int!) {\n    deleteComment(id: $deleteCommentId)\n  }\n": typeof types.DeleteArticleCommentDocument;
  "\n  query Hello {\n    hello\n  }\n": typeof types.HelloDocument;
  "\n  mutation RefreshToken($token: String!) {\n    refreshToken(token: $token) {\n      token\n      refreshToken\n    }\n  }\n": typeof types.RefreshTokenDocument;
  "\n  query HasLikedArticle($articleId: Int!) {\n    hasLikedArticle(articleId: $articleId)\n  }\n": typeof types.HasLikedArticleDocument;
  "\n  mutation CreateArticle($title: String!, $content: String!) {\n  createArticle(title: $title, content: $content) {\n    id\n    author {\n      name\n    }\n  }\n}\n": typeof types.CreateArticleDocument;
  "\n  query Articles($first: Int, $after: String) {\n    articles(first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          title\n          content\n          createdAt\n          author {\n            name\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n": typeof types.ArticlesDocument;
  "\nquery Query($id: Int!) {\n  article(id: $id) {\n    id\n    title\n    content\n  }\n}\n": typeof types.QueryDocument;
  "\n  mutation UpdateArticle($id: Int!, $title: String!, $content: String!) {\n    updateArticle(id: $id, title: $title, content: $content) {\n      id\n      title\n      content\n    }\n  }\n": typeof types.UpdateArticleDocument;
  "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      token\n      refreshToken\n    }\n  }\n": typeof types.LoginDocument;
  "\n  mutation Register($email: String!, $password: String!, $name: String!) {\n    register(email: $email, password: $password, name: $name) {\n      token\n      refreshToken\n    }\n  }\n": typeof types.RegisterDocument;
};
const documents: Documents = {
  "\n  query ArticleDetails($articleId: Int!) {\n    article(id: $articleId) {\n      id\n      title\n      content\n      createdAt\n      commentCount\n      likeCount\n      author {\n        id\n        name\n      }\n    }\n  }\n":
    types.ArticleDetailsDocument,
  "\n  mutation LikeArticle($articleId: Int!) {\n    likeArticle(articleId: $articleId) {\n      id\n      article {\n        id\n        likeCount\n      }\n    }\n  }\n":
    types.LikeArticleDocument,
  "\n  mutation UnlikeArticle($articleId: Int!) {\n    unlikeArticle(articleId: $articleId)\n  }\n": types.UnlikeArticleDocument,
  "\n  mutation UpdateArticleQ1($updateArticleId: Int!, $title: String, $content: String) {\n    updateArticle(id: $updateArticleId, title: $title, content: $content) {\n      id\n      title\n      content\n      updatedAt\n    }\n  }\n":
    types.UpdateArticleQ1Document,
  "\n  query PaginatedArticleComments($articleId: Int!, $first: Int, $after: String, $sort: SortOrder) {\n    commentsByArticle(articleId: $articleId, first: $first, after: $after, sort: $sort) {\n      edges {\n        node {\n          id\n          content\n          createdAt\n          author {\n            id\n            name\n          }\n        }\n        cursor\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n":
    types.PaginatedArticleCommentsDocument,
  "\n  mutation CreateArticleComment($content: String!, $articleId: Int!) {\n    createComment(content: $content, articleId: $articleId) {\n      id\n      content\n      createdAt\n      author {\n        id\n        name\n      }\n    }\n  }\n":
    types.CreateArticleCommentDocument,
  "\n  mutation DeleteArticleComment($deleteCommentId: Int!) {\n    deleteComment(id: $deleteCommentId)\n  }\n":
    types.DeleteArticleCommentDocument,
  "\n  query Hello {\n    hello\n  }\n": types.HelloDocument,
  "\n  mutation RefreshToken($token: String!) {\n    refreshToken(token: $token) {\n      token\n      refreshToken\n    }\n  }\n":
    types.RefreshTokenDocument,
  "\n  query HasLikedArticle($articleId: Int!) {\n    hasLikedArticle(articleId: $articleId)\n  }\n":
    types.HasLikedArticleDocument,
  "\n  mutation CreateArticle($title: String!, $content: String!) {\n  createArticle(title: $title, content: $content) {\n    id\n    author {\n      name\n    }\n  }\n}\n":
    types.CreateArticleDocument,
  "\n  query Articles($first: Int, $after: String) {\n    articles(first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          title\n          content\n          createdAt\n          author {\n            name\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n":
    types.ArticlesDocument,
  "\nquery Query($id: Int!) {\n  article(id: $id) {\n    id\n    title\n    content\n  }\n}\n": types.QueryDocument,
  "\n  mutation UpdateArticle($id: Int!, $title: String!, $content: String!) {\n    updateArticle(id: $id, title: $title, content: $content) {\n      id\n      title\n      content\n    }\n  }\n":
    types.UpdateArticleDocument,
  "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      token\n      refreshToken\n    }\n  }\n":
    types.LoginDocument,
  "\n  mutation Register($email: String!, $password: String!, $name: String!) {\n    register(email: $email, password: $password, name: $name) {\n      token\n      refreshToken\n    }\n  }\n":
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
export function graphql(
  source: "\n  query ArticleDetails($articleId: Int!) {\n    article(id: $articleId) {\n      id\n      title\n      content\n      createdAt\n      commentCount\n      likeCount\n      author {\n        id\n        name\n      }\n    }\n  }\n",
): (typeof documents)["\n  query ArticleDetails($articleId: Int!) {\n    article(id: $articleId) {\n      id\n      title\n      content\n      createdAt\n      commentCount\n      likeCount\n      author {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation LikeArticle($articleId: Int!) {\n    likeArticle(articleId: $articleId) {\n      id\n      article {\n        id\n        likeCount\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation LikeArticle($articleId: Int!) {\n    likeArticle(articleId: $articleId) {\n      id\n      article {\n        id\n        likeCount\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation UnlikeArticle($articleId: Int!) {\n    unlikeArticle(articleId: $articleId)\n  }\n",
): (typeof documents)["\n  mutation UnlikeArticle($articleId: Int!) {\n    unlikeArticle(articleId: $articleId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation UpdateArticleQ1($updateArticleId: Int!, $title: String, $content: String) {\n    updateArticle(id: $updateArticleId, title: $title, content: $content) {\n      id\n      title\n      content\n      updatedAt\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateArticleQ1($updateArticleId: Int!, $title: String, $content: String) {\n    updateArticle(id: $updateArticleId, title: $title, content: $content) {\n      id\n      title\n      content\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query PaginatedArticleComments($articleId: Int!, $first: Int, $after: String, $sort: SortOrder) {\n    commentsByArticle(articleId: $articleId, first: $first, after: $after, sort: $sort) {\n      edges {\n        node {\n          id\n          content\n          createdAt\n          author {\n            id\n            name\n          }\n        }\n        cursor\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n",
): (typeof documents)["\n  query PaginatedArticleComments($articleId: Int!, $first: Int, $after: String, $sort: SortOrder) {\n    commentsByArticle(articleId: $articleId, first: $first, after: $after, sort: $sort) {\n      edges {\n        node {\n          id\n          content\n          createdAt\n          author {\n            id\n            name\n          }\n        }\n        cursor\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateArticleComment($content: String!, $articleId: Int!) {\n    createComment(content: $content, articleId: $articleId) {\n      id\n      content\n      createdAt\n      author {\n        id\n        name\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateArticleComment($content: String!, $articleId: Int!) {\n    createComment(content: $content, articleId: $articleId) {\n      id\n      content\n      createdAt\n      author {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation DeleteArticleComment($deleteCommentId: Int!) {\n    deleteComment(id: $deleteCommentId)\n  }\n",
): (typeof documents)["\n  mutation DeleteArticleComment($deleteCommentId: Int!) {\n    deleteComment(id: $deleteCommentId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Hello {\n    hello\n  }\n"): (typeof documents)["\n  query Hello {\n    hello\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation RefreshToken($token: String!) {\n    refreshToken(token: $token) {\n      token\n      refreshToken\n    }\n  }\n",
): (typeof documents)["\n  mutation RefreshToken($token: String!) {\n    refreshToken(token: $token) {\n      token\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query HasLikedArticle($articleId: Int!) {\n    hasLikedArticle(articleId: $articleId)\n  }\n",
): (typeof documents)["\n  query HasLikedArticle($articleId: Int!) {\n    hasLikedArticle(articleId: $articleId)\n  }\n"];
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
  source: "\n  query Articles($first: Int, $after: String) {\n    articles(first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          title\n          content\n          createdAt\n          author {\n            name\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n",
): (typeof documents)["\n  query Articles($first: Int, $after: String) {\n    articles(first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          title\n          content\n          createdAt\n          author {\n            name\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\nquery Query($id: Int!) {\n  article(id: $id) {\n    id\n    title\n    content\n  }\n}\n",
): (typeof documents)["\nquery Query($id: Int!) {\n  article(id: $id) {\n    id\n    title\n    content\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation UpdateArticle($id: Int!, $title: String!, $content: String!) {\n    updateArticle(id: $id, title: $title, content: $content) {\n      id\n      title\n      content\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateArticle($id: Int!, $title: String!, $content: String!) {\n    updateArticle(id: $id, title: $title, content: $content) {\n      id\n      title\n      content\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      token\n      refreshToken\n    }\n  }\n",
): (typeof documents)["\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      token\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation Register($email: String!, $password: String!, $name: String!) {\n    register(email: $email, password: $password, name: $name) {\n      token\n      refreshToken\n    }\n  }\n",
): (typeof documents)["\n  mutation Register($email: String!, $password: String!, $name: String!) {\n    register(email: $email, password: $password, name: $name) {\n      token\n      refreshToken\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<infer TType, any>
  ? TType
  : never;
