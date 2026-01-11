import { env } from "@/data/env/client"
import { redactorFetcher } from "@/lib/fetcher/client"
import { buildFormData, buildQueryParams } from "@/lib/utils"

import type { UploadRedactorFileResponse } from "./types"

export async function uploadRedactorFile(source: File) {
  const q = buildQueryParams({ key: env.NEXT_PUBLIC_REDACTOR_API_KEY })
  const formData = buildFormData({ source })

  return redactorFetcher<UploadRedactorFileResponse>(q)({
    method: "POST",
    body: formData,
  })
}
