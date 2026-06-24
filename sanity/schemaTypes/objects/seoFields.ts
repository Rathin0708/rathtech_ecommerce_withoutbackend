import { defineField, defineType } from 'sanity'

export const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Recommended: 50–70 characters',
      validation: (Rule) => Rule.max(70).warning('Keep meta titles under 70 characters'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Recommended: 120–160 characters',
      validation: (Rule) => Rule.max(160).warning('Keep meta descriptions under 160 characters'),
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'imageWithAlt',
      description: 'Social share image. Recommended: 1200 × 630 px',
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description: 'Prevent search engines from indexing this page',
      initialValue: false,
    }),
  ],
})
