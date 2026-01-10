import { createFetcher } from "@/lib/fetcher"
import { buildQueryParams } from "@/lib/utils"
import type { PaginatedRequest } from "@/types/request"
import type { PanigatedResponse } from "@/types/response"

import type { ItemExample } from "./types"

const fetcher = createFetcher("/api")

export async function getPaginatedData(query: PaginatedRequest = {}) {
  const q = buildQueryParams(query)
  return fetcher<PanigatedResponse<ItemExample>>("/dummy-paginated", q)()
}
