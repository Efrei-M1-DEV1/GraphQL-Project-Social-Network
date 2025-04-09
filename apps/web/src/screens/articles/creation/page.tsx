import { graphql } from "@/gql";
import type { CreateArticleMutation } from "@/gql/graphql";
import { useMutation } from "@apollo/client";
import { Card, CardBody, CardHeader, CardTitle } from "@repo/ui/data-display/card";
import { Button } from "@repo/ui/form/button";
import { Input } from "@repo/ui/form/input";
import { createArticleSchema } from "@repo/utils/schemas/article";
import type React from "react";
import { useNavigate } from "react-router";

const CREATE_ARTICLE_MUTATION = graphql(`
  mutation CreateArticle($title: String!, $content: String!) {
  createArticle(title: $title, content: $content) {
    id
    author {
      name
    }
  }
}
`);

export default function ArticleCreationPage() {
  const navigate = useNavigate();

  const [createArticle, { loading, error, data }] = useMutation<CreateArticleMutation>(CREATE_ARTICLE_MUTATION, {
    onCompleted: (data) => {
      alert("Article créé avec succès !");
      navigate(`/articles/${data.createArticle.id}`);
    },
  });

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

    createArticle({
      variables: parsed.data,
    });
  };

  return (
    <div className="mx-auto max-w-screen-md">
      <Card>
        <CardHeader>
          <CardTitle>Créer un nouvel article</CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block font-medium text-gray-700 text-sm">
                Titre
              </label>
              <Input id="title" placeholder="Entrez le titre de l'article" name="title" />
            </div>
            <div>
              <label htmlFor="content" className="block font-medium text-gray-700 text-sm">
                Contenu
              </label>
              <Input as="textarea" id="content" placeholder="Entrez le contenu de l'article" rows={6} name="content" />
            </div>
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
