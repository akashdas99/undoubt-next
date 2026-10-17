import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-primary bg-transparent text-primary hover:bg-primary/10 aria-expanded:bg-primary/10 dark:hover:bg-primary/15",
        secondary:
          "bg-muted text-primary hover:bg-muted/70 aria-expanded:bg-muted",
        ghost:
          "text-primary hover:bg-primary/10 aria-expanded:bg-primary/10 dark:hover:bg-primary/15",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-2xl gap-xs px-sm has-data-[icon=inline-end]:pr-sm has-data-[icon=inline-start]:pl-sm",
        xs: "h-xl gap-xxs px-sm text-xs has-data-[icon=inline-end]:pr-xs has-data-[icon=inline-start]:pl-xs [&_svg:not([class*='size-'])]:size-sm",
        sm: "h-xl gap-xxs px-sm has-data-[icon=inline-end]:pr-xs has-data-[icon=inline-start]:pl-xs",
        lg: "h-3xl gap-xs px-md has-data-[icon=inline-end]:pr-sm has-data-[icon=inline-start]:pl-sm",
        icon: "size-2xl",
        "icon-xs": "size-xl [&_svg:not([class*='size-'])]:size-sm",
        "icon-sm": "size-xl",
        "icon-lg": "size-3xl",
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
  loading = false,
  disabled,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & { loading?: boolean }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
