import { graphql } from "@/gql";
import type { CommentsByArticleQuery } from "@/gql/graphql";
import { useSuspenseQuery } from "@apollo/client";
import { Button } from "@repo/ui/form/button";

const GET_COMMENTS_BY_ARTICLE = graphql(`
  query CommentsByArticle(
    $articleId: Int!
    $first: Int
    $after: String
    $sort: SortOrder
  ) {
    commentsByArticle(
      articleId: $articleId
      first: $first
      after: $after
      sort: $sort
    ) {
      edges {
        cursor
        node {
          id
          content
          author {
            id
            name
            email
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

export default function CommentDetails({ articleId }: { articleId: number }) {
  const { data, error, fetchMore } = useSuspenseQuery<CommentsByArticleQuery>(GET_COMMENTS_BY_ARTICLE, {
    variables: {
      articleId,
      first: 10,
      after: null,
      sort: "DESC",
    },
  });

  if (error) {
    return <div className="text-red-500">Erreur : {error.message}</div>;
  }

  const comments = data?.commentsByArticle?.edges.map((edge) => edge.node) ?? [];

  if (comments.length === 0) {
    return <div>Pas de commentaires pour cet article.</div>;
  }

  const loadMoreComments = async () => {
    if (data?.commentsByArticle?.pageInfo.hasNextPage) {
      await fetchMore({
        variables: {
          after: data.commentsByArticle.pageInfo.endCursor,
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border-gray-200 border-b pb-4">
          <div className="font-semibold text-sm">{comment.author?.name || "Auteur inconnu"}</div>
          <div className="text-gray-700 text-sm">{comment.content}</div>
          <div className="text-gray-500 text-xs">
            {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      ))}
      {data?.commentsByArticle?.pageInfo.hasNextPage && (
        <Button onClick={loadMoreComments} className="text-blue-500 hover:underline">
          Charger plus de commentaires
        </Button>
      )}
    </div>
  );
}
