import { graphql } from "@/gql";
import type { CommentsByArticleQuery, CommentsByArticleQueryVariables } from "@/gql/graphql";
import { useSuspenseQuery } from "@apollo/client";

const GET_COMMENT = graphql(`
  query CommentsByArticle($articleId: Int!) {
  commentsByArticle(articleId: $articleId) {
    edges {
      node {
        id
        content
        author {
          id
          name
        }
        createdAt
      }
    }
  }
}
`);

export default function CommentDetails({ articleId }: { articleId: number }) {
  const { data } = useSuspenseQuery<CommentsByArticleQuery, CommentsByArticleQueryVariables>(GET_COMMENT, {
    variables: {
      articleId,
    },
  });
  const comments = data.commentsByArticle.edges.map((edge) => edge.node);
  if (comments.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-2 border-gray-200 border-b-2 pb-4">
            <div className="font-semibold text-sm">{comment.author.name}</div>
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
      </div>
    );
  }
  return <div> Pas de commentaire actuellement ! </div>;
}
