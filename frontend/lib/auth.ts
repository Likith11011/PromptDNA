const TOKEN_KEY = "promptdna_token"

export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token)
    // Also set cookie so middleware can read it
    document.cookie = `promptdna_token=${token}; path=/; max-age=3600`
  }
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY)
    // Clear the cookie too
    document.cookie = "promptdna_token=; path=/; max-age=0"
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}


export function isLoggedIn(): boolean {
  return getToken() !== null
}