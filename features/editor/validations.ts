import z from "zod"

export function validateEditorInput(data: unknown) {
  const schema = z.object({
    simpleEditor: z
      .string({ error: "SimpleEditor is required" })
      .min(1, "SimpleEditor is required"),
    richEditor: z
      .string({ error: "RichEditor is required" })
      .min(1, "RichEditor is required"),
  })

  return schema.parse(data)
}
