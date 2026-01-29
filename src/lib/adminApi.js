import { API_BASE_URL, apiRequest } from './api'

export const adminRequest = (path, accessToken, options = {}) => {
  if (!accessToken) {
    throw new Error('ADMIN_AUTH_REQUIRED')
  }

  return apiRequest(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const uploadAdminFile = async ({ accessToken, file }) => {
  if (!accessToken) {
    throw new Error('ADMIN_AUTH_REQUIRED')
  }
  if (!file) {
    throw new Error('FILE_REQUIRED')
  }

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/admin/uploads`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = data?.details || data?.error || 'UPLOAD_FAILED'
    throw new Error(message)
  }

  return data
}
