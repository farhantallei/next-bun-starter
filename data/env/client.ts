import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod/v4"

export const env = createEnv({
  client: {
    NEXT_PUBLIC_NUSA_API_URL: z.url().refine((url) => !url.endsWith("/"), {
      message: "NEXT_PUBLIC_NUSA_API_URL must not end with a slash",
    }),
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: {
    NEXT_PUBLIC_NUSA_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
})
