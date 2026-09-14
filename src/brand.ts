export const PRODUCT_BRAND = '一桌点子'
export const PRODUCT_BRAND_EN = 'Make Games with Sichuang'
export const PRODUCT_DESCRIPTOR = '桌游设计学习馆'
export const PRODUCT_FULL_NAME = `${PRODUCT_BRAND} · ${PRODUCT_BRAND_EN}`
export const brandName = (language: string) => language === 'en' ? PRODUCT_BRAND_EN : PRODUCT_BRAND

export function brandedDownloadName(label: string) {
  return `${PRODUCT_BRAND}-${label}.json`
}
