import { env } from "@/data/env/client"
import { createFetcher } from "@/lib/fetcher"

import type {
  NusaBaseModel,
  NusaDistrictModel,
  NusaProvinceModel,
  NusaRegencyModel,
  NusaVillageModel,
} from "./types"

const fetcher = createFetcher(env.NEXT_PUBLIC_NUSA_API_URL)

export async function getNusaProvinces() {
  return fetcher<NusaProvinceModel[]>()()
}

export async function getNusaRegencies(provinceCode: string) {
  return fetcher<NusaBaseModel<{ regencies: NusaRegencyModel[] }>>(
    provinceCode,
  )()
}

export async function getNusaDistricts(regencyCode: string) {
  return fetcher<
    NusaBaseModel<{ province_code: string; districts: NusaDistrictModel[] }>
  >(regencyCode.replace(".", "/"))()
}

export async function getNusaVillages(districtCode: string) {
  return fetcher<
    NusaBaseModel<{
      province_code: string
      regency_code: string
      villages: NusaVillageModel[]
    }>
  >(districtCode.replace(".", "/"))()
}

export async function getNusaVillageByCode(villageCode: string) {
  return fetcher<NusaVillageModel>(villageCode.replace(".", "/"))()
}
