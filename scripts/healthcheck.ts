import { $ } from "bun"

function banner(text: string) {
  console.log(`
====================================
${text}
====================================
`)
}

async function step(name: string, cmd: () => Promise<unknown>) {
  console.log(`\n▶ ${name}`)
  await cmd()
  console.log(`√ ${name} — OK`)
}

try {
  banner("🚑 STARTING HEALTHCHECK")

  await step("Clean project", () => $`bun run clean`)

  await step("TypeScript check", () => $`bunx tsc --noEmit`)

  await step("Lint (Biome)", () => $`bun lint`)

  await step("Run tests", () => $`bun test`)

  await step("Next.js build", () => $`bun run build`)

  await step("Clean project", () => $`bun run clean`)

  banner("🎉🎉🎉 ALL CHECKS PASSED 🎉🎉🎉")
  console.log("🚀 Project is healthy & ready to go!\n")
} catch (err) {
  console.error("\n❌ HEALTHCHECK FAILED")
  console.error(err)
  process.exit(1)
}
