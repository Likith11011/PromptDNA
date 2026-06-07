import axios from "axios"
import { getToken } from "./auth"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  // Timeout after 30 seconds — Render free tier can be slow on cold start
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout — backend may be waking up, try again")
    }
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("promptdna_token")
        document.cookie = "promptdna_token=; path=/; max-age=0"
        window.location.href = "/auth/login"
      }
    }
    return Promise.reject(error)
  }
)

export default api