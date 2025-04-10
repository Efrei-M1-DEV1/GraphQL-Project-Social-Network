import { Link } from "@/components/link";
import { RefreshSpinner } from "@/components/refresh-spinner";
import { graphql } from "@/gql";
import type { ArticlesQuery } from "@/gql/graphql";

import { useSuspenseQuery } from "@apollo/client";
import { Badge } from "@repo/ui/data-display/badge";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@repo/ui/data-display/card";
import { Button } from "@repo/ui/form/button";
import { Heading } from "@repo/ui/typography/heading";
import { Suspense, useState, useTransition } from "react";

import { Icon } from "@repo/ui/media/icon";
import { LinkBox, LinkOverlay } from "@repo/ui/navigation/link";
import { motion } from "motion/react";
import { LuBookmark, LuClock, LuLoader, LuStar, LuTrendingUp } from "react-icons/lu";

const GET_ARTICLES = graphql(`
  query Articles($first: Int, $after: String) {
    articles(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          title
          content
          likeCount
          createdAt
          author {
            name
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`);

export default function ArticlesPage() {
  return (
    <div className="space-y-6">
      {/* Animated Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-500 p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <Heading className="mb-2 font-bold text-4xl tracking-tight">Discover Articles</Heading>
          <p className="max-w-2xl text-lg text-white/80">
            Explore our collection of thought-provoking articles written by industry experts.
          </p>
        </motion.div>
      </div>

      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <RefreshSpinner className="h-16 w-16 text-purple-500" />
          </div>
        }
      >
        <ArticleList />
      </Suspense>
    </div>
  );
}

export function ArticleList() {
  const [paginationParams, setPaginationParams] = useState({
    first: 10,
    after: null as string | null,
  });
  const [isPending, startTransition] = useTransition();

  const { data, error, fetchMore } = useSuspenseQuery<ArticlesQuery>(GET_ARTICLES, {
    errorPolicy: "all",
    variables: paginationParams,
  });

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <Icon as={LuBookmark} className="mx-auto h-10 w-10 text-red-400" />
        <p className="mt-4 text-red-800">Error loading articles: {error.message}</p>
      </div>
    );
  }

  if (!data?.articles?.edges || data.articles.edges.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-10 text-center">
        <p className="text-gray-500">No articles found. Check back soon for new content!</p>
      </div>
    );
  }

  const handleLoadMore = () => {
    if (data.articles.pageInfo.hasNextPage) {
      startTransition(() => {
        fetchMore({
          variables: {
            after: data.articles.pageInfo.endCursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            return {
              articles: {
                ...fetchMoreResult.articles,
                edges: [...(prev?.articles?.edges || []), ...(fetchMoreResult.articles?.edges || [])],
              },
            };
          },
        });
        setPaginationParams({
          ...paginationParams,
          after: data.articles.pageInfo.endCursor || null,
        });
      });
    }
  };

  const sortedArticles = [...data.articles.edges].sort((a, b) => (b.node.likeCount ?? 0) - (a.node.likeCount ?? 0));

  const featuredArticle = sortedArticles[0]?.node;

  return (
    <div className="space-y-8">
      {/* Featured Article with Enhanced Styling */}
      {featuredArticle && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <LinkBox asChild>
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500">
              <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] transition-all duration-300 group-hover:backdrop-blur-0" />
              <motion.div
                className="absolute inset-0 bg-[url('/article-pattern.svg')] opacity-10"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <div className="relative p-8 md:p-12">
                <Badge variant="outline" className="mb-4 bg-white/90 text-amber-600 backdrop-blur-md">
                  <Icon as={LuTrendingUp} className="mr-1 h-3 w-3" /> Featured
                </Badge>{" "}
                <LinkOverlay asChild>
                  <Link to={`/articles/${featuredArticle.id}`} className="hover:no-underline">
                    <h2 className="mb-4 line-clamp-2 font-bold text-2xl text-white transition-colors group-hover:text-white/90">
                      {featuredArticle.title}
                    </h2>
                  </Link>
                </LinkOverlay>
                <p className="mb-6 line-clamp-3 max-w-3xl text-white/80">{featuredArticle.content}</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/20 font-medium text-white">
                    {featuredArticle.author.name?.charAt(0) ?? "?"}
                  </div>
                  <div>
                    <p className="font-medium text-white">{featuredArticle.author.name}</p>
                    <div className="flex items-center text-white/70 text-xs">
                      <Icon as={LuClock} className="mr-1 h-3 w-3" />
                      {new Date(featuredArticle.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </LinkBox>
        </motion.div>
      )}

      {/* Article Grid with Staggered Animation */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.articles.edges.map(({ node: article }, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <LinkBox asChild>
              <Card className="h-full overflow-hidden border border-gray-100 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-purple-200 hover:shadow-purple-100/30 hover:shadow-xl dark:border-gray-800 dark:hover:border-purple-900">
                <CardHeader className="pb-2">
                  <CardDescription className="flex flex h-6 w-6 items-center items-center justify-center gap-2 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 font-bold text-gray-500 text-sm text-white text-xs uppercase">
                    {article.author.name?.charAt(0) ?? "?"}
                    {article.author.name}
                  </CardDescription>
                  <LinkOverlay asChild>
                    <Link to={`/articles/${article.id}`} className="group hover:no-underline">
                      <CardTitle className="line-clamp-2 text-xl transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {article.title}
                      </CardTitle>
                    </Link>
                  </LinkOverlay>
                </CardHeader>
                <CardBody className="gap-3">
                  <p className="line-clamp-3 text-gray-600 text-sm dark:text-gray-300">{article.content}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Badge variant="subtle" className="bg-gray-100 text-xs dark:bg-gray-800">
                      <Icon as={LuClock} className="mr-1 h-3 w-3" />
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Badge>
                    <span className="flex-1" />
                    <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 dark:bg-amber-950/30">
                      <Icon as={LuStar} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-amber-600 text-xs dark:text-amber-400">4.8</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </LinkBox>
          </motion.div>
        ))}
      </div>

      {/* Suspense-Compatible Load More Button */}
      {data.articles.pageInfo.hasNextPage && (
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleLoadMore}
            disabled={isPending}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-8 py-6 font-medium text-white hover:from-purple-600 hover:to-indigo-600"
          >
            {isPending ? (
              <>
                <Icon as={LuLoader} className="mr-2 h-4 w-4 animate-spin" />
                Loading more articles...
              </>
            ) : (
              <>
                Load More Articles
                <span className="-skew-x-12 -mt-0.5 absolute right-0 h-full w-12 transform bg-white/20 transition-all group-hover:translate-x-12" />
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
