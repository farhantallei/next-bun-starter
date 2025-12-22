// biome-ignore lint/style/useNodejsImportProtocol: This is a Node.js environment
import { cpus, totalmem } from "os"

export async function getServerStats() {
  const bunVersion = Bun.version
  const bunRevision = Bun.revision
  const cpuUsage = process.cpuUsage()
  const processUptime = process.uptime()

  const numCores = cpus().length
  const totalCpuTime = (cpuUsage.user + cpuUsage.system) / 1000000
  const cpuPercentage =
    processUptime > 0
      ? Math.min(100, (totalCpuTime / (processUptime * numCores)) * 100)
      : 0

  const cpuInfo = cpus()[0]

  return {
    bunVersion,
    bunRevision,
    platform: process.platform,
    arch: process.arch,
    pid: process.pid,
    uptime: Math.floor(processUptime),
    cpu: {
      percentage: Math.round(cpuPercentage * 100) / 100,
      cores: numCores,
    },
    environment: {
      cpuModel: cpuInfo?.model || "Unknown",
      totalMemory: totalmem(),
    },
  }
}

export function formatUptime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
  if (minutes > 0) return `${minutes}m ${secs}s`
  return `${secs}s`
}

export function formatBytes(bytes: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  })

  const gb = bytes / (1024 * 1024 * 1024)
  if (gb >= 1) return `${formatter.format(gb)} GB`
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${formatter.format(mb)} MB`
  const kb = bytes / 1024
  return `${formatter.format(kb)} KB`
}
