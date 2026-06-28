import axios from "axios"
import { getToken } from "./auth"

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "")

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Always ensure Content-Type is set for POST requests
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
        localStorage.removeItem("promptdna_token")
        document.cookie = "promptdna_token=; path=/; max-age=0"
        window.location.href = "/auth/login"
      }
    }
    return Promise.reject(error)
  }
)

export default api