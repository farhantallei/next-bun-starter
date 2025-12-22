import { GlobalRegistrator } from "@happy-dom/global-registrator"

// 1. Force register DOM environment sebelum import library lain
GlobalRegistrator.register()

import { afterEach, expect } from "bun:test"
import * as matchers from "@testing-library/jest-dom/matchers"

// 2. Extend matchers
expect.extend(matchers)

// 3. Cleanup
afterEach(() => {
  // cleanup()
  document.body.innerHTML = ""
})
