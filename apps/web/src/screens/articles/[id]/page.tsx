import Comment from "@/components/comment";
import { Skeleton } from "@/components/skeleton";
import { graphql } from "@/gql";
import type { ArticleQuery, ArticleQueryVariables } from "@/gql/graphql";
import { useSuspenseQuery } from "@apollo/client";
import { Badge } from "@repo/ui/data-display/badge";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@repo/ui/data-display/card";
import { Icon } from "@repo/ui/media/icon";
import { Suspense } from "react";
import { LuStar } from "react-icons/lu";
import { useNavigate } from "react-router";

const GET_ARTICLE = graphql(`
  query Article($articleId: Int!) {
    article(id: $articleId) {
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

export default function ArticleDetailsPage(props: { params?: { id: string } }) {
  const navigate = useNavigate();
  const { id } = props.params || {};

  if (!id || Number.isNaN(Number(id))) {
    navigate("/error");
    return null;
  }

  return (
    <div className="mx-auto max-w-screen-md">
      <Card>
        <Suspense fallback={<ArticleDetailsFallback />}>
          <ArticleDetails id={+id} navigate={navigate} />
        </Suspense>
        <CardBody>
          <p className="font-semibold">Comments</p>

          <Suspense fallback={<Skeleton className="h-6 w-full" />}>
            <Comment id={+id} />
          </Suspense>
        </CardBody>
      </Card>
    </div>
  );
}

type ArticleDetailsProps = {
  id: number;
  navigate: ReturnType<typeof useNavigate>;
};

function ArticleDetails(props: ArticleDetailsProps) {
  const { id, navigate } = props;

  const { error, data } = useSuspenseQuery<ArticleQuery, ArticleQueryVariables>(GET_ARTICLE, {
    variables: {
      articleId: id,
    },
  });

  if (error || !data || !data.article) {
    navigate("/error");
    return null;
  }

  return (
    <>
      <CardHeader>
        <CardDescription className="-ml-2 font-semibold text-gray-500 text-md uppercase dark:text-gray-400">
          {data.article.author.name}
        </CardDescription>
        <CardTitle>{data.article.title}</CardTitle>
        <div className="flex items-center gap-1">
          <Badge className="self-start">
            {new Date(data.article.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Badge>
          <span className="flex-1" />
          <Icon as={LuStar} className="fill-yellow-400 text-yellow-400" />
          <span className="text-gray-500 text-xs dark:text-gray-400">(120 Reviews)</span>
        </div>
      </CardHeader>
      <CardBody>
        <p className="font-semibold">Article info</p>
        <p className="line-clamp-3">{data.article.content}</p>
      </CardBody>
    </>
  );
}

function ArticleDetailsFallback() {
  return (
    <>
      <CardHeader>
        <div className="-ml-2">
          <Skeleton className="h-6 w-1/3" />
        </div>
        <Skeleton className="h-6 w-1/2" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-6 w-20" />
          <span className="flex-1" />
          <Skeleton className="h-6 w-28" />
        </div>
      </CardHeader>
      <CardBody className="space-y-2">
        <p>Article info</p>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </CardBody>
    </>
  );
}
