export const PRODUCT_BRAND = '落桌'
export const PRODUCT_DESCRIPTOR = '桌游设计馆'
export const PRODUCT_FULL_NAME = `${PRODUCT_BRAND} · ${PRODUCT_DESCRIPTOR}`

export function brandedDownloadName(label: string) {
  return `${PRODUCT_BRAND}-${label}.json`
}
