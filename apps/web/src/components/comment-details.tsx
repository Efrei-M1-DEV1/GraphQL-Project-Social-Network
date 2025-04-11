import { graphql } from "@/gql";
import {
  type CreateArticleCommentMutation,
  type CreateArticleCommentMutationVariables,
  type DeleteArticleCommentMutation,
  type DeleteArticleCommentMutationVariables,
  type PaginatedArticleCommentsQuery,
  type PaginatedArticleCommentsQueryVariables,
  SortOrder,
} from "@/gql/graphql";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { Card, CardBody, CardFooter, CardHeader } from "@repo/ui/data-display/card";
import { Button } from "@repo/ui/form/button";
import { Field } from "@repo/ui/form/field"; // Import Field component
import { Input } from "@repo/ui/form/input";
import { Avatar } from "@repo/ui/media/avatar";
import { Icon } from "@repo/ui/media/icon";
import { Heading } from "@repo/ui/typography/heading";
import { cn } from "@repo/utils/classes";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { LuClock, LuHeart, LuMessageSquare, LuSend, LuTrash } from "react-icons/lu";

// Query to fetch comments for an article
const ARTICLE_COMMENTS_QUERY = graphql(`
  query PaginatedArticleComments($articleId: Int!, $first: Int, $after: String, $sort: SortOrder) {
    commentsByArticle(articleId: $articleId, first: $first, after: $after, sort: $sort) {
      edges {
        node {
          id
          content
          createdAt
          author {
            id
            name
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

// Mutation to create a new comment
const CREATE_COMMENT_MUTATION = graphql(`
  mutation CreateArticleComment($content: String!, $articleId: Int!) {
    createComment(content: $content, articleId: $articleId) {
      id
      content
      createdAt
      author {
        id
        name
      }
    }
  }
`);

// Delete comment mutation
const DELETE_COMMENT_MUTATION = graphql(`
  mutation DeleteArticleComment($deleteCommentId: Int!) {
    deleteComment(id: $deleteCommentId)
  }
`);

interface CommentDetailsProps {
  articleId: number;
}

export default function CommentDetails({ articleId }: CommentDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Desc);
  const formRef = useRef<HTMLFormElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  // Fetch comments
  const {
    data,
    error: queryError,
    fetchMore,
  } = useSuspenseQuery<PaginatedArticleCommentsQuery, PaginatedArticleCommentsQueryVariables>(ARTICLE_COMMENTS_QUERY, {
    variables: {
      articleId,
      first: 10,
      sort: sortOrder,
    },
  });

  // Create comment mutation
  const [createComment] = useMutation<CreateArticleCommentMutation, CreateArticleCommentMutationVariables>(
    CREATE_COMMENT_MUTATION,
    {
      refetchQueries: [{ query: ARTICLE_COMMENTS_QUERY, variables: { articleId, first: 10, sort: sortOrder } }],
    },
  );

  // Delete comment mutation
  const [deleteComment] = useMutation<DeleteArticleCommentMutation, DeleteArticleCommentMutationVariables>(
    DELETE_COMMENT_MUTATION,
    {
      refetchQueries: [{ query: ARTICLE_COMMENTS_QUERY, variables: { articleId, first: 10, sort: sortOrder } }],
    },
  );

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return null;
      }

      // Decode the JWT token to get user info
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));

      // Return the user ID from the token payload
      return payload.userId || payload.sub || null;
    } catch (e) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error("Error getting current user ID:", e);
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  if (queryError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
        <p className="text-red-800 dark:text-red-200">Error loading comments: {queryError.message}</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!commentRef.current || !commentRef.current.value.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    const commentContent = commentRef.current.value;

    setIsSubmitting(true);
    try {
      await createComment({
        variables: {
          articleId,
          content: commentContent,
        },
      });

      // Reset form and focus on textarea for next comment
      formRef.current?.reset();
      commentRef.current?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment({
        variables: {
          deleteCommentId: commentId,
        },
      });
    } catch (err) {
      // Handle error if needed
    }
  };

  const loadMoreComments = () => {
    if (data.commentsByArticle.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          after: data.commentsByArticle.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }
          return {
            commentsByArticle: {
              __typename: prev.commentsByArticle.__typename,
              edges: [...prev.commentsByArticle.edges, ...fetchMoreResult.commentsByArticle.edges],
              pageInfo: fetchMoreResult.commentsByArticle.pageInfo,
            },
          };
        },
      });
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc);
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <motion.form
        ref={formRef}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="mb-3 flex items-center gap-3">
          <Avatar size="sm" name="You" className="shrink-0" />
          <Heading as="h3" size="lg" className="font-medium">
            Leave your thoughts
          </Heading>
        </div>

        <Field
          label="Your comment"
          helperText="Share your perspective on this article"
          errorText={error || undefined}
          invalid={!!error}
          disabled={isSubmitting}
        >
          <Input
            as="textarea"
            ref={commentRef}
            name="comment"
            placeholder="Share your thoughts about this article..."
            className="min-h-[100px] w-full resize-none rounded-lg border border-gray-200 p-2 focus-visible:border-purple-400 focus-visible:outline-none focus-visible:ring-purple-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            disabled={isSubmitting}
            required
          />
        </Field>

        <Button
          type="submit"
          loading={isSubmitting}
          loadingText="Posting..."
          spinner={<Icon as={LuClock} className="h-4 w-4 animate-spin" />}
          className="relative self-end overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 font-medium text-white transition-all hover:from-purple-600 hover:to-indigo-600"
        >
          <Icon as={LuSend} className="mr-2 h-4 w-4" />
          Post Comment
        </Button>
      </motion.form>

      {/* Comment Sorting Controls */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-gray-500 text-sm dark:text-gray-400">
          {data.commentsByArticle.edges.length} Comment{data.commentsByArticle.edges.length !== 1 ? "s" : ""}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSortOrder}
          className="text-gray-500 text-sm hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
        >
          Sort by: {sortOrder === "DESC" ? "Newest first" : "Oldest first"}
        </Button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {data.commentsByArticle.edges.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-900"
            >
              <Icon as={LuMessageSquare} className="mx-auto mb-2 h-8 w-8 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to share your thoughts!</p>
            </motion.div>
          ) : (
            data.commentsByArticle.edges.map(({ node: comment }, index) => (
              <Card key={comment.id} asChild>
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "relative overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md",
                    comment.author.id === currentUserId
                      ? "border-purple-200 bg-purple-50/30 dark:border-purple-900/50 dark:bg-purple-900/10"
                      : "border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900",
                  )}
                >
                  <CardHeader className="flex-row items-center gap-3 px-4 pt-4">
                    <Avatar name={comment.author.name || "Unknown"} size="sm" />
                    <div>
                      <Heading as="h4" size="md" className="font-medium">
                        {comment.author.name}
                      </Heading>
                      <p className="text-gray-500 text-xs dark:text-gray-400">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>

                    {comment.author.id === currentUserId ? (
                      <>
                        <div className="flex-1" />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                        >
                          <Icon as={LuTrash} className="h-4 w-4" />
                        </Button>
                      </>
                    ) : null}
                  </CardHeader>

                  <CardBody className="prose prose-sm dark:prose-invert px-4 py-3">
                    <p>{comment.content}</p>
                  </CardBody>

                  <CardFooter className="px-4 pb-4">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="gap-1 rounded-full text-gray-500 text-xs dark:text-gray-400"
                    >
                      <Icon as={LuHeart} />
                      <span>Like</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="gap-1 rounded-full text-gray-500 text-xs dark:text-gray-400"
                    >
                      <Icon as={LuMessageSquare} />
                      <span>Reply</span>
                    </Button>
                  </CardFooter>
                </motion.div>
              </Card>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
      {data.commentsByArticle.pageInfo.hasNextPage && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={loadMoreComments}
            variant="outline"
            className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            Load More Comments
          </Button>
        </div>
      )}
    </div>
  );
}
