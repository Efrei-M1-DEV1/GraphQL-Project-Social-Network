import CommentDetails from "@/components/comment-details";
import { Link } from "@/components/link";
import { Card, CardBody, CardHeader, CardTitle } from "@repo/ui/data-display/card";
import { Skeleton } from "@repo/ui/feedback/skeleton";
import { Icon } from "@repo/ui/media/icon";
import { motion } from "motion/react";
import { Suspense, useEffect } from "react";
import { LuClock, LuMessageSquare } from "react-icons/lu";
import { useNavigate } from "react-router";
import ArticleDetails from "./article-details";
import ArticleEditor from "./article-editor";

export default function ArticleDetailsPage(props: { params?: { id: string }; searchParams?: { [key: string]: string } }) {
  const navigate = useNavigate();
  const { id } = props.params || {};
  const { editor } = props.searchParams || {};

  useEffect(() => {
    if (!id || Number.isNaN(Number(id))) {
      navigate("/error");
    }
  }, [id, navigate]);

  if (!id || Number.isNaN(Number(id))) {
    navigate("/error");
    return null;
  }

  return (
    <div className="mx-auto max-w-screen-lg space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link
          to="/articles"
          className="mb-4 flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
        >
          <Icon as={LuClock} className="mr-1 h-4 w-4" />
          Back to articles
        </Link>

        <Card className="border-0 shadow-lg">
          <Suspense fallback={<ArticleDetailsFallback />}>
            <ArticleDetails articleId={+id} navigate={navigate} />
            {editor ? <ArticleEditor articleId={+id} navigate={navigate} /> : null}
          </Suspense>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Icon as={LuMessageSquare} className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-xl">Comments</CardTitle>
            </div>
          </CardHeader>
          <CardBody>
            <Suspense fallback={<CommentsLoadingSkeleton />}>
              <CommentDetails articleId={+id} />
            </Suspense>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}

function ArticleDetailsFallback() {
  return (
    <>
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-8 dark:from-gray-800 dark:to-gray-700">
        <div className="mb-4 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>

        <Skeleton className="mb-4 h-10 w-3/4 rounded-md" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>

      <CardBody className="space-y-4 p-6 md:p-8">
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-5/6 rounded-md" />
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-4/5 rounded-md" />
        <Skeleton className="h-5 w-full rounded-md" />
      </CardBody>
    </>
  );
}

function CommentsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Comment Form Skeleton */}
      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <Skeleton className="mb-3 h-6 w-40 rounded-md" />
        <div className="flex gap-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-24 w-full rounded-lg" />
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Comment Sorting Controls Skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-32 rounded-md" />
      </div>

      {/* Comments List Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => {
          const key = `comment-skeleton-${index}`;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="mt-1 h-3 w-24 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-4/6 rounded-md" />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Load More Button Skeleton */}
      <div className="mt-6 flex justify-center">
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>
    </div>
  );
}
