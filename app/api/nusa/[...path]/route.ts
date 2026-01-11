import { type NextRequest, NextResponse } from "next/server"
import { env } from "@/data/env/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  const url = `${env.NUSA_API_URL}/${path.join("/")}`

  const res = await fetch(url)

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: res.status },
    )
  }

  const data = await res.json()
  return NextResponse.json(data)
}
