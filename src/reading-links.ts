// Original teaching articles may link to these public, bilingual print assets.
// Keep imported/source readings inert unless their caller enables source links.
export function readingSourceHref(href: string, baseUrl: string, allowSourceLinks: boolean): string | null {
  if (!allowSourceLinks) return null
  if (/^https?:\/\//i.test(href)) return href
  if (!/^\/print-and-play\/book-cart\/(?:zh-CN|en)\.pdf$/.test(href)) return null
  return `${baseUrl.replace(/\/?$/, '/')}${href.slice(1)}`
}
