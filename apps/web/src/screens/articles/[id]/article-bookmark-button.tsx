import { IconButton } from "@repo/ui/form/button";
import { Icon } from "@repo/ui/media/icon";
import { cn } from "@repo/utils/classes";
import { useState } from "react";
import { LuBookmark } from "react-icons/lu";

type ArticleBookmarkButtonProps = {
  articleId: number;
};

export default function ArticleBookmarkButton({ articleId }: ArticleBookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // In a real app, you'd save this to user preferences
  };

  return (
    <>
      <IconButton
        icon={<Icon as={LuBookmark} />}
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        className={cn(
          "rounded-full",
          bookmarked ? "text-purple-500 hover:text-purple-600" : "text-gray-400 hover:text-purple-500",
        )}
      />
    </>
  );
}
