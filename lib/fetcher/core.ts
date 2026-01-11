import { APIError } from "./errors"
import type { FetcherInterceptor } from "./types"

export function createBaseFetcher(
  baseUrl: string,
  defaultHeaders: HeadersInit = {},
  interceptor?: FetcherInterceptor,
) {
  return async <T>(pathname: string, options?: RequestInit): Promise<T> => {
    const url = `${baseUrl}${pathname}`

    let finalOptions: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    }

    if (interceptor) {
      finalOptions = await interceptor(finalOptions)
    }

    console.log(url)
    console.log(finalOptions)

    const res = await fetch(url, finalOptions)

    let data: unknown = null
    const isJson = res.headers.get("content-type")?.includes("application/json")

    if (isJson) {
      data = await res.json()
    } else {
      data = await res.text()
    }

    if (!res.ok) {
      const message =
        (isJson && (data as { message?: string })?.message) ||
        res.statusText ||
        "Unknown API error"
      throw new APIError(message, url, res.status, data)
    }

    if (res.status === 204) return null as T
    return data as T
  }
}
