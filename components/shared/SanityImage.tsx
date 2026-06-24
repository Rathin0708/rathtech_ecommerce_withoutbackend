import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface SanityImageData {
  asset: unknown;
  alt?: string | null;
  lqip?: string | null;
  caption?: string | null;
}

interface SanityImageProps {
  image: SanityImageData | null | undefined;
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  className?: string;
}

export default function SanityImage({
  image,
  alt,
  width = 800,
  height,
  fill = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  quality = 80,
  className,
}: SanityImageProps) {
  if (!image?.asset) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const builder = urlFor(image as any).auto("format").quality(quality);
  const src = fill
    ? builder.url()
    : builder.width(width).url();

  const altText = alt ?? image.alt ?? "";
  const blurProps =
    image.lqip
      ? { placeholder: "blur" as const, blurDataURL: image.lqip }
      : {};

  if (fill) {
    return (
      <Image
        src={src}
        alt={altText}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        {...blurProps}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={altText}
      width={width}
      height={height ?? width}
      sizes={sizes}
      priority={priority}
      className={className}
      {...blurProps}
    />
  );
}
