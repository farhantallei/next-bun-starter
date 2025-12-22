/// <reference lib="dom" />
/** biome-ignore-all lint/a11y/useButtonType: for test */

import { describe, expect, it, test } from "bun:test"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import { Button } from "./ui/button"

describe("Infrastructure Smoke Test", () => {
  it("should render and query dom elements correctly", () => {
    render(<div data-testid="test-div">Hello Bun</div>)

    const element = screen.getByTestId("test-div")

    expect(element).toBeInTheDocument()
    expect(element).toHaveTextContent("Hello Bun")
  })

  test("renders button", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button")).toHaveTextContent("Click me")
  })
})
