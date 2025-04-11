import { IconButton } from "@repo/ui/form/button";
import { Icon } from "@repo/ui/media/icon";
import { LuShare2 } from "react-icons/lu";

type ArticleShareButtonProps = {
  articleTitle: string;
};

export default function ArticleShareButton({ articleTitle }: ArticleShareButtonProps) {
  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: articleTitle,
          text: articleTitle,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        // In a real app, you'd show a toast notification
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error("Error sharing:", error);
    }
  };

  return (
    <>
      <IconButton
        icon={<Icon as={LuShare2} />}
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="rounded-full text-gray-400 hover:text-purple-500"
      />
    </>
  );
}
