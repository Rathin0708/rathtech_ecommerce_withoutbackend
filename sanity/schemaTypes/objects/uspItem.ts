import { defineField, defineType } from 'sanity'

export const uspItem = defineType({
  name: 'uspItem',
  title: 'Trust Signal',
  type: 'object',
  fields: [
    defineField({
      name: 'iconName',
      title: 'Icon Name',
      type: 'string',
      description: 'Lucide icon name e.g. "truck", "shield-check", "rotate-ccw", "badge-check"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Free Delivery"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'e.g. "On orders over ₹999"',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle' },
  },
})
