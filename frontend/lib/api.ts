import axios from "axios"
import { getToken } from "./auth"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor — runs before every API call
// Reads the token from localStorage and attaches it automatically
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — runs after every API response
// If backend returns 401, clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("promptdna_token")
        window.location.href = "/auth/login"
      }
    }
    return Promise.reject(error)
  }
)

export default api