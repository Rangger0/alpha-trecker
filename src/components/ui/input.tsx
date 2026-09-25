import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-[color:var(--alpha-text-muted)] placeholder:text-[color:var(--alpha-text-muted)] selection:bg-[color:var(--alpha-highlight-soft)] selection:text-[color:var(--alpha-text)] dark:bg-input/30 h-10 w-full min-w-0 rounded-[0.95rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-3 py-2 text-base text-[color:var(--alpha-text)] shadow-[var(--alpha-shadow-inset)] transition-[color,box-shadow,border-color,background] outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[color:var(--alpha-highlight-border)] focus-visible:ring-[color:var(--alpha-highlight-soft)] focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
