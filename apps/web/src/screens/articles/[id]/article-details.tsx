import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { graphql } from "@/gql";
import type { ArticleDetailsQuery, ArticleDetailsQueryVariables } from "@/gql/graphql";
import { getReadingTime } from "@/utils";
import { useSuspenseQuery } from "@apollo/client";
import { Badge } from "@repo/ui/data-display/badge";
import { CardBody } from "@repo/ui/data-display/card";
import { Button, ButtonGroup, IconButton } from "@repo/ui/form/button";
import { Avatar } from "@repo/ui/media/avatar";
import { Icon } from "@repo/ui/media/icon";
import { Heading } from "@repo/ui/typography/heading";
import { cn } from "@repo/utils/classes";
import { motion } from "motion/react";
import { useRef } from "react";
import { LuCalendar, LuClock, LuHeart, LuMessageSquare, LuPencilLine, LuStar } from "react-icons/lu";
import type { useNavigate } from "react-router";
import ArticleBookmarkButton from "./article-bookmark-button";
import ArticleLikeButton from "./article-like-button";
import ArticleShareButton from "./article-share-button";

export const ARTICLE_DETAILS_QUERY = graphql(`
  query ArticleDetails($articleId: Int!) {
    article(id: $articleId) {
      id
      title
      content
      createdAt
      commentCount
      likeCount
      author {
        id
        name
      }
    }
  }
`);

type ArticleDetailsProps = {
  articleId: number;
  navigate: ReturnType<typeof useNavigate>;
};

export default function ArticleDetails({ articleId, navigate }: ArticleDetailsProps) {
  const articleRef = useRef<HTMLDivElement>(null);

  const { error, data } = useSuspenseQuery<ArticleDetailsQuery, ArticleDetailsQueryVariables>(ARTICLE_DETAILS_QUERY, {
    variables: { articleId },
  });

  if (error || !data || !data.article) {
    return null;
  }

  const handleEditClick = () => {
    navigate(`/articles/${articleId}?editor=true`);
  };

  const { article } = data;
  const readingTime = getReadingTime(article.content);
  const likeCount = article.likeCount || 0;
  const commentCount = article.commentCount || 0;
  const updatedDate = new Date(article.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div ref={articleRef} className={"relative"}>
      {/* Reading Progress Bar */}
      <ReadingProgressBar
        target={articleRef}
        // onProgressChange={handleProgressChange}
        barClassName={"bg-gradient-to-r from-purple-500 to-indigo-500"}
      />

      {/* Header Section */}
      <div className={"relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-500 p-8 text-white"}>
        {/* Article Meta */}
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-4 rounded-full px-3 py-1">
              <Icon as={LuClock} className="mr-1 h-3 w-3" />
              <span className="text-xs">{readingTime} minute read</span>
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 flex items-center gap-3"
          >
            <Avatar name={article.author.name || undefined} size="md" className="border-2 border-white/30" />
            <div>
              <p className="font-medium text-white">{article.author.name}</p>
              <div className="flex items-center gap-3 text-white/70 text-xs">
                <span className="flex items-center">
                  <Icon as={LuCalendar} className="mr-1 h-3 w-3" />
                  {updatedDate}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Article Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 font-bold text-3xl leading-tight tracking-tight md:text-4xl"
          >
            {article.title}
          </motion.h1>

          {/* Article Stats & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Badge>
              <Icon as={LuHeart} className="mr-1 h-3 w-3 text-red-400" />
              {likeCount} {likeCount <= 1 ? "Like" : "Likes"}
            </Badge>

            <Badge>
              <Icon as={LuMessageSquare} className="mr-1 h-3 w-3" />
              {commentCount} {commentCount <= 1 ? "Comment" : "Comments"}
            </Badge>
          </motion.div>
        </div>
      </div>

      {/* Article Content */}
      <CardBody>
        <div className="relative bg-white p-6 text-gray-900 md:p-8 dark:bg-gray-900 dark:text-gray-100">
          {/* Article Actions */}
          <ButtonGroup
            className="sticky top-14 z-30 float-right ml-4 hidden flex-col items-center gap-2 rounded-full bg-white/80 p-2 backdrop-blur-sm md:flex dark:bg-gray-800/80"
            size="sm"
            variant="ghost"
          >
            <IconButton
              icon={<Icon as={LuPencilLine} />}
              variant="ghost"
              size="sm"
              onClick={handleEditClick}
              className="rounded-full text-gray-400 hover:text-purple-500"
            />
            <ArticleLikeButton articleId={articleId} />
            <ArticleBookmarkButton articleId={articleId} />
            <ArticleShareButton articleTitle={article.title} />
          </ButtonGroup>

          {/* Article Content Blocks */}
          <div className={cn("prose dark:prose-invert max-w-none")}>
            {article.content.split("\n").map((paragraph, idx) => {
              if (!paragraph.trim()) {
                return null;
              }

              const key = `paragraph-${idx}`;
              const isPotentialHeading =
                paragraph.length < 100 && !paragraph.endsWith(".") && paragraph.trim().split(" ").length < 8;
              // const shouldTruncate = paragraph.length > 300 && !expandedParagraphs[idx];

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                >
                  {isPotentialHeading ? (
                    <h3 id={`heading-${idx}`} className="mt-8 mb-4 font-bold text-xl">
                      {paragraph}
                    </h3>
                  ) : (
                    <>
                      <p className="mb-6 line-clamp-2">{paragraph}</p>
                      {paragraph.length > 200 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="-mt-2 mb-6 text-purple-600 dark:text-purple-400"
                          // onClick={() => toggleParagraph(idx)}
                        >
                          Show more
                          {/* {expandedParagraphs[idx] ? "Show less" : "Show more"}
                      <Icon
                        as={LuChevronDown}
                        className={cn("ml-1 h-4 w-4 transition-transform", expandedParagraphs[idx] && "rotate-180")}
                      /> */}
                        </Button>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        {/* Author Bio - with enhanced styling and micro-interactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 p-6 transition-colors dark:border-gray-800 dark:bg-gray-900/50"
          whileHover={{ scale: 1.01, boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
        >
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Avatar name={article.author.name || undefined} size="lg" className="ring-2 ring-purple-500 ring-offset-2" />
            <div className="flex-1">
              <Heading size="xl" className="mb-2">
                {article.author.name}
              </Heading>
              <p className="text-gray-600 dark:text-gray-300">
                Writer and researcher specializing in tech and digital culture. Follow me for more articles on emerging
                technologies and future trends.
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="gap-1 text-current" disabled>
                  <Icon as={LuStar} />
                  Follow
                </Button>
                <Button variant="outline" size="sm" className="gap-1 text-current" disabled>
                  <Icon as={LuMessageSquare} />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </CardBody>
    </div>
  );
}
