import { defineField, defineType } from 'sanity'

export const heroBanner = defineType({
  name: 'heroBanner',
  title: 'Hero Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheadline',
      title: 'Sub-headline',
      type: 'string',
    }),
    defineField({
      name: 'desktopImage',
      title: 'Desktop Image',
      type: 'imageWithAlt',
      description: 'Recommended: 1440 × 600 px',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobile Image',
      type: 'imageWithAlt',
      description: 'Recommended: 390 × 500 px. Falls back to desktop image if not set.',
    }),
    defineField({
      name: 'cta',
      title: 'Call-to-Action Button',
      type: 'ctaButton',
    }),
    defineField({
      name: 'textColorScheme',
      title: 'Text Color',
      type: 'string',
      options: {
        list: [
          { title: 'Light (white text on dark image)', value: 'light' },
          { title: 'Dark (dark text on light image)', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      media: 'desktopImage',
    },
  },
})
