import * as React from "react"
import { cn } from "@/lib/utils"

const skeletonVariants = {
  default: "bg-gray-200 dark:bg-gray-700",
  tournament: "bg-[#8c110d]/20",
  card: "bg-gray-100 dark:bg-gray-800",
  text: "bg-gray-200 dark:bg-gray-700",
  avatar: "bg-gray-300 dark:bg-gray-600",
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof skeletonVariants
  animated?: boolean
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "default", animated = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-md",
          skeletonVariants[variant],
          animated && "animate-pulse",
          className
        )}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

interface SkeletonCardProps {
  className?: string
  showAvatar?: boolean
  showTitle?: boolean
  showDescription?: boolean
  showFooter?: boolean
  lines?: number
}

const SkeletonCard = ({
  className,
  showAvatar = true,
  showTitle = true,
  showDescription = true,
  showFooter = false,
  lines = 3,
}: SkeletonCardProps) => {
  return (
    <div className={cn("rounded-lg border p-6 space-y-4", className)}>
      {showAvatar && (
        <div className="flex items-center space-x-4">
          <Skeleton variant="avatar" className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            {showTitle && <Skeleton className="h-4 w-[250px]" />}
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )}
      
      {showDescription && (
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn(
                "h-4 w-full",
                i === lines - 1 && "w-[4/5]"
              )}
            />
          ))}
        </div>
      )}
      
      {showFooter && (
        <div className="flex justify-between pt-4">
          <Skeleton className="h-8 w-[100px]" />
          <Skeleton className="h-8 w-[80px]" />
        </div>
      )}
    </div>
  )
}

interface SkeletonTableProps {
  rows?: number
  columns?: number
  className?: string
}

const SkeletonTable = ({ rows = 5, columns = 4, className }: SkeletonTableProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Table header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-8 w-full" variant="tournament" />
        ))}
      </div>
      
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-6 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonTable }