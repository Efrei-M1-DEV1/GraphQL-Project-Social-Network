import { GraphQLResolveInfo } from "graphql";
import { DataSourceContext } from "./context";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Article = {
  __typename?: "Article";
  author: User;
  content: Scalars["String"]["output"];
  createdAt: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  title: Scalars["String"]["output"];
  updatedAt: Scalars["String"]["output"];
};

export type AuthPayload = {
  __typename?: "AuthPayload";
  token: Scalars["String"]["output"];
  user: User;
};

export type Comment = {
  __typename?: "Comment";
  article: Article;
  author: User;
  content: Scalars["String"]["output"];
  createdAt: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  updatedAt: Scalars["String"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  createArticle: Article;
  createComment: Comment;
  deleteArticle: Scalars["Boolean"]["output"];
  login: AuthPayload;
  register: AuthPayload;
  updateArticle: Article;
};

export type MutationCreateArticleArgs = {
  content: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
};

export type MutationCreateCommentArgs = {
  articleId: Scalars["Int"]["input"];
  content: Scalars["String"]["input"];
};

export type MutationDeleteArticleArgs = {
  id: Scalars["Int"]["input"];
};

export type MutationLoginArgs = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type MutationRegisterArgs = {
  email: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type MutationUpdateArticleArgs = {
  content?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["Int"]["input"];
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type Query = {
  __typename?: "Query";
  article?: Maybe<Article>;
  articles: Array<Article>;
  articlesByAuthor: Array<Article>;
  hello?: Maybe<Scalars["String"]["output"]>;
  users: Array<User>;
};

export type QueryArticleArgs = {
  id: Scalars["Int"]["input"];
};

export type QueryArticlesArgs = {
  after?: InputMaybe<Scalars["Int"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryArticlesByAuthorArgs = {
  after?: InputMaybe<Scalars["Int"]["input"]>;
  authorId: Scalars["Int"]["input"];
  first?: InputMaybe<Scalars["Int"]["input"]>;
};

export type User = {
  __typename?: "User";
  createdAt: Scalars["String"]["output"];
  email: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  name?: Maybe<Scalars["String"]["output"]>;
  updatedAt: Scalars["String"]["output"];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Article: ResolverTypeWrapper<Article>;
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  Comment: ResolverTypeWrapper<Comment>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Article: Article;
  AuthPayload: AuthPayload;
  Boolean: Scalars["Boolean"]["output"];
  Comment: Comment;
  Int: Scalars["Int"]["output"];
  Mutation: {};
  Query: {};
  String: Scalars["String"]["output"];
  User: User;
};

export type ArticleResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes["Article"] = ResolversParentTypes["Article"],
> = {
  author?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  content?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthPayloadResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes["AuthPayload"] = ResolversParentTypes["AuthPayload"],
> = {
  token?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes["Comment"] = ResolversParentTypes["Comment"],
> = {
  article?: Resolver<ResolversTypes["Article"], ParentType, ContextType>;
  author?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  content?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"],
> = {
  createArticle?: Resolver<
    ResolversTypes["Article"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateArticleArgs, "content" | "title">
  >;
  createComment?: Resolver<
    ResolversTypes["Comment"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateCommentArgs, "articleId" | "content">
  >;
  deleteArticle?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType, RequireFields<MutationDeleteArticleArgs, "id">>;
  login?: Resolver<
    ResolversTypes["AuthPayload"],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "email" | "password">
  >;
  register?: Resolver<
    ResolversTypes["AuthPayload"],
    ParentType,
    ContextType,
    RequireFields<MutationRegisterArgs, "email" | "name" | "password">
  >;
  updateArticle?: Resolver<ResolversTypes["Article"], ParentType, ContextType, RequireFields<MutationUpdateArticleArgs, "id">>;
};

export type QueryResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = {
  article?: Resolver<Maybe<ResolversTypes["Article"]>, ParentType, ContextType, RequireFields<QueryArticleArgs, "id">>;
  articles?: Resolver<Array<ResolversTypes["Article"]>, ParentType, ContextType, Partial<QueryArticlesArgs>>;
  articlesByAuthor?: Resolver<
    Array<ResolversTypes["Article"]>,
    ParentType,
    ContextType,
    RequireFields<QueryArticlesByAuthorArgs, "authorId">
  >;
  hello?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes["User"]>, ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"],
> = {
  createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = DataSourceContext> = {
  Article?: ArticleResolvers<ContextType>;
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};
