# Next Bun Starter – Next.js Boilerplate

![Bun](https://img.shields.io/badge/Bun-1.3.5-black)
![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)
![License](https://img.shields.io/badge/license-private-red)

A modern **Next.js boilerplate** powered by **Bun** as the runtime. This project is designed for speed, maintainability, and a great developer experience, with UI, testing, linting, and health checks preconfigured.

---

## ✨ Features

- ⚡ **Bun Runtime** (v1.3.5)
- 🚀 **Next.js 16.1.0**
- ⚛ **React 19**
- 🎨 **Tailwind CSS v4**
- 🧩 **shadcn/ui**
- 🧱 **Base UI** (accessible UI primitives)
- 🖼 **Hugeicons** icon library
- 🧪 **Testing setup** with Bun Test + Testing Library + Happy DOM
- 🩺 **Health check script**
- 🧹 **Biome** for linting and formatting
- 🛠 Fully **TypeScript** ready

---

## 🧰 Tech Stack

| Category | Technology |
|--------|------------|
| Runtime | Bun `1.3.5` |
| Framework | Next.js `16.1.0` |
| UI Components | shadcn/ui, Base UI, coss ui |
| Icons | Hugeicons |
| Styling | Tailwind CSS v4 |
| Testing | Bun Test, Testing Library, Happy DOM |
| Lint & Format | Biome |
| Language | TypeScript |


---

## 🚀 Getting Started

### Install dependencies

```bash
bun install
```

### Start development server

```bash
bun dev
```

The application will be available at:

```
http://localhost:3000
```

---

## 🏗 Build & Production

### Build the application

```bash
bun build
```

### Start the production server

```bash
bun start
```

---

## 🧪 Testing

This project uses Bun Test as the test runner, with Testing Library and Happy DOM for DOM-based testing.

Run tests with:

```bash
bun test
```

---

## 🩺 Health Check

A health check endpoint and script are included to verify application readiness and server stats.

**Run the script via Bun CLI**:

```bash
bun healthcheck
```

Or access the API endpoint in the browser or via HTTP request:

```bash
GET /api/healthcheck
```

**Provides**:
- Bun version & revision
- Uptime (formatted)
- CPU usage & cores
- Total system memory
- Platform, architecture, and process ID

Useful for CI/CD pipelines, container health probes, or uptime monitoring.

---

## 🧹 Linting & Formatting

### Lint code

```bash
bun lint
```

### Format code (safe)

```bash
bun format
```

### Format code (unsafe)

```bash
bun format:unsafe
```

---

## 🧼 Cleanup

Remove build artifacts:

```bash
bun clean
```

Remove build artifacts and dependencies:

```bash
bun clean:node_modules
```

---

## 📁 Project Structure (High-level)

```
.
├── app/                # Next.js App Router
├── components/         # Shared UI components
├── lib/                # Utility functions
├── public/             # Static assets
├── scripts/            # Utility scripts (healthcheck)
├── test/               # Test setup
└── types/              # TypeScript type definitions
```

---

## 🔐 Notes

- Some native dependencies are marked as trusted dependencies
- Certain install scripts are ignored to ensure faster and safer installs with Bun

---

## 📄 License

This project is private and not licensed for public distribution.
