"use server"

import z, { ZodError } from "zod"
import { validateEditorInput } from "./validations"

export async function submitEditorAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())

  try {
    console.log("validating...")
    const { simpleEditor, richEditor } = validateEditorInput(data)

    console.log("done validating...")

    console.log({ simpleEditor, richEditor })

    return { success: true, data: { simpleEditor, richEditor } }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: z.flattenError(error) }
    }

    return { success: false, error: "Unknown" }
  }
}
