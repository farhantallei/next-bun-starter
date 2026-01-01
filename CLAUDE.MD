# CLAUDE.MD - AI Development Guide

This document provides context for AI assistants (like Claude) working on this codebase.

## Project Overview

This is a modern **Next.js 16.1.0** boilerplate powered by **Bun** runtime, designed for speed, maintainability, and developer experience. The project uses cutting-edge technologies including React 19, TypeScript, and Tailwind CSS v4.

## Tech Stack

### Core Technologies
- **Runtime**: Bun 1.3.5
- **Framework**: Next.js 16.1.0 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4

### UI Components
- **shadcn/ui**: Primary component library
- **Base UI**: Accessible UI primitives
- **coss ui**: Additional component system
- **Icons**: Hugeicons library

### Developer Tools
- **Linting/Formatting**: Biome 2.2.0
- **Testing**: Bun Test + Testing Library + Happy DOM
- **Logging**: Winston (structured logging)

## Project Structure

```
.
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── health/               # Health check endpoint
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   └── *.tsx                     # Custom components
├── lib/                          # Utility libraries
│   ├── logger.ts                 # Winston logger configuration
│   └── utils.ts                  # Helper functions
├── scripts/                      # Utility scripts
│   └── healthcheck.ts            # Health check script
├── test/                         # Test configuration
│   └── setup.ts                  # Test setup
├── types/                        # TypeScript type definitions
├── data/                         # Data layer
│   └── env/                      # Environment validation
└── public/                       # Static assets
```

## Key Conventions

### File Naming
- **Components**: PascalCase for files (e.g., `Button.tsx`, `AlertDialog.tsx`)
- **Utilities**: kebab-case for files (e.g., `server-stats.ts`, `logger.ts`)
- **Tests**: `*.test.ts` or `*.test.tsx`

### Code Style
- Use **Biome** for all linting and formatting
- Follow TypeScript strict mode
- Prefer named exports over default exports for utilities
- Use `cn()` utility from `lib/utils.ts` for className merging

### Component Patterns
- UI components are in `components/ui/`
- Use **class-variance-authority** (cva) for component variants
- Leverage Base UI for accessible primitives
- Follow shadcn/ui patterns for consistency

## Important Files & Their Purpose

### Configuration
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration (v4)
- `biome.json` - Biome linting/formatting rules
- `tsconfig.json` - TypeScript configuration
- `bunfig.toml` - Bun configuration

### Core Utilities
- `lib/logger.ts` - Winston logger with request ID support
- `lib/utils.ts` - Utility functions including `cn()` for className merging
- `data/env/server.ts` - Environment variable validation with @t3-oss/env-nextjs

### Testing
- `test/setup.ts` - Global test setup with Happy DOM
- Run tests with: `bun test`

### Health Check
- `app/api/health/route.ts` - Health check API endpoint
- `scripts/healthcheck.ts` - CLI health check script
- Provides: Bun version, uptime, CPU, memory, platform info

## Development Commands

```bash
# Development
bun dev                    # Start dev server (localhost:3000)
bun build                  # Build for production
bun start                  # Start production server

# Testing
bun test                   # Run all tests

# Code Quality
bun lint                   # Run Biome linting
bun format                 # Format code (safe)
bun format:unsafe          # Format code (unsafe, auto-fix)

# Health Check
bun healthcheck            # Run health check script

# Cleanup
bun clean                  # Remove build artifacts
bun clean:node_modules     # Remove build artifacts and dependencies
```

## Environment Variables

This project uses **@t3-oss/env-nextjs** for type-safe environment validation.

### Available Variables
- `LOG_LEVEL` - Winston log level (debug, info, warn, error)
- `NODE_ENV` - Environment (development, production, test)

### Usage
```typescript
import { env } from "@/data/env/server";
```

## Logging Guidelines

Use the Winston logger from `lib/logger.ts`:

```typescript
import { logger } from "@/lib/logger";

// Basic logging
logger.info("Operation completed");
logger.warn("High memory usage detected");
logger.error("Failed operation", { error: err });

// With request ID (in API routes)
logger.info("API request", { requestId: "req_12345" });
```

**Log Levels**:
- `debug` - Detailed debugging information
- `info` - General informational messages
- `warn` - Warning messages
- `error` - Error messages

## Testing Guidelines

### Testing Stack
- **Test Runner**: Bun Test (built-in)
- **DOM Testing**: Happy DOM
- **Component Testing**: @testing-library/react
- **Matchers**: @testing-library/jest-dom

### Writing Tests
```typescript
import { describe, it, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Test Location
- Place tests next to the file being tested (e.g., `utils.test.ts` next to `utils.ts`)
- Or in a `__tests__` directory

## UI Component Guidelines

### Adding shadcn/ui Components
```bash
# Use the shadcn CLI
bunx shadcn@latest add [component-name]
```

### Component Structure
```typescript
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const variants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        destructive: "destructive-classes",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface Props extends VariantProps<typeof variants> {
  // component props
}

export function Component({ variant, className, ...props }: Props) {
  return (
    <div className={cn(variants({ variant }), className)} {...props} />
  );
}
```

## API Route Guidelines

### Route Structure
```typescript
// app/api/[route]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    logger.info("API request received");

    // Your logic here

    return NextResponse.json({ data });
  } catch (error) {
    logger.error("API error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## Common Tasks

### Adding a New Component
1. Create file in `components/` or `components/ui/`
2. Use TypeScript for props
3. Use `cn()` for className merging
4. Export as named export
5. Add tests if necessary

### Adding a New API Route
1. Create `route.ts` in `app/api/[name]/`
2. Export HTTP method handlers (GET, POST, etc.)
3. Use logger for structured logging
4. Handle errors gracefully
5. Return NextResponse

### Adding Environment Variables
1. Add to `.env` or `.env.local`
2. Update `data/env/server.ts` validation schema
3. Use `env.VARIABLE_NAME` in code

## Performance Considerations

- **Bun Runtime**: Take advantage of Bun's speed for scripts and build tasks
- **React 19**: Use new features like Actions and optimistic updates
- **Tailwind CSS v4**: Leverages new performance improvements
- **Code Splitting**: Next.js handles automatically

## Security Notes

- Trusted dependencies: `sharp`, `unrs-resolver`
- Install scripts are ignored for these packages
- Environment variables are validated with Zod
- Use structured logging (avoid logging sensitive data)

## Troubleshooting

### Build Issues
1. Clean artifacts: `bun clean`
2. Reinstall dependencies: `bun clean:node_modules && bun install`
3. Check TypeScript errors: `bun --bun tsc --noEmit`

### Testing Issues
- Ensure Happy DOM is properly configured in `test/setup.ts`
- Check test matchers are imported: `@testing-library/jest-dom`

### Runtime Issues
- Check Bun version: Should be 1.3.5
- Use `bun --bun` flag for Next.js commands to ensure Bun runtime

## AI Assistant Guidelines

When working on this codebase:

1. **Always use Bun** - Prefer `bun` over `npm` or `yarn`
2. **Follow existing patterns** - Check similar files before creating new ones
3. **Use the logger** - Don't use `console.log`, use Winston logger
4. **Test your changes** - Run `bun test` before committing
5. **Format code** - Run `bun format` or `bun format:unsafe`
6. **Respect the UI system** - Use shadcn/ui, Base UI, or coss ui components
7. **Type everything** - Use TypeScript, avoid `any`
8. **Use App Router** - This is Next.js 13+ App Router, not Pages Router

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Bun Documentation](https://bun.sh/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Biome Documentation](https://biomejs.dev)

## Version Information

- Last Updated: 2026-01-01
- Next.js: 16.1.0
- React: 19.2.3
- Bun: 1.3.5
- TypeScript: 5.x
- Tailwind CSS: v4
