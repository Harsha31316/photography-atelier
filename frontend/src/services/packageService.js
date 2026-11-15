import apiClient from './api.js'

export async function getPackages(config) {
  const response = await apiClient.get('/packages', config)
  return response.data
}

export async function createPackage(packageData) {
  const response = await apiClient.post('/packages', packageData)
  return response.data
}

export async function updatePackage(id, packageData) {
  const response = await apiClient.put(`/packages/${encodeURIComponent(id)}`, packageData)
  return response.data
}

export async function deletePackage(id) {
  const response = await apiClient.delete(`/packages/${encodeURIComponent(id)}`)
  return response.data
}

export async function searchPackagesByName(name, config) {
  const response = await apiClient.get('/packages/search', {
    ...config,
    params: { ...config?.params, name },
  })
  return response.data
}

export async function getPackageById(id, config) {
  const response = await apiClient.get(`/packages/${encodeURIComponent(id)}`, config)
  return response.data
}

export async function getDashboardStats(config) {
  const response = await apiClient.get('/packages/dashboard', config)
  return response.data
}

export function getApiErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Something went wrong.'
}
