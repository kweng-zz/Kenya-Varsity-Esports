import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
        tournament: "border-[#8c110d] bg-gray-900 dark:border-[#8c110d]",
        glass: "border-white/10 bg-black/40 backdrop-blur-sm",
        elevated: "border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900",
        success: "border-green-600/20 bg-green-50 dark:border-green-400/20 dark:bg-green-950",
        warning: "border-yellow-600/20 bg-yellow-50 dark:border-yellow-400/20 dark:bg-yellow-950",
        error: "border-red-600/20 bg-red-50 dark:border-red-400/20 dark:bg-red-950",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "p-6",
        lg: "p-8",
      },
      interactive: {
        none: "",
        hover: "hover:shadow-md transition-shadow duration-200",
        click: "cursor-pointer hover:shadow-md active:scale-[0.98] transition-all duration-200",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      interactive: "none",
    },
  }
)

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof cardVariants>
>(({ className, variant, padding, interactive, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, padding, interactive }), className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }