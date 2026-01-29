import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/50",
        warning:
          "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-800/50",
        info: "border-transparent bg-[var(--primary)]/20 text-[var(--primary)] hover:bg-[var(--primary)]/30 dark:bg-[var(--primary)]/30 dark:text-[var(--primary)] dark:hover:bg-[var(--primary)]/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  dotClassName?: string
}

function Badge({
  className,
  variant,
  dot = false,
  dotClassName,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "mr-1.5 h-2 w-2 rounded-full",
            {
              "bg-primary-foreground": variant === "default",
              "bg-secondary-foreground": variant === "secondary",
              "bg-destructive-foreground": variant === "destructive",
              "bg-foreground": variant === "outline",
              "bg-emerald-500 dark:bg-emerald-400": variant === "success",
              "bg-amber-500 dark:bg-amber-400": variant === "warning",
              "bg-[var(--primary)]/100 dark:bg-[var(--primary)]": variant === "info",
            },
            dotClassName
          )}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
