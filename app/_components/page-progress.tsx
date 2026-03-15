"use client"

import { Bar, Progress } from "@bprogress/next"

export default function PageProgress() {
  return (
    <div className="fixed inset-x-0 top-0 z-9999 mx-auto h-1 max-w-lg overflow-hidden">
      <Progress>
        <Bar className="absolute! top-0! z-9999! h-0.5! bg-primary!" />
      </Progress>
    </div>
  )
}
