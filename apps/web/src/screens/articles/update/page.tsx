import { graphql } from "@/gql";
import type { GetArticleQuery, UpdateArticleMutation } from "@/gql/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Card, CardBody, CardHeader, CardTitle } from "@repo/ui/data-display/card";
import { Button } from "@repo/ui/form/button";
import { Input } from "@repo/ui/form/input";
import { createArticleSchema } from "@repo/utils/schemas/article";
import type React from "react";
import { useNavigate, useParams } from "react-router";

const GET_ARTICLE_QUERY = graphql(`
query Query($id: Int!) {
  article(id: $id) {
    id
    title
    content
  }
}
#   query GetArticle($id: Int!) {
#     article(id: $id) {
#       id
#       title
#       content
#     }
#   }
`);

const UPDATE_ARTICLE_MUTATION = graphql(`
  mutation UpdateArticle($id: Int!, $title: String!, $content: String!) {
    updateArticle(id: $id, title: $title, content: $content) {
      id
      title
      content
    }
  }
`);

export default function ArticleUpdatePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!id || Number.isNaN(Number(id))) {
    navigate("/error");
    return null;
  }

  const {
    data,
    loading: loadingQuery,
    error: errorQuery,
  } = useQuery<GetArticleQuery>(GET_ARTICLE_QUERY, {
    variables: { id: Number(id) },
  });

  const [updateArticle, { loading: loadingMutation, error: errorMutation }] = useMutation<UpdateArticleMutation>(
    UPDATE_ARTICLE_MUTATION,
    {
      onCompleted: () => {
        alert("Article mis à jour avec succès !");
        navigate(`/articles/${id}`);
      },
    },
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = new FormData(e.currentTarget);

    const title = payload.get("title") as string;
    const content = payload.get("content") as string;

    const parsed = createArticleSchema.safeParse({
      title,
      content,
    });

    if (!parsed.success) {
      return;
    }

    updateArticle({
      variables: {
        id: Number(id),
        ...parsed.data,
      },
    });
  };

  if (loadingQuery) {
    return <p>Chargement...</p>;
  }
  if (errorQuery || !data?.article) {
    navigate("/error");
    return null;
  }

  return (
    <div className="mx-auto max-w-screen-md">
      <Card>
        <CardHeader>
          <CardTitle>Modifier l'article</CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block font-medium text-gray-700 text-sm">
                Titre
              </label>
              <Input id="title" name="title" defaultValue={data.article.title} placeholder="Entrez le titre de l'article" />
            </div>
            <div>
              <label htmlFor="content" className="block font-medium text-gray-700 text-sm">
                Contenu
              </label>
              <Input
                as="textarea"
                id="content"
                name="content"
                defaultValue={data.article.content}
                placeholder="Entrez le contenu de l'article"
                rows={6}
              />
            </div>
            {errorMutation && <p className="text-red-500 text-sm">{errorMutation.message}</p>}
            <Button type="submit" disabled={loadingMutation}>
              {loadingMutation ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
