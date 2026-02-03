import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-600/50 text-green-800 dark:border-green-400 dark:text-green-200 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
        warning:
          "border-yellow-600/50 text-yellow-800 dark:border-yellow-400 dark:text-yellow-200 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400",
        info:
          "border-blue-600/50 text-blue-800 dark:border-blue-400 dark:text-blue-200 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
        tournament:
          "border-[#8c110d]/50 text-[#8c110d] dark:border-[#8c110d] dark:text-[#8c110d] [&>svg]:text-[#8c110d]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "tournament"
  title?: string
  description?: string
  onClose?: () => void
  showClose?: boolean
  duration?: number
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", title, description, onClose, showClose = true, duration, ...props }, ref) => {
    React.useEffect(() => {
      if (duration && onClose) {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
      }
    }, [duration, onClose])

    const iconMap = {
      default: <Info className="h-4 w-4" />,
      success: <CheckCircle className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
      error: <XCircle className="h-4 w-4" />,
      tournament: <Trophy className="h-4 w-4" />,
    }

    const colorMap = {
      default: alertVariants({ variant: "default" }),
      success: alertVariants({ variant: "success" }),
      warning: alertVariants({ variant: "warning" }),
      error: alertVariants({ variant: "destructive" }),
      tournament: alertVariants({ variant: "tournament" }),
    }

    return (
      <div
        ref={ref}
        className={cn(
          "animate-in slide-in-from-right-5 duration-300",
          colorMap[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          {iconMap[variant]}
          <div className="flex-1">
            {title && <AlertTitle>{title}</AlertTitle>}
            {description && <AlertDescription>{description}</AlertDescription>}
          </div>
          {showClose && onClose && (
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
        </div>
      </div>
    )
  }
)
Toast.displayName = "Toast"

// Icon components
const Info = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const AlertTriangle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

const X = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const Trophy = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5h6.5M18 9h1.5a2.5 2.5 0 0 0 0-5H13" />
    <path d="M12 14v8" />
    <path d="M8 14a4 4 0 1 0 8 0" />
    <path d="M8 9h8" />
  </svg>
)

export { Alert, AlertTitle, AlertDescription, Toast }