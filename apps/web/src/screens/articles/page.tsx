import { graphql } from "@/gql";
import type { GetArticlesQuery } from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { Card, CardBody, CardFooter, CardTitle } from "@repo/ui/data-display/card";
import { Button } from "@repo/ui/form/button";
// import { Link } from "@repo/ui/navigation/link";

import { Heading } from "@repo/ui/typography/heading";
import { Link } from "react-router";

const GET_ARTICLES = graphql(`
  query GetArticles($first: Int, $after: Int) {
    articles(first: $first, after: $after) {
      id
      title
      content
      createdAt
      author {
        id
        name
      }
    }
  }
`);

export default function ArticleList() {
  const { loading, error, data } = useQuery<GetArticlesQuery>(GET_ARTICLES, {
    variables: {
      first: 10,
      after: 0,
    },
  });

  // Afficher un message de chargement le tps que les données chargent
  if (loading) {
    return <p>Loading...</p>;
  }

  // Afficher un message d'erreur si une erreur se produit
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!data || !data.articles) {
    return <p>No articles found.</p>;
  }
  // Afficher les articles

  // const articles = [
  //   { id: 1, title: "Article 1", description: "Description of Article 1" },
  //   { id: 2, title: "Article 2", description: "Description of Article 2" },
  //   { id: 3, title: "Article 3", description: "Description of Article 3" },
  // ];

  return (
    <div className="mx-auto max-w-screen-md space-y-6">
      <Heading>ArticleList</Heading>
      {data.articles.map((article) => (
        <Card key={article.id}>
          <CardTitle>{article.title}</CardTitle>
          <CardBody>
            <p>{article.content}</p>
          </CardBody>
          <CardFooter className="flex justify-end ">
            <Button asChild>
              <Link to={`/articles/${article.id}`}>Read More</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
