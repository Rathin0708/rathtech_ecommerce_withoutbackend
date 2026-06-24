// This file MUST only be imported in Server Components and API routes.
// Never import in client components — the token is server-only.
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,   // Bypass CDN for guaranteed freshness in webhooks
  perspective: 'published',
  token: process.env.SANITY_API_TOKEN,
})
