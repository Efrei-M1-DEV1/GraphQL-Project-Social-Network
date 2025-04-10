import { Link } from "@/components/link";
import { RefreshSpinner } from "@/components/refresh-spinner";
import { graphql } from "@/gql";
import { gql } from "@apollo/client";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "@repo/ui/data-display/card";
import { Button } from "@repo/ui/form/button";

import { Heading } from "@repo/ui/typography/heading";
import { Suspense } from "react";
import { FaTrashAlt } from "react-icons/fa";

import type { TypedDocumentNode } from "@apollo/client";

// Correct the ArticlesQuery type
interface ArticlesQuery {
  articles: {
    edges: {
      node: {
        id: number;
        title: string;
        content: string;
      };
    }[];
  };
}

const GET_ARTICLES = gql`
  query Articles($first: Int, $after: String) {
    articles(first: $first, after: $after) {
      edges {
        node {
          id
          title
          content
        }
      }
    }
  }
`;

const DELETE_ARTICLE = graphql(`
  mutation DeleteArticle($deleteArticleId: Int!) {
    deleteArticle(id: $deleteArticleId)
  }
`) as TypedDocumentNode<{ deleteArticle: boolean }, { deleteArticleId: number }>;

export default function ArticlesPage() {
  return (
    <div className="mt-8 space-y-2 px-4">
      <Heading>Articles</Heading>
      <p>List of articles will be displayed here.</p>
      <Suspense fallback={<RefreshSpinner />}>
        <ArticleList />
      </Suspense>
    </div>
  );
}

export function ArticleList() {
  const { data, error, refetch } = useSuspenseQuery<ArticlesQuery>(GET_ARTICLES, {
    errorPolicy: "all",
    variables: {
      first: 10,
      after: null,
    },
  });

  const [deleteArticle, { loading: deleting }] = useMutation(DELETE_ARTICLE, {
    onCompleted: () => {
      alert("Article supprimé avec succès !");
      refetch(); // Refresh the list of articles after deletion
    },
    onError: (err) => {
      alert(`Erreur lors de la suppression : ${err.message}`);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      deleteArticle({ variables: { deleteArticleId: id } });
    }
  };

  if (error) {
    return <p>Error loading articles: {error.message}</p>;
  }

  if (!data?.articles?.edges || data.articles.edges.length === 0) {
    return <p>No articles found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {data.articles.edges.map(({ node: article }) => (
        <Card key={article.id}>
          <CardHeader>
            <CardTitle>{article.title}</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="line-clamp-1">{article.content}</p>
          </CardBody>
          <CardFooter className="flex justify-end gap-2">
            <Button className="bg-gray-900 dark:bg-gray-50" asChild>
              <Link to={`/articles/${article.id}`} className="hover:no-underline">
                Read More
              </Link>
            </Button>
            <Button
              className="bg-white-500 text-red-500 hover:bg-red-600 hover:text-white"
              onClick={() => handleDelete(article.id)}
              disabled={deleting}
            >
              <FaTrashAlt className="mr-1 inline-block" />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
