import { type NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

// Maps Sanity document types to the Next.js cache tags they should invalidate
const REVALIDATION_MAP: Record<string, string[]> = {
  product: ['products', 'homepage'],
  category: ['categories', 'homepage'],
  homePage: ['homepage'],
  siteSettings: ['site'],
  staticPage: ['pages'],
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET

  // Validate secret — reject if not configured or if header doesn't match
  if (!secret) {
    return NextResponse.json(
      { message: 'SANITY_REVALIDATE_SECRET is not configured' },
      { status: 500 }
    )
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  let body: { _type?: string; _id?: string } = {}
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const documentType = body._type
  if (!documentType) {
    return NextResponse.json({ message: 'Missing _type in body' }, { status: 400 })
  }

  const tags = REVALIDATION_MAP[documentType] ?? ['general']

  // Expire tags immediately — webhook calls require { expire: 0 } in Next.js 16
  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 })
  }

  // Also revalidate the specific document's tag if we have its ID
  if (body._id) {
    revalidateTag(`product-${body._id}`, { expire: 0 })
  }

  return NextResponse.json({
    revalidated: true,
    type: documentType,
    tags,
    timestamp: new Date().toISOString(),
  })
}

// Reject all other HTTP methods
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}
