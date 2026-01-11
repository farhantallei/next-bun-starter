import type * as React from "react"

import { cn } from "@/lib/utils"

type InputDisplayProps = React.ComponentProps<"span"> & {
  size?: "sm" | "default" | "lg"
}

function InputDisplay({
  className,
  size = "default",
  children,
  ...props
}: InputDisplayProps) {
  return (
    <span
      className={cn(
        "relative inline-flex w-full rounded-lg border border-input bg-muted not-dark:bg-clip-padding text-base shadow-xs/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/6%)] sm:text-sm dark:bg-input/32 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        className,
      )}
      data-size={size}
      data-slot="input-display"
      {...props}
    >
      <span
        className={cn(
          "h-8.5 w-full min-w-0 rounded-[inherit] px-[calc(--spacing(3)-1px)] text-muted-foreground leading-8.5 sm:h-7.5 sm:leading-7.5",
          size === "sm" &&
            "h-7.5 px-[calc(--spacing(2.5)-1px)] leading-7.5 sm:h-6.5 sm:leading-6.5",
          size === "lg" && "h-9.5 leading-9.5 sm:h-8.5 sm:leading-8.5",
        )}
        data-slot="input-display-content"
      >
        {children}
      </span>
    </span>
  )
}

export { InputDisplay, type InputDisplayProps }
