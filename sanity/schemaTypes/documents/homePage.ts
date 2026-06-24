import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  // Prevent creating more than one homepage document via Studio structure (singleton)
  fields: [
    defineField({
      name: 'heroSlides',
      title: 'Hero Slides',
      type: 'array',
      description: 'Minimum 1, maximum 3 slides',
      of: [defineArrayMember({ type: 'heroBanner' })],
      validation: (Rule) =>
        Rule.required().min(1).max(3).error('At least 1 hero slide is required (max 3)'),
    }),
    defineField({
      name: 'featuredCategories',
      title: 'Featured Categories',
      type: 'array',
      description: 'Shown as chips/cards below the hero (max 6)',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'featuredProductsTitle',
      title: 'Featured Products Section Title',
      type: 'string',
      initialValue: 'New Arrivals',
    }),
    defineField({
      name: 'featuredProducts',
      title: 'Featured Products',
      type: 'array',
      description: 'Shown in the first product grid (max 8)',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'promoBanner',
      title: 'Promotional Banner',
      type: 'heroBanner',
      description: 'Full-width promotional banner between the two product grids',
    }),
    defineField({
      name: 'secondaryProductsTitle',
      title: 'Secondary Products Section Title',
      type: 'string',
      initialValue: 'Best Sellers',
    }),
    defineField({
      name: 'secondaryProducts',
      title: 'Secondary Products',
      type: 'array',
      description: 'Shown in the second product grid (max 8)',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'testimonials',
      title: 'Customer Testimonials',
      type: 'array',
      of: [defineArrayMember({ type: 'testimonial' })],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'uspItems',
      title: 'Trust Signals (USP Bar)',
      type: 'array',
      description: '3–4 icons shown in the trust bar',
      of: [defineArrayMember({ type: 'uspItem' })],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'showWhatsAppCta',
      title: 'Show WhatsApp Community CTA',
      type: 'boolean',
      description: 'Display the "Join our WhatsApp community" section',
      initialValue: true,
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Homepage' }
    },
  },
})
