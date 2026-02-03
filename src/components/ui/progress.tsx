import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      variant: {
        default: "",
        success: "",
        warning: "",
        error: "",
        tournament: "",
      },
      size: {
        sm: "h-2",
        default: "h-4",
        lg: "h-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number
  max?: number
  showValue?: boolean
  animated?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant, size, showValue = false, animated = true, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    const progressColorVariants = {
      default: "bg-primary",
      success: "bg-green-600",
      warning: "bg-yellow-600",
      error: "bg-red-600",
      tournament: "bg-[#8c110d]",
    }

    return (
      <div
        ref={ref}
        className={cn("space-y-2", className)}
        {...props}
      >
        {showValue && (
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{value}/{max}</span>
          </div>
        )}
        <div className={cn(progressVariants({ variant, size }))}>
          <div
            className={cn(
              "h-full transition-all duration-300 ease-in-out",
              progressColorVariants[variant as keyof typeof progressColorVariants] || progressColorVariants.default,
              animated && "animate-pulse"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
Progress.displayName = "Progress"

interface CircularProgressProps {
  value?: number
  max?: number
  size?: number
  strokeWidth?: number
  showValue?: boolean
  variant?: "default" | "success" | "warning" | "error" | "tournament"
  className?: string
}

const CircularProgress = ({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  showValue = true,
  variant = "default",
  className,
}: CircularProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const colorVariants = {
    default: "stroke-primary",
    success: "stroke-green-600",
    warning: "stroke-yellow-600",
    error: "stroke-red-600",
    tournament: "stroke-[#8c110d]",
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            "transition-all duration-300 ease-in-out",
            colorVariants[variant]
          )}
          strokeLinecap="round"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  )
}

export { Progress, CircularProgress }