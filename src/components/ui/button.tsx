import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 disabled:scale-100 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--alpha-highlight-border)] hover:shadow-[var(--alpha-shadow)] active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-[var(--alpha-accent)] text-[var(--alpha-accent-contrast)] hover:bg-[var(--alpha-accent-hover)]",
        destructive: "bg-[var(--alpha-danger)] text-[var(--alpha-accent-contrast)] hover:bg-[var(--alpha-danger-press)]",
        outline: "border border-[color:var(--alpha-border)] bg-[var(--alpha-panel)] text-[var(--alpha-text)] hover:border-[var(--alpha-border-hover)]",
        secondary: "bg-[var(--alpha-surface)] text-[var(--alpha-text)] border border-[color:var(--alpha-border)] hover:bg-[color-mix(in srgb,var(--alpha-hover-soft)_60%,var(--alpha-surface))]",
        ghost: "bg-transparent text-[var(--alpha-text)] hover:bg-[color-mix(in srgb,var(--alpha-hover-soft)_70%,transparent)] hover:text-[var(--alpha-accent)]",
        link: "text-[var(--alpha-accent)] underline-offset-4 hover:underline hover:text-[var(--alpha-accent-hover)]",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-[10px] gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-[10px] px-6 has-[>svg]:px-5 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
