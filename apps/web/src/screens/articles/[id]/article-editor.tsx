import { type State, updateArticle } from "@/data-access/user";
import { graphql } from "@/gql";
import type { ArticleDetailsQuery, ArticleDetailsQueryVariables, UpdateArticleQ1Mutation } from "@/gql/graphql";
import { ARTICLE_DETAILS_QUERY } from "@/screens/articles/[id]/article-details";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { Button } from "@repo/ui/form/button";
import { Field } from "@repo/ui/form/field";
import { Input } from "@repo/ui/form/input";
import { Icon } from "@repo/ui/media/icon";
import { AnimatePresence, motion } from "motion/react";
import { useActionState, useEffect, useState } from "react";
import { LuX } from "react-icons/lu";
import type { useNavigate } from "react-router";

const UPDATE_ARTICLE_MUTATION = graphql(`
  mutation UpdateArticleQ1($updateArticleId: Int!, $title: String, $content: String) {
    updateArticle(id: $updateArticleId, title: $title, content: $content) {
      id
      title
      content
      updatedAt
    }
  }
`);

type ArticleEditorProps = {
  articleId: number;
  navigate: ReturnType<typeof useNavigate>;
};

export default function ArticleEditor({ articleId, navigate }: ArticleEditorProps) {
  const { error, data } = useSuspenseQuery<ArticleDetailsQuery, ArticleDetailsQueryVariables>(ARTICLE_DETAILS_QUERY, {
    variables: { articleId },
  });

  if (error || !data || !data.article) {
    return null;
  }

  const { article } = data;

  const [editError, setEditError] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");

  // Add with your other mutation hooks
  const [updateArticleMutation, { data: updateArticleData }] = useMutation<UpdateArticleQ1Mutation>(UPDATE_ARTICLE_MUTATION, {
    refetchQueries: [
      {
        query: ARTICLE_DETAILS_QUERY,
        variables: { articleId: article.id },
      },
    ],
  });

  const [state, submitAction, loading] = useActionState<State, FormData>(
    async (prevState, payload) => {
      const formData = new FormData();
      formData.append("title", payload.get("title") as string);
      formData.append("content", payload.get("content") as string);
      formData.append("id", `${article.id}`);
      const state = await updateArticle(prevState, formData, updateArticleMutation);
      return state;
    },
    {
      success: false,
    },
  );

  const handleEditCancel = () => {
    navigate(`/articles/${article.id}`, { replace: true });
    setEditError(null);
  };

  const getError = (field: string) => state?.error?.[field]; // Helper function

  useEffect(() => {
    const handleSuccess = async () => {
      if (updateArticleData?.updateArticle) {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate a delay

        handleEditCancel();
      }
    };

    handleSuccess();
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  }, [updateArticleData, handleEditCancel]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-lg border-gray-200 border-l bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <h2 className="font-bold text-2xl">Edit Article</h2>
          <Button variant="ghost" size="sm" onClick={handleEditCancel} className="text-gray-500 hover:text-red-500">
            <Icon as={LuX} className="h-5 w-5" />
          </Button>
        </div>

        <form action={submitAction} className="space-y-6">
          {getError("name") && (
            <div className="border-red-400 border-l-4 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/20">
              <p className="text-red-700 dark:text-red-400">{getError("name")}: </p>
            </div>
          )}

          <Field label="Title" errorText="Title is required" required className="space-y-2">
            <Input
              id="article-title"
              name="title"
              defaultValue={(state?.payload?.get("title") as string) || article.title}
              className="w-full"
              placeholder="Article title"
            />
          </Field>

          <Field
            label="Content"
            helperText="Use line breaks to separate paragraphs. Short paragraphs with less than 100 characters will be styled as headings."
            errorText="Content is required"
            required
            className="space-y-2"
          >
            <Input
              as="textarea"
              id="article-content"
              name="content"
              defaultValue={(state?.payload?.get("content") as string) || article.content}
              className="min-h-[300px] w-full resize-y"
              placeholder="Article content"
            />
          </Field>

          <div className="flex justify-end gap-3 pt-6">
            <Button
              variant="outline"
              className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
              onClick={handleEditCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              loadingText="Saving..."
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
