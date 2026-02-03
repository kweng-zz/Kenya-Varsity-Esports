import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/enhanced-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ResponsiveTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  className?: string
  mobileVariant?: "stacked" | "horizontal-scroll" | "accordion"
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (item: T, index: number) => void
  getKey?: (item: T, index: number) => string
}

interface TableColumn<T> {
  key: keyof T | string
  header: string
  render?: (value: any, item: T, index: number) => React.ReactNode
  className?: string
  hideOnMobile?: boolean
  priority?: "high" | "medium" | "low"
}

interface ResponsiveFormProps {
  children: React.ReactNode
  className?: string
  variant?: "stacked" | "inline" | "stepped"
  currentStep?: number
  totalSteps?: number
  onStepChange?: (step: number) => void
}

const ResponsiveTable = <T extends Record<string, any>>({
  data,
  columns,
  className,
  mobileVariant = "stacked",
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  getKey = (_, index) => index.toString()
}: ResponsiveTableProps<T>) => {
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())

  const toggleRowExpansion = (key: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  const MobileStackedView = () => (
    <div className="space-y-4">
      {data.map((item, index) => {
        const key = getKey(item, index)
        const isExpanded = expandedRows.has(key)
        const visibleColumns = columns.filter(col => !col.hideOnMobile || col.priority === "high")
        
        return (
          <Card
            key={key}
            variant="glass"
            interactive={onRowClick ? "click" : "none"}
            className="overflow-hidden"
            onClick={() => onRowClick?.(item, index)}
          >
            <CardContent className="p-4">
              {/* Primary Info - Always Visible */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {columns.slice(0, 2).map((col, colIndex) => {
                    const value = item[col.key as keyof T]
                    return (
                      <div key={colIndex} className="flex-1">
                        <div className="text-xs text-gray-400 mb-1">{col.header}</div>
                        <div className="text-white font-medium">
                          {col.render ? col.render(value, item, index) : value}
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {columns.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleRowExpansion(key)
                    }}
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                  </Button>
                )}
              </div>

              {/* Expandable Details */}
              {isExpanded && columns.length > 2 && (
                <div className="space-y-3 pt-3 border-t border-gray-700">
                  {columns.slice(2).map((col, colIndex) => {
                    const value = item[col.key as keyof T]
                    return (
                      <div key={colIndex} className="flex justify-between items-center">
                        <div className="text-sm text-gray-400">{col.header}</div>
                        <div className="text-sm text-white text-right">
                          {col.render ? col.render(value, item, index) : value}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  const MobileHorizontalScrollView = () => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-700">
            {columns.map((col, index) => (
              <th
                key={index}
                className={cn(
                  "px-4 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const key = getKey(item, index)
            return (
              <tr
                key={key}
                className={cn(
                  "border-b border-gray-800 hover:bg-gray-800/50 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(item, index)}
              >
                {columns.map((col, colIndex) => {
                  const value = item[col.key as keyof T]
                  return (
                    <td
                      key={colIndex}
                      className={cn(
                        "px-4 py-3 text-sm text-white whitespace-nowrap",
                        col.className
                      )}
                    >
                      {col.render ? col.render(value, item, index) : value}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  const DesktopView = () => (
    <div className="hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={cn(
                    "px-4 py-3 text-left text-sm font-medium text-gray-400",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const key = getKey(item, index)
              return (
                <tr
                  key={key}
                  className={cn(
                    "border-b border-gray-800 hover:bg-gray-800/50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(item, index)}
                >
                  {columns.map((col, colIndex) => {
                    const value = item[col.key as keyof T]
                    return (
                      <td
                        key={colIndex}
                        className={cn(
                          "px-4 py-3 text-sm text-white",
                          col.className
                        )}
                      >
                        {col.render ? col.render(value, item, index) : value}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} variant="glass">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <Card variant="glass">
        <CardContent className="p-8 text-center">
          <div className="text-gray-400">{emptyMessage}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Mobile View */}
      <div className="md:hidden">
        {mobileVariant === "stacked" && <MobileStackedView />}
        {mobileVariant === "horizontal-scroll" && <MobileHorizontalScrollView />}
      </div>
      
      {/* Desktop View */}
      <DesktopView />
    </div>
  )
}

const ResponsiveForm: React.FC<ResponsiveFormProps> = ({
  children,
  className,
  variant = "stacked",
  currentStep = 1,
  totalSteps = 1,
  onStepChange
}) => {
  const childrenArray = React.Children.toArray(children)
  
  const StackedForm = () => (
    <div className="space-y-6">
      {childrenArray.map((child, index) => {
        if (!React.isValidElement(child)) return null
        
        const childProps = child.props as any
        return (
          <div key={index} className="space-y-2">
            {childProps.label && (
              <label className="text-sm font-medium text-gray-300">
                {childProps.label}
                {childProps.required && <span className="text-red-400 ml-1">*</span>}
              </label>
            )}
            {React.cloneElement(child as React.ReactElement<any>, {
              className: cn(
                "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8c110d] focus:border-transparent",
                childProps?.className
              )
            })}
          </div>
        )
      })}
    </div>
  )

  const InlineForm = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {childrenArray.map((child, index) => {
        if (!React.isValidElement(child)) return null
        
        const childProps = child.props as any
        return (
          <div key={index} className="space-y-2">
            {childProps.label && (
              <label className="text-sm font-medium text-gray-300">
                {childProps.label}
                {childProps.required && <span className="text-red-400 ml-1">*</span>}
              </label>
            )}
            {React.cloneElement(child as React.ReactElement<any>, {
              className: cn(
                "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8c110d] focus:border-transparent",
                childProps?.className
              )
            })}
          </div>
        )
      })}
    </div>
  )

  const SteppedForm = () => {
    const currentStepChildren = childrenArray.slice(currentStep - 1, currentStep)
    
    return (
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    index + 1 < currentStep
                      ? "bg-[#8c110d] text-white"
                      : index + 1 === currentStep
                      ? "bg-[#8c110d] text-white ring-2 ring-[#8c110d]/50"
                      : "bg-gray-700 text-gray-400"
                  )}
                >
                  {index + 1 < currentStep ? "✓" : index + 1}
                </div>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-2",
                    index + 1 < currentStep ? "bg-[#8c110d]" : "bg-gray-700"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Current Step Content */}
        <StackedForm />

        {/* Step Navigation */}
        <div className="flex justify-between pt-6 border-t border-gray-700">
          <Button
            variant="outline"
            onClick={() => onStepChange?.(currentStep - 1)}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => onStepChange?.(currentStep + 1)}
            disabled={currentStep === totalSteps}
          >
            {currentStep === totalSteps ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      {variant === "stacked" && <StackedForm />}
      {variant === "inline" && <InlineForm />}
      {variant === "stepped" && <SteppedForm />}
    </div>
  )
}

export { ResponsiveTable, ResponsiveForm, type TableColumn }