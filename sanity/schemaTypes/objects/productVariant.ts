import { defineArrayMember, defineField, defineType } from 'sanity'

export const productVariant = defineType({
  name: 'productVariant',
  title: 'Variant',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Variant Type',
      type: 'string',
      description: 'e.g. "Size", "Color", "Material"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Variant Value',
      type: 'string',
      description: 'e.g. "M", "Red", "Cotton"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priceModifier',
      title: 'Price Modifier (₹)',
      type: 'number',
      description: 'Added to base price. Use negative values for discounts.',
      initialValue: 0,
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Variant Image',
      type: 'imageWithAlt',
      description: 'Optional image specific to this variant (e.g. color swatch)',
    }),
  ],
  preview: {
    select: {
      label: 'label',
      value: 'value',
      inStock: 'inStock',
    },
    prepare({ label, value, inStock }: { label?: string; value?: string; inStock?: boolean }) {
      return {
        title: `${label ?? 'Variant'}: ${value ?? '–'}`,
        subtitle: inStock ? 'In stock' : 'Out of stock',
      }
    },
  },
})

export const productVariantArrayMember = defineArrayMember({ type: 'productVariant' })
