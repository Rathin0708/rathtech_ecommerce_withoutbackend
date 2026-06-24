import { PackageIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: PackageIcon,
  groups: [
    { name: 'main', title: 'Product Info', default: true },
    { name: 'media', title: 'Images & Variants' },
    { name: 'inventory', title: 'Inventory' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Main group ───────────────────────────────────
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      group: 'main',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'main',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      group: 'main',
      description: 'Brief 1–2 line summary shown in product grid cards',
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      group: 'main',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'main',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
      validation: (Rule) => Rule.required().min(1).error('At least one category is required'),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'main',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      group: 'main',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      validation: (Rule) => Rule.max(4).warning('Maximum 4 related products'),
    }),

    // ── Media group ───────────────────────────────────
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ type: 'imageWithAlt' })],
      validation: (Rule) =>
        Rule.required().min(1).max(8).error('At least one image is required (max 8)'),
    }),
    defineField({
      name: 'variants',
      title: 'Variants (Size / Color / etc.)',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ type: 'productVariant' })],
    }),

    // ── Inventory group ───────────────────────────────
    defineField({
      name: 'price',
      title: 'Regular Price (₹)',
      type: 'number',
      group: 'inventory',
      validation: (Rule) =>
        Rule.required().min(0).error('Price is required and must be non-negative'),
    }),
    defineField({
      name: 'salePrice',
      title: 'Sale Price (₹)',
      type: 'number',
      group: 'inventory',
      description: 'Leave empty if not on sale',
      validation: (Rule) =>
        Rule.custom((salePrice, ctx) => {
          const doc = ctx.document as { price?: number }
          if (
            salePrice !== undefined &&
            salePrice !== null &&
            doc?.price !== undefined &&
            (salePrice as number) >= doc.price
          ) {
            return 'Sale price must be less than the regular price'
          }
          return true
        }),
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      group: 'inventory',
      initialValue: true,
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      group: 'inventory',
    }),
    defineField({
      name: 'weight',
      title: 'Weight (grams)',
      type: 'number',
      group: 'inventory',
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      group: 'inventory',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Sale', value: 'sale' },
          { title: 'Best Seller', value: 'bestSeller' },
          { title: 'Limited Edition', value: 'limitedEdition' },
          { title: 'Coming Soon', value: 'comingSoon' },
        ],
      },
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Product',
      type: 'boolean',
      group: 'inventory',
      description: 'Show in featured sections on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'inventory',
      description: 'Controls "Newest" sort order',
      initialValue: () => new Date().toISOString(),
    }),

    // ── SEO group ────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO Overrides',
      type: 'seoFields',
      group: 'seo',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      price: 'price',
      media: 'images.0',
      inStock: 'inStock',
    },
    prepare({ title, price, inStock }: { title?: string; price?: number; inStock?: boolean }) {
      return {
        title: title ?? 'Untitled Product',
        subtitle: `₹${price ?? '–'} · ${inStock ? 'In stock' : '⚠ Out of stock'}`,
      }
    },
  },
})
