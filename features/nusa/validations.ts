import z from "zod"

export function validateAddressInput(data: unknown) {
  const schema = z.object({
    province: z
      .string({ error: "Provinsi is required" })
      .min(1, "Provinsi is required"),
    regency: z
      .string({ error: "Kabupaten/Kota is required" })
      .min(1, "Kabupaten/Kota is required"),
    district: z
      .string({ error: "Kecamatan is required" })
      .min(1, "Kecamatan is required"),
    village: z
      .string({ error: "Kelurahan is required" })
      .min(1, "Kelurahan is required"),
  })

  return schema.parse(data)
}
