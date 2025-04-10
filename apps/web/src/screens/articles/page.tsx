import { Link } from "@/components/link";
import { RefreshSpinner } from "@/components/refresh-spinner";
import { graphql } from "@/gql";
import type { ArticlesQuery } from "@/gql/graphql";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "@repo/ui/data-display/card";
import { Button } from "@repo/ui/form/button";

import { Heading } from "@repo/ui/typography/heading";
import { Suspense } from "react";
import { FiTrash2 } from "react-icons/fi";

const GET_ARTICLES = graphql(`
  query Articles($first: Int, $after: Int) {
    articles(first: $first, after: $after) {
      id,
      title
      content
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
  const { data, error, refetch } = useSuspenseQuery<ArticlesQuery>(GET_ARTICLES, {
    errorPolicy: "all",
    variables: {
      first: 10,
      after: 0,
    },
  });

  const [deleteArticle, { loading: deleting }] = useMutation(DELETE_ARTICLE, {
    onCompleted: () => {
      alert("Article supprimé avec succès !");
      refetch(); // Rafraîchit la liste des articles après suppression
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

  if (!data?.articles || data.articles.length === 0) {
    return <p>No articles found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.articles.map((article) => (
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
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => handleDelete(article.id)}
              disabled={deleting}
            >
              <FiTrash2 className="mr-1 inline-block" />
              {deleting ? "Deleting..." : "Trash"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
