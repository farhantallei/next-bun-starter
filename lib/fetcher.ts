import { getPathname } from "@/lib/utils"

type FetcherInterceptor = (
  options: RequestInit,
) => Promise<RequestInit> | RequestInit

function createBaseFetcher(
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

export function createFetcher(
  baseUrl: string,
  interceptor?: FetcherInterceptor,
) {
  const baseFetch = createBaseFetcher(
    baseUrl,
    { "Content-Type": "application/json" },
    interceptor,
  )

  return <T>(...endpoint: string[]) => {
    const pathname = getPathname(...endpoint)
    return (options?: RequestInit) => baseFetch<T>(pathname, options)
  }
}

export function createFormDataFetcher(
  baseUrl: string,
  interceptor?: FetcherInterceptor,
) {
  const baseFetch = createBaseFetcher(baseUrl, {}, interceptor)

  return <T>(...endpoint: string[]) => {
    const pathname = getPathname(...endpoint)
    return (options?: RequestInit) => baseFetch<T>(pathname, options)
  }
}

export class APIError extends Error {
  status: number
  url: string
  info?: unknown
  log: string

  constructor(message: string, url: string, status: number, info?: unknown) {
    super(message)
    this.name = "APIError"
    this.url = url
    this.status = status
    this.info = info

    this.log = this.formatLog(info)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError)
    }
  }

  private formatLog(info: unknown): string {
    if (info === null || info === undefined) {
      return "No additional info"
    }

    if (typeof info === "string") {
      return info
    }

    if (typeof info === "object") {
      try {
        return JSON.stringify(info, null, 2) // Pretty print for better readability
      } catch {
        return "[Circular or Non-Serializable Object]"
      }
    }

    return String(info)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      url: this.url,
      info: this.info,
      stack: this.stack,
    }
  }

  isClientError(): boolean {
    return this.status >= 400 && this.status < 500
  }

  isServerError(): boolean {
    return this.status >= 500
  }

  isUnauthorized(): boolean {
    return this.status === 401
  }

  isForbidden(): boolean {
    return this.status === 403
  }

  isNotFound(): boolean {
    return this.status === 404
  }
}
