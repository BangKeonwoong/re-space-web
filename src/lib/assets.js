export const resolveAssetUrl = (path) => {
  const fallback = 'products/placeholder.svg'
  const base = import.meta.env.BASE_URL || '/'
  const source = path && String(path).trim() ? String(path).trim() : fallback

  if (
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.startsWith('data:')
  ) {
    return source
  }

  const normalized = source.startsWith('/') ? source.slice(1) : source
  const safeBase = base.endsWith('/') ? base : `${base}/`
  return `${safeBase}${normalized}`
}
