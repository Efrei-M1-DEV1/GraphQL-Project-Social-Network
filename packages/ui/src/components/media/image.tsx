import { cn } from "@repo/utils/classes";
import { type UixComponent, uix } from "../factory";

/**
 * The props for the Image component.
 */
export type ImageProps = {
  src: string;
  alt?: string;
};

/**-----------------------------------------------------------------------------
 * Image
 * -----------------------------------------------------------------------------
 * Used to display images.
 *
 * -----------------------------------------------------------------------------*/
export const Image: UixComponent<"img", ImageProps> = (props) => {
  const { alt, className, ...remainingProps } = props;

  const altText = alt || getDefaultAlt(props.src);

  return (
    <uix.img
      alt={altText}
      className={cn("aspect-landscape object-cover", className)}
      width={320}
      height={320}
      {...remainingProps}
    />
  );
};

Image.displayName = "Image";

/**
 * Generates a default alt text for an image based on its filename.
 * @param src - The source URL of the image.
 * @returns The default alt text.
 */
function getDefaultAlt(src: string): string {
  const imageUrl = typeof src === "string" ? src : (src as { src: string }).src;
  const url = new URL(imageUrl, "http://localhost:5173");
  const filename = url.pathname.split("/").pop();
  return filename ? filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") : "Image";
}
