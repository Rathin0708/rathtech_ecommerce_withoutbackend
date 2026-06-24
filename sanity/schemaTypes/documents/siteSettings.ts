import { CogIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  // Singleton — only one document of this type should exist (enforced in structure.ts)
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'nav', title: 'Navigation' },
    { name: 'footer', title: 'Footer & Social' },
    { name: 'seo', title: 'SEO Defaults' },
  ],
  fields: [
    // ── General ──────────────────────────────────────
    defineField({
      name: 'storeName',
      title: 'Store Name',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'general',
      description: 'Short tagline used in homepage title and meta description',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'imageWithAlt',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      group: 'general',
      description: 'Recommended: 32 × 32 px PNG',
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      group: 'general',
      description: 'E.164 format without the + sign. e.g. 917012345678',
      validation: (Rule) =>
        Rule.required().regex(/^\d{10,15}$/, {
          name: 'E.164 format',
          invert: false,
        }).error('Must be 10–15 digits with no spaces, dashes, or + prefix'),
    }),
    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar',
      type: 'object',
      group: 'general',
      fields: [
        defineField({
          name: 'isVisible',
          title: 'Show Announcement Bar',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'text',
          title: 'Announcement Text',
          type: 'string',
          description: 'e.g. "Free shipping on orders over ₹999"',
        }),
        defineField({
          name: 'linkText',
          title: 'Link Text',
          type: 'string',
          description: 'e.g. "Shop Now"',
        }),
        defineField({
          name: 'linkUrl',
          title: 'Link URL',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'currency',
      title: 'Currency Code',
      type: 'string',
      group: 'general',
      initialValue: 'INR',
    }),
    defineField({
      name: 'currencySymbol',
      title: 'Currency Symbol',
      type: 'string',
      group: 'general',
      initialValue: '₹',
    }),
    defineField({
      name: 'uspItems',
      title: 'Trust Signals (USP Bar)',
      type: 'array',
      group: 'general',
      description: '3–4 icons shown in the trust bar',
      of: [defineArrayMember({ type: 'uspItem' })],
      validation: (Rule) => Rule.max(4),
    }),

    // ── Navigation ────────────────────────────────────
    defineField({
      name: 'primaryNav',
      title: 'Primary Navigation',
      type: 'array',
      group: 'nav',
      of: [defineArrayMember({ type: 'navItem' })],
    }),

    // ── Footer & Social ───────────────────────────────
    defineField({
      name: 'footerNav',
      title: 'Footer Navigation Groups',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          name: 'footerGroup',
          type: 'object',
          fields: [
            defineField({ name: 'groupTitle', title: 'Group Title', type: 'string' }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'footerLink',
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'url', type: 'string', validation: (Rule) => Rule.required() }),
                  ],
                  preview: { select: { title: 'label', subtitle: 'url' } },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'groupTitle' } },
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
        defineField({ name: 'twitter', title: 'Twitter / X URL', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
      ],
    }),

    // ── SEO Defaults ──────────────────────────────────
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seoFields',
      group: 'seo',
      description: 'Fallback SEO used when pages have no specific SEO override',
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
