import { TagIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      description: 'SEO-friendly description shown below the product grid',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'imageWithAlt',
      description: 'Recommended: 1200 × 400 px',
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Leave empty for top-level categories',
      validation: (Rule) =>
        Rule.custom(async (value, ctx) => {
          if (!value || !(value as { _ref?: string })._ref) return true
          const doc = ctx.document as { _id?: string }
          if ((value as { _ref?: string })._ref === doc?._id) {
            return 'A category cannot be its own parent'
          }
          return true
        }),
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first in navigation',
      initialValue: 0,
    }),
    defineField({
      name: 'seo',
      title: 'SEO Overrides',
      type: 'seoFields',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      parentName: 'parent.name',
      media: 'heroImage',
    },
    prepare({ title, parentName }: { title?: string; parentName?: string }) {
      return {
        title: title ?? 'Untitled Category',
        subtitle: parentName ? `Under: ${parentName}` : 'Top-level',
      }
    },
  },
})
