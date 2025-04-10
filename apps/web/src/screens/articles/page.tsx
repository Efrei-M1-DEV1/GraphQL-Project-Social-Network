import { Link } from "@/components/link";
import { RefreshSpinner } from "@/components/refresh-spinner";
import { graphql } from "@/gql";
import type { ArticlesQuery } from "@/gql/graphql";

import { useSuspenseQuery } from "@apollo/client";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "@repo/ui/data-display/card";
import { Button } from "@repo/ui/form/button";

import { Heading } from "@repo/ui/typography/heading";
import { Suspense, useState } from "react";

const GET_ARTICLES = graphql(`
  query Articles($first: Int, $after: String) {
    articles(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          title
          content
          author {
            id
            email
            name
            createdAt
            updatedAt
          }
          commentCount
          createdAt
          updatedAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`);

import type { TypedDocumentNode } from "@apollo/client";

const DELETE_ARTICLE = graphql(`
  mutation DeleteArticle($deleteArticleId: Int!) {
    deleteArticle(id: $deleteArticleId)
  }
`) as TypedDocumentNode<{ deleteArticle: boolean }, { deleteArticleId: number }>;

export default function ArticlesPage() {
  return (
    <div className="space-y-2">
      <Heading>Articles</Heading>
      <p>List of articles will be displayed here.</p>
      <Suspense fallback={<RefreshSpinner />}>
        <ArticleList />
      </Suspense>
    </div>
  );
}

export function ArticleList() {
  const [after, setAfter] = useState<string | null>(null);
  const { data, error, fetchMore } = useSuspenseQuery<ArticlesQuery>(GET_ARTICLES, {
    errorPolicy: "all",
    variables: {
      first: 10,
      after,
    },
  });

  if (error) {
    return <p>Error loading articles: {error.message}</p>;
  }

  if (!data?.articles?.edges || data.articles.edges.length === 0) {
    return <p>No articles found.</p>;
  }

  const loadMore = async () => {
    if (data.articles.pageInfo.hasNextPage) {
      await fetchMore({
        variables: {
          after: data.articles.pageInfo.endCursor,
        },
      });
      setAfter(data.articles.pageInfo.endCursor ?? null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.articles.edges.map(({ node: article }) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="line-clamp-1">{article.content}</p>
              <p className="text-gray-500 text-sm">
                By {article.author.name || "Unknown Author"} - {new Date(article.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-sm">{article.commentCount} comments</p>
            </CardBody>
            <CardFooter className="flex justify-end">
              <Button className="bg-gray-900 dark:bg-gray-50" asChild>
                <Link to={`/articles/${article.id}`} className="hover:no-underline">
                  Read More
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {data.articles.pageInfo.hasNextPage && (
        <div className="flex justify-center">
          <Button onClick={loadMore}>Load More</Button>
        </div>
      )}
    </div>
  );
}
