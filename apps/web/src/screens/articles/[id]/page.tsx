import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@repo/ui/data-display/card";
import { Heading } from "@repo/ui/typography/heading";

const articles = [
  {
    id: 1,
    title: "Article 1",
    description: "Detailed description of Article 1",
  },
  {
    id: 2,
    title: "Article 2",
    description: "Detailed description of Article 2",
  },
  {
    id: 3,
    title: "Article 3",
    description: "Detailed description of Article 3",
  },
];

export default function ArticleDetails(props: { params?: { id: string } }) {
  const article = articles.find((article) => article.id === Number(props.params?.id));

  if (!article) {
    return (
      <div className="mx-auto max-w-screen-md">
        <Heading>Article not found</Heading>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-screen-md">
      <Card>
        <CardHeader>
          <CardTitle>{article.title}</CardTitle>
        </CardHeader>
        <CardBody>
          <CardDescription>{article.description}</CardDescription>
        </CardBody>
      </Card>
    </div>
  );
}
