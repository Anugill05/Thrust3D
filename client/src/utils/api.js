import axios from 'axios'

const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' }, timeout: 30000 })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('p3d_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('p3d_token'); localStorage.removeItem('p3d_user')
      if (!window.location.pathname.includes('/login')) window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
