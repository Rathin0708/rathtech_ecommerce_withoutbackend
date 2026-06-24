import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url'
import { dataset, projectId } from '../env'

const builder = imageUrlBuilder({ projectId, dataset })

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/** Pre-built transform for common sizes. Quality defaults to 80. */
export function urlForImage(
  source: SanityImageSource,
  width: number,
  height?: number,
  quality = 80
): string {
  const base = builder.image(source).width(width).auto('format').quality(quality)
  return height ? base.height(height).fit('crop').url() : base.url()
}
