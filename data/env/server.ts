import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod/v4"

export const env = createEnv({
  server: {
    LOG_LEVEL: z
      .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
      .default("info"),
    NUSA_API_URL: z.url().refine((url) => !url.endsWith("/"), {
      message: "NUSA_API_URL must not end with a slash",
    }),
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
})
