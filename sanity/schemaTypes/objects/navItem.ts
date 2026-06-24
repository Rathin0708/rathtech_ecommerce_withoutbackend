import { defineArrayMember, defineField, defineType } from 'sanity'

export const navItem = defineType({
  name: 'navItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      description: 'Leave empty if this item only expands a sub-menu',
    }),
    defineField({
      name: 'children',
      title: 'Sub-menu Links',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'navChild',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        }),
      ],
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image (Mega Menu)',
      type: 'imageWithAlt',
      description: 'Optional image shown in the right column of the mega menu',
    }),
    defineField({
      name: 'featuredImageLink',
      title: 'Featured Image URL',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'url' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      const childCount = 0
      return {
        title: title ?? 'Nav Item',
        subtitle: subtitle ?? `${childCount} sub-items`,
      }
    },
  },
})
