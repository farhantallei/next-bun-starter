export type PanigatedResponse<T = unknown> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  search: string | null
}
