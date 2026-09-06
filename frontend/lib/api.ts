import axios from "axios"
import { getToken } from "./auth"

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // In browser, proxy requests through Next.js rewrite to eliminate CORS/Network issues
    return "/api/proxy"
  }
  return (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "")
}

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 45000,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.method === "post" || config.method === "put" || config.method === "patch") {
    config.headers["Content-Type"] = "application/json"
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Only redirect if not already on login or signup
        const path = window.location.pathname
        if (!path.startsWith("/auth/") && path !== "/login" && path !== "/signup") {
          localStorage.removeItem("promptdna_token")
          document.cookie = "promptdna_token=; path=/; max-age=0"
          window.location.href = "/auth/login"
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api