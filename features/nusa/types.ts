export type NusaBaseModel<T = Record<string, unknown>> = {
  code: string
  name: string
  latitude: number
  longitude: number
} & T

export type NusaProvinceModel = NusaBaseModel

export type NusaRegencyModel = NusaBaseModel<{ province_code: string }>

export type NusaDistrictModel = NusaBaseModel<{
  province_code: string
  regency_code: string
}>

export type NusaVillageModel = NusaBaseModel<{
  province_code: string
  regency_code: string
  district_code: string
  postal_code: string
}>
