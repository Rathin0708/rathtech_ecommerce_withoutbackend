import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// CDN client — used in all RSC page fetches for maximum speed
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: { enabled: false },
})
