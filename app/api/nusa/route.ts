import { NextResponse } from "next/server"
import { env } from "@/data/env/server"

export async function GET() {
  const res = await fetch(env.NUSA_API_URL)

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: res.status },
    )
  }

  const data = await res.json()
  return NextResponse.json(data)
}
