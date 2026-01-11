"use server"

import z, { ZodError } from "zod"
import { validateAddressInput } from "./validations"

export async function submitAddressAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())

  try {
    console.log("validating...")
    const { province, regency, district, village } = validateAddressInput(data)

    console.log("done validating...")

    console.log({ province, regency, district, village })

    return { success: true, data: { province, regency, district, village } }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: z.flattenError(error) }
    }

    return { success: false, error: "Unknown" }
  }
}
