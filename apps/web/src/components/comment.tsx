import { graphql } from "@/gql";
import type { GetCommentQuery } from "@/gql/graphql";
import { useSuspenseQuery } from "@apollo/client";

const GET_COMMENT = graphql(`
  query GetComment($id: Int!) {
    article(id: $id) {
      comments {
        id
        content
        updatedAt
        author {
          id
          name
        }
      }
    }
  }
`);

export default function CommentDetails({ id }: { id: number }) {
  const { data } = useSuspenseQuery<GetCommentQuery>(GET_COMMENT, {
    variables: {
      id,
    },
  });
  const comments = data?.article?.comments ?? [];
  if (comments.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-2 border-gray-200 border-b-2 pb-4">
            <div className="font-semibold text-sm">{comment.author.name}</div>
            <div className="text-gray-700 text-sm">{comment.content}</div>
            <div className="text-gray-500 text-xs">
              {new Date(comment.updatedAt).toLocaleDateString("fr-FR", {
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
