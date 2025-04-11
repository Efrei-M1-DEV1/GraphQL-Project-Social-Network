import { graphql } from "@/gql";
import type {
  HasLikedArticleQuery,
  HasLikedArticleQueryVariables,
  LikeArticleMutation,
  LikeArticleMutationVariables,
  UnlikeArticleMutation,
  UnlikeArticleMutationVariables,
} from "@/gql/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { IconButton } from "@repo/ui/form/button";
import { Icon } from "@repo/ui/media/icon";
import { cn } from "@repo/utils/classes";
import { useState } from "react";
import { LuHeart } from "react-icons/lu";
import { ARTICLE_DETAILS_QUERY } from "./article-details";

const HAS_LIKED_ARTICLE = graphql(`
  query HasLikedArticle($articleId: Int!) {
    hasLikedArticle(articleId: $articleId)
  }
`);

const LIKE_ARTICLE_MUTATION = graphql(`
  mutation LikeArticle($articleId: Int!) {
    likeArticle(articleId: $articleId) {
      id
      article {
        id
        likeCount
      }
    }
  }
`);

const UNLIKE_ARTICLE_MUTATION = graphql(`
  mutation UnlikeArticle($articleId: Int!) {
    unlikeArticle(articleId: $articleId)
  }
`);

type ArticleLikeButtonProps = {
  articleId: number;
};

export default function ArticleLikeButton({ articleId }: ArticleLikeButtonProps) {
  const [liked, setLiked] = useState(false);

  useQuery<HasLikedArticleQuery, HasLikedArticleQueryVariables>(HAS_LIKED_ARTICLE, {
    variables: { articleId },
    onCompleted: (data) => {
      if (data.hasLikedArticle) {
        setLiked(true);
      }
    },
    onError: (error) => {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error("Error fetching like status:", error);
    },
  });

  const [likeArticle, { loading: likeLoading }] = useMutation<LikeArticleMutation, LikeArticleMutationVariables>(
    LIKE_ARTICLE_MUTATION,
  );

  const [unlikeArticle, { loading: unlikeLoading }] = useMutation<UnlikeArticleMutation, UnlikeArticleMutationVariables>(
    UNLIKE_ARTICLE_MUTATION,
    {
      refetchQueries: [
        {
          query: ARTICLE_DETAILS_QUERY,
          variables: { articleId },
        },
      ],
    },
  );

  // Handle article actions
  const handleLike = async () => {
    if (likeLoading || unlikeLoading) {
      return;
    }

    try {
      if (liked) {
        await unlikeArticle({ variables: { articleId } });
      } else {
        await likeArticle({ variables: { articleId } });
      }
      setLiked(!liked);
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error("Error toggling like:", error);
    }
  };

  return (
    <>
      <IconButton
        icon={<Icon as={LuHeart} className="h-5 w-5" />}
        onClick={handleLike}
        className={cn("rounded-full", liked ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500")}
      />
    </>
  );
}
