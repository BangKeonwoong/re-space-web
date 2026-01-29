export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = data?.error || data?.message || response.statusText
    const error = new Error(message)
    error.status = response.status
    error.details = data?.details
    throw error
  }

  return data
}
