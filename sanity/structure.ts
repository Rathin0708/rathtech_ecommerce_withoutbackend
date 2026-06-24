import type { StructureResolver } from 'sanity/structure'

// Singletons — document types that should only have one document
const singletons = new Set(['homePage', 'siteSettings'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('E-Commerce')
    .items([
      // ── Singletons ──────────────────────────────────
      S.listItem()
        .title('🏠 Homepage')
        .id('homePage')
        .child(
          S.editor()
            .id('homePage')
            .schemaType('homePage')
            .documentId('singleton-homePage')
        ),

      S.listItem()
        .title('⚙️ Site Settings')
        .id('siteSettings')
        .child(
          S.editor()
            .id('siteSettings')
            .schemaType('siteSettings')
            .documentId('singleton-siteSettings')
        ),

      S.divider(),

      // ── Products ─────────────────────────────────────
      S.documentTypeListItem('product').title('📦 Products'),
      S.documentTypeListItem('category').title('🗂️ Categories'),

      S.divider(),

      // ── Pages ────────────────────────────────────────
      S.documentTypeListItem('staticPage').title('📄 Static Pages'),

      S.divider(),

      // ── Catch-all for any remaining types not listed above ──
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() !== undefined &&
          !singletons.has(item.getId()!) &&
          !['product', 'category', 'staticPage'].includes(item.getId()!)
      ),
    ])
