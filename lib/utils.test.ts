import { describe, expect, it } from "bun:test"

import { cn } from "./utils"

describe("cn utility function", () => {
  it("merges classes", () => {
    expect(cn("text-sm", null, "text-lg")).toBe("text-lg")
  })
})
