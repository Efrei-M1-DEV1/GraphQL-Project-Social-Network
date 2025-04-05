import { Card, CardBody, CardDescription, CardHeader } from "@repo/ui/data-display/card";
import { Button } from "@repo/ui/form/button";
import { Link } from "@repo/ui/navigation/link";
import { Heading } from "@repo/ui/typography/heading";

export default function ArticleList() {
  const articles = [
    { id: 1, title: "Article 1", description: "Description of Article 1" },
    { id: 2, title: "Article 2", description: "Description of Article 2" },
    { id: 3, title: "Article 3", description: "Description of Article 3" },
  ];

  return (
    <div className="mx-auto max-w-screen-md space-y-6">
      <Heading>ArticleList</Heading>
      {articles.map((article) => (
        <Card key={article.id}>
          <CardHeader>{article.title}</CardHeader>
          <CardBody>
            <CardDescription>{article.description}</CardDescription>
          </CardBody>
          <div className="flex justify-end ">
            <Link href={`/articles/${article.id}`}>
              <Button>Read More</Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
