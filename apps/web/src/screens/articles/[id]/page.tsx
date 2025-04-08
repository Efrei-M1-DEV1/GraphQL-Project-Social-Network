import { graphql } from "@/gql";
import type { GetArticleQuery } from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@repo/ui/data-display/card";

import { useEffect } from "react";
import { useNavigate } from "react-router";

const GET_ARTICLE = graphql(`
  query GetArticle($id: Int!) {
    article(id: $id) {
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

export default function ArticleDetails(props: { params?: { id: string } }) {
  const navigate = useNavigate();
  const { id } = props.params || {};

  const { loading, error, data } = useQuery<GetArticleQuery>(GET_ARTICLE, {
    variables: {
      id: Number(id),
    },
  });

  useEffect(() => {
    if (!loading && (error || !data || !data.article)) {
      navigate("/error");
    }
  }, [navigate, error, data, loading]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !data || !data.article) {
    return null;
  }

  return (
    <div className="mx-auto max-w-screen-md">
      <Card>
        <CardHeader>
          <CardTitle>{data.article.title}</CardTitle>
          <CardDescription>
            {data.article.author.name} - {data.article.createdAt}
          </CardDescription>
        </CardHeader>
        <CardBody>
          <p>{data.article.content}</p>
        </CardBody>
      </Card>
    </div>
  );
}
