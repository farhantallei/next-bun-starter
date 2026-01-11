import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod/v4"

export const env = createEnv({
  client: {
    // API URLs
    NEXT_PUBLIC_REDACTOR_API_URL: z.url().refine((url) => !url.endsWith("/"), {
      message: "NEXT_PUBLIC_REDACTOR_API_URL must not end with a slash",
    }),
    NEXT_PUBLIC_REDACTOR_API_KEY: z.string().nonempty(),
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: {
    // API URLs
    NEXT_PUBLIC_REDACTOR_API_URL: process.env.NEXT_PUBLIC_REDACTOR_API_URL,
    NEXT_PUBLIC_REDACTOR_API_KEY: process.env.NEXT_PUBLIC_REDACTOR_API_KEY,
  },
})
