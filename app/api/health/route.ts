import { NextResponse } from "next/server"

import { formatBytes, formatUptime, getServerStats } from "./lib/server-stats"

export const dynamic = "force-dynamic"

export async function GET() {
  const stats = await getServerStats()

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: formatUptime(stats.uptime),
    bunVersion: stats.bunVersion,
    bunRevision: stats.bunRevision,
    platform: stats.platform,
    arch: stats.arch,
    pid: stats.pid,
    cpu: {
      model: stats.environment.cpuModel,
      usage: stats.cpu.percentage,
      cores: stats.cpu.cores,
    },
    memory: formatBytes(stats.environment.totalMemory),
  })
}
