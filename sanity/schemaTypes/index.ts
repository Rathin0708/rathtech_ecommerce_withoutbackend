import { type SchemaTypeDefinition } from 'sanity'

// Object types (reusable sub-documents)
import { imageWithAlt } from './objects/imageWithAlt'
import { seoFields } from './objects/seoFields'
import { productVariant } from './objects/productVariant'
import { ctaButton } from './objects/ctaButton'
import { heroBanner } from './objects/heroBanner'
import { testimonial } from './objects/testimonial'
import { uspItem } from './objects/uspItem'
import { navItem } from './objects/navItem'

// Document types
import { product } from './documents/product'
import { category } from './documents/category'
import { staticPage } from './documents/staticPage'
import { homePage } from './documents/homePage'
import { siteSettings } from './documents/siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Objects first (documents may reference them)
    imageWithAlt,
    seoFields,
    productVariant,
    ctaButton,
    heroBanner,
    testimonial,
    uspItem,
    navItem,
    // Documents
    product,
    category,
    staticPage,
    homePage,
    siteSettings,
  ],
}
