import { type ClassValue, clsx } from "clsx"
import qs from "qs"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildQueryParams(params: object) {
  return qs.stringify(params, {
    skipNulls: true,
    encode: true,
    addQueryPrefix: true,
    arrayFormat: "repeat",
  })
}

export function getPathname(...endpoint: string[]) {
  if (endpoint.length === 0) {
    return ""
  }

  const lastEndpoint = endpoint[endpoint.length - 1]
  const hasQueryParams = lastEndpoint.startsWith("?")

  // Handle query-only endpoint
  if (endpoint.length === 1 && hasQueryParams) {
    return lastEndpoint
  }

  // Normalize and join all segments
  const segments = endpoint
    .flatMap((seg) => seg.split("/"))
    .map((seg) => seg.replace(/^\.+/, "")) // Remove leading dots
    .filter((seg) => seg !== "" && !seg.startsWith("?"))

  // Get query string if exists
  const queryString = hasQueryParams ? lastEndpoint : ""

  const pathname = `/${segments.join("/")}${queryString}`

  return pathname.replace(/\/$/, "")
}
