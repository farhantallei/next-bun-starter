import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test"

import { APIError, createFetcher, createFormDataFetcher } from "./fetcher"

describe("createFetcher", () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    // @ts-expect-error
    globalThis.fetch = mock(() => Promise.resolve(new Response()))
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it("should create a fetcher function", () => {
    const fetcher = createFetcher("https://api.example.com")
    expect(typeof fetcher).toBe("function")
  })

  it("should call fetch with correct URL", async () => {
    const mockFetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ data: "test" }), {
          headers: { "Content-Type": "application/json" },
        }),
      ),
    )
    // @ts-expect-error
    globalThis.fetch = mockFetch

    const fetcher = createFetcher("https://api.example.com")
    await fetcher("users")()

    expect(mockFetch).toHaveBeenCalledTimes(1)
    // @ts-expect-error
    const [url] = mockFetch.mock.calls[0]
    // @ts-expect-error
    expect(url).toBe("https://api.example.com/users")
  })

  it("should join multiple endpoint segments", async () => {
    const mockFetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ data: "test" }), {
          headers: { "Content-Type": "application/json" },
        }),
      ),
    )
    // @ts-expect-error
    globalThis.fetch = mockFetch

    const fetcher = createFetcher("https://api.example.com")
    await fetcher("api", "v1", "users")()

    // @ts-expect-error
    const [url] = mockFetch.mock.calls[0]
    // @ts-expect-error
    expect(url).toBe("https://api.example.com/api/v1/users")
  })

  it("should handle path with query parameters", async () => {
    const mockFetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ data: "test" }), {
          headers: { "Content-Type": "application/json" },
        }),
      ),
    )
    // @ts-expect-error
    globalThis.fetch = mockFetch

    const fetcher = createFetcher("https://api.example.com")
    await fetcher("users", "?page=1")()

    // @ts-expect-error
    const [url] = mockFetch.mock.calls[0]
    // @ts-expect-error
    expect(url).toBe("https://api.example.com/users?page=1")
  })

  it("should include Content-Type: application/json header", async () => {
    const mockFetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ data: "test" }), {
          headers: { "Content-Type": "application/json" },
        }),
      ),
    )
    // @ts-expect-error
    globalThis.fetch = mockFetch

    const fetcher = createFetcher("https://api.example.com")
    await fetcher("users")()

    // @ts-expect-error
    const [, options] = mockFetch.mock.calls[0]
    // @ts-expect-error
    expect(options?.headers).toEqual({ "Content-Type": "application/json" })
  })

  it("should merge custom headers with default headers", async () => {
    const mockFetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ data: "test" }), {
          headers: { "Content-Type": "application/json" },
        }),
      ),
    )
    // @ts-expect-error
    globalThis.fetch = mockFetch

    const fetcher = createFetcher("https://api.example.com")
    await fetcher("users")({
      headers: { Authorization: "Bearer token" },
    })

    // @ts-expect-error
    const [, options] = mockFetch.mock.calls[0]
    // @ts-expect-error
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer token",
    })
  })

  it("should return JSON data on successful response", async () => {
    const mockData = { id: 1, name: "John" }
    // @ts-expect-error
    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify(mockData), {
          headers: { "Content-Type": "application/json" },
        }),
      ),
    )

    const fetcher = createFetcher("https://api.example.com")
    const result = await fetcher<typeof mockData>("users")()

    expect(result).toEqual(mockData)
  })

  it("should return text data when content-type is not JSON", async () => {
    const textData = "Hello World"
    // @ts-expect-error
    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(textData, {
          headers: { "Content-Type": "text/plain" },
        }),
      ),
    )

    const fetcher = createFetcher("https://api.example.com")
    const result = await fetcher<string>("text")()

    expect(result).toBe(textData)
  })

  it("should return null for 204 No Content response", async () => {
    // @ts-expect-error
    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(null, {
          status: 204,
        }),
      ),
    )

    const fetcher = createFetcher("https://api.example.com")
    const result = await fetcher("users")()

    expect(result).toBeNull()
  })

  it("should throw APIError on non-ok response", async () => {
    // @ts-expect-error
    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ message: "Not Found" }), {
          status: 404,
          statusText: "Not Found",
          headers: { "Content-Type": "application/json" },
        }),
      ),
    )

    const fetcher = createFetcher("https://api.example.com")

    expect(fetcher("users")()).rejects.toThrow(APIError)
  })

  it("should use message from JSON response for APIError", async () => {
    // @ts-expect-error
    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ message: "User not found" }), {
          status: 404,
          statusText: "Not Found",
          headers: { "Content-Type": "application/json" },
        }),
      ),
    )

    const fetcher = createFetcher("https://api.example.com")

    try {
      await fetcher("users")()
    } catch (error) {
      expect(error).toBeInstanceOf(APIError)
      expect((error as APIError).message).toBe("User not found")
      expect((error as APIError).status).toBe(404)
    }
  })

  it("should use statusText when no message in response", async () => {
    // @ts-expect-error
    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({}), {
          status: 500,
          statusText: "Internal Server Error",
          headers: { "Content-Type": "application/json" },
        }),
      ),
    )

    const fetcher = createFetcher("https://api.example.com")

    try {
      await fetcher("users")()
    } catch (error) {
      expect((error as APIError).message).toBe("Internal Server Error")
    }
  })

  it("should call interceptor when provided", async () => {
    const interceptor = mock((options: RequestInit) => ({
      ...options,
      headers: {
        ...options.headers,
        "X-Custom-Header": "custom-value",
      },
    }))

    const mockFetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ data: "test" }), {
          headers: { "Content-Type": "application/json" },
        }),
      ),
    )
    // @ts-expect-error
    globalThis.fetch = mockFetch

    const fetcher = createFetcher("https://api.example.com", interceptor)
    await fetcher("users")()

    expect(interceptor).toHaveBeenCalledTimes(1)
    // @ts-expect-error
    const [, options] = mockFetch.mock.calls[0]
    // @ts-expect-error
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      "X-Custom-Header": "custom-value",
    })
  })

  it("should support async interceptor", async () => {
    const interceptor = mock(async (options: RequestInit) => {
      await Promise.resolve()
      return {
        ...options,
        headers: {
          ...options.headers,
          Authorization: "Bearer async-token",
        },
      }
    })

    const mockFetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ data: "test" }), {
          headers: { "Content-Type": "application/json" },
        }),
      ),
    )
    // @ts-expect-error
    globalThis.fetch = mockFetch

    const fetcher = createFetcher("https://api.example.com", interceptor)
    await fetcher("users")()

    // @ts-expect-error
    const [, options] = mockFetch.mock.calls[0]
    // @ts-expect-error
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer async-token",
    })
  })

  it("should pass request options to fetch", async () => {
    const mockFetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ data: "test" }), {
          headers: { "Content-Type": "application/json" },
        }),
      ),
    )
    // @ts-expect-error
    globalThis.fetch = mockFetch

    const fetcher = createFetcher("https://api.example.com")
    await fetcher("users")({
      method: "POST",
      body: JSON.stringify({ name: "John" }),
    })

    // @ts-expect-error
    const [, options] = mockFetch.mock.calls[0]
    // @ts-expect-error
    expect(options?.method).toBe("POST")
    // @ts-expect-error
    expect(options?.body).toBe(JSON.stringify({ name: "John" }))
  })
})

describe("createFormDataFetcher", () => {
  const originalFetch = globalThis.fetch

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it("should create a fetcher function", () => {
    const fetcher = createFormDataFetcher("https://api.example.com")
    expect(typeof fetcher).toBe("function")
  })

  it("should NOT include Content-Type header", async () => {
    const mockFetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ data: "test" }), {
          headers: { "Content-Type": "application/json" },
        }),
      ),
    )
    // @ts-expect-error
    globalThis.fetch = mockFetch

    const fetcher = createFormDataFetcher("https://api.example.com")
    await fetcher("upload")()

    // @ts-expect-error
    const [, options] = mockFetch.mock.calls[0]
    // @ts-expect-error
    expect(options?.headers).toEqual({})
  })

  it("should allow FormData to set its own content-type", async () => {
    const mockFetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        }),
      ),
    )
    // @ts-expect-error
    globalThis.fetch = mockFetch

    const formData = new FormData()
    formData.append("file", new Blob(["test"]), "test.txt")

    const fetcher = createFormDataFetcher("https://api.example.com")
    await fetcher("upload")({
      method: "POST",
      body: formData,
    })

    // @ts-expect-error
    const [, options] = mockFetch.mock.calls[0]
    // @ts-expect-error
    expect(options?.body).toBe(formData)
  })
})

describe("APIError", () => {
  it("should create an error with correct properties", () => {
    const error = new APIError(
      "Not Found",
      "https://api.example.com/users",
      404,
    )

    expect(error.message).toBe("Not Found")
    expect(error.url).toBe("https://api.example.com/users")
    expect(error.status).toBe(404)
    expect(error.name).toBe("APIError")
  })

  it("should store info property", () => {
    const info = { details: "User with ID 123 not found" }
    const error = new APIError(
      "Not Found",
      "https://api.example.com/users/123",
      404,
      info,
    )

    expect(error.info).toEqual(info)
  })

  it("should format log for null info", () => {
    const error = new APIError("Error", "https://api.example.com", 500, null)

    expect(error.log).toBe("No additional info")
  })

  it("should format log for undefined info", () => {
    const error = new APIError(
      "Error",
      "https://api.example.com",
      500,
      undefined,
    )

    expect(error.log).toBe("No additional info")
  })

  it("should format log for string info", () => {
    const error = new APIError(
      "Error",
      "https://api.example.com",
      500,
      "Some error details",
    )

    expect(error.log).toBe("Some error details")
  })

  it("should format log for object info with pretty print", () => {
    const info = { error: "validation", field: "email" }
    const error = new APIError(
      "Validation Error",
      "https://api.example.com",
      400,
      info,
    )

    expect(error.log).toBe(JSON.stringify(info, null, 2))
  })

  it("should format log for other types", () => {
    const error = new APIError("Error", "https://api.example.com", 500, 12345)

    expect(error.log).toBe("12345")
  })

  it("should convert to JSON correctly", () => {
    const error = new APIError(
      "Server Error",
      "https://api.example.com/api",
      500,
      { code: "INTERNAL_ERROR" },
    )

    const json = error.toJSON()

    expect(json.name).toBe("APIError")
    expect(json.message).toBe("Server Error")
    expect(json.status).toBe(500)
    expect(json.url).toBe("https://api.example.com/api")
    expect(json.info).toEqual({ code: "INTERNAL_ERROR" })
    expect(json.stack).toBeDefined()
  })

  describe("status check methods", () => {
    it("isClientError should return true for 4xx status", () => {
      expect(new APIError("", "", 400).isClientError()).toBe(true)
      expect(new APIError("", "", 404).isClientError()).toBe(true)
      expect(new APIError("", "", 499).isClientError()).toBe(true)
      expect(new APIError("", "", 500).isClientError()).toBe(false)
      expect(new APIError("", "", 399).isClientError()).toBe(false)
    })

    it("isServerError should return true for 5xx status", () => {
      expect(new APIError("", "", 500).isServerError()).toBe(true)
      expect(new APIError("", "", 503).isServerError()).toBe(true)
      expect(new APIError("", "", 599).isServerError()).toBe(true)
      expect(new APIError("", "", 499).isServerError()).toBe(false)
    })

    it("isUnauthorized should return true for 401 status", () => {
      expect(new APIError("", "", 401).isUnauthorized()).toBe(true)
      expect(new APIError("", "", 403).isUnauthorized()).toBe(false)
      expect(new APIError("", "", 400).isUnauthorized()).toBe(false)
    })

    it("isForbidden should return true for 403 status", () => {
      expect(new APIError("", "", 403).isForbidden()).toBe(true)
      expect(new APIError("", "", 401).isForbidden()).toBe(false)
      expect(new APIError("", "", 404).isForbidden()).toBe(false)
    })

    it("isNotFound should return true for 404 status", () => {
      expect(new APIError("", "", 404).isNotFound()).toBe(true)
      expect(new APIError("", "", 400).isNotFound()).toBe(false)
      expect(new APIError("", "", 500).isNotFound()).toBe(false)
    })
  })

  it("should be instanceof Error", () => {
    const error = new APIError("Error", "https://api.example.com", 500)
    expect(error instanceof Error).toBe(true)
    expect(error instanceof APIError).toBe(true)
  })
})
