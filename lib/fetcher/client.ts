import { env } from "@/data/env/client"

import { createFormDataFetcher } from "./index"

export const redactorFetcher = createFormDataFetcher(
  env.NEXT_PUBLIC_REDACTOR_API_URL,
)
