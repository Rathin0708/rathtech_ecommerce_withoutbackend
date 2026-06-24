import { DocumentTextIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export const staticPage = defineType({
  name: 'staticPage',
  title: 'Static Page',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'e.g. "about", "faq", "returns", "privacy"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Page Content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                  {
                    name: 'openInNewTab',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          icon: ImageIcon,
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        }),
      ],
      validation: (Rule) => Rule.required().min(1).error('Page content is required'),
    }),
    defineField({
      name: 'seo',
      title: 'SEO Overrides',
      type: 'seoFields',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({ title, slug }: { title?: string; slug?: string }) {
      return {
        title: title ?? 'Untitled Page',
        subtitle: slug ? `/${slug}` : 'No slug',
      }
    },
  },
})
