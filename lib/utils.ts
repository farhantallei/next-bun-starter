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

export function buildFormData(json: object) {
  const formData = new FormData()

  for (const [key, value] of Object.entries(json)) {
    if (value === null || value === undefined) continue

    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (item !== null && item !== undefined) {
          if (item instanceof File) {
            formData.append(key, item)
          } else if (item instanceof Date) {
            formData.append(key, item.toISOString())
          } else if (typeof item === "object") {
            Object.entries(item).forEach(([k, v]) => {
              if (v != null) {
                formData.append(`${key}[${i}][${k}]`, String(v))
              }
            })
          } else {
            formData.append(key, String(item))
          }
        }
      })
    } else if (value instanceof File) {
      formData.append(key, value)
    } else {
      formData.append(key, String(value))
    }
  }
  return formData
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
