export const CATEGORY_OPTIONS = [
  { value: 'new', label: '신상품' },
  { value: 'premium-refurb', label: '프리미엄 리퍼브' },
  { value: 'refurb', label: '리퍼브' },
  { value: 'vintage', label: '빈티지' },
]

export const CATALOG_CATEGORIES = [
  { key: 'all', label: '전체' },
  ...CATEGORY_OPTIONS.map((item) => ({ key: item.value, label: item.label })),
]

export const getCategoryLabel = (key) => {
  if (!key) return ''
  return CATALOG_CATEGORIES.find((item) => item.key === key)?.label || key
}
