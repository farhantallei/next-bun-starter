import { type NextRequest, NextResponse } from "next/server"

import type { PanigatedResponse } from "@/types/response"

const generateDummyData = (page: number, limit: number, search?: string) => {
  const TOTAL_ITEMS = 100
  let allItems = Array.from({ length: TOTAL_ITEMS }, (_, index) => ({
    id: index + 1,
    title: `Item ${index + 1}`,
    description: `This is the description for item ${index + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  }))

  // Filter berdasarkan search query
  if (search) {
    const searchLower = search.toLowerCase()
    allItems = allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower),
    )
  }

  const totalItems = allItems.length
  const totalPages = Math.ceil(totalItems / limit)

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedItems = allItems.slice(startIndex, endIndex)

  return {
    items: paginatedItems,
    totalItems,
    totalPages,
  }
}

export type ItemExample = {
  id: number
  title: string
  description: string
  createdAt: string
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = +(searchParams.get("page") || "1")
  const limit = +(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""

  await new Promise((resolve) => setTimeout(resolve, 500))

  const { items, totalItems, totalPages } = generateDummyData(
    page,
    limit,
    search,
  )

  return NextResponse.json<PanigatedResponse<ItemExample>>({
    data: items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    search: search || null,
  })
}
