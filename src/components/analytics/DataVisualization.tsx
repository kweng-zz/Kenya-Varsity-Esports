import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/enhanced-card"

interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

interface BarChartProps {
  data: ChartDataPoint[]
  title?: string
  height?: number
  showGrid?: boolean
  showLabels?: boolean
  showValues?: boolean
  maxValue?: number
  className?: string
  variant?: "vertical" | "horizontal"
  animated?: boolean
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 200,
  showGrid = true,
  showLabels = true,
  showValues = true,
  maxValue,
  className,
  variant = "vertical",
  animated = true
}) => {
  const chartMax = maxValue || Math.max(...data.map(d => d.value))
  const [animatedData, setAnimatedData] = React.useState(data.map(d => ({ ...d, animatedValue: 0 })))

  React.useEffect(() => {
    if (!animated) {
      setAnimatedData(data.map(d => ({ ...d, animatedValue: d.value })))
      return
    }

    const timer = setTimeout(() => {
      setAnimatedData(data.map(d => ({ ...d, animatedValue: d.value })))
    }, 100)

    return () => clearTimeout(timer)
  }, [data, animated])

  const VerticalBars = () => (
    <div className="relative h-full">
      {showGrid && (
        <div className="absolute inset-0 flex flex-col justify-between">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-full border-t border-gray-700"
              style={{ opacity: 0.3 }}
            />
          ))}
        </div>
      )}
      
      <div className="relative h-full flex items-end justify-around gap-2 px-2">
        {animatedData.map((point, index) => {
          const heightPercentage = (point.animatedValue / chartMax) * 100
          const barColor = point.color || "#8c110d"
          
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center"
              style={{ maxWidth: "60px" }}
            >
              {showValues && (
                <div className="text-xs text-gray-400 mb-1 font-medium">
                  {point.value.toLocaleString()}
                </div>
              )}
              
              <div
                className={cn(
                  "w-full rounded-t transition-all duration-700 ease-out",
                  animated && "delay-100"
                )}
                style={{
                  height: `${heightPercentage}%`,
                  backgroundColor: barColor,
                  minHeight: point.animatedValue > 0 ? "4px" : "0"
                }}
              />
              
              {showLabels && (
                <div className="text-xs text-gray-400 mt-2 text-center truncate w-full">
                  {point.label}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  const HorizontalBars = () => (
    <div className="space-y-3">
      {animatedData.map((point, index) => {
        const widthPercentage = (point.animatedValue / chartMax) * 100
        const barColor = point.color || "#8c110d"
        
        return (
          <div key={index} className="flex items-center gap-3">
            {showLabels && (
              <div className="text-xs text-gray-400 min-w-[80px] text-right">
                {point.label}
              </div>
            )}
            
            <div className="flex-1 relative">
              {showGrid && (
                <div className="absolute inset-0 flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-full border-l border-gray-700"
                      style={{ 
                        opacity: 0.3,
                        left: `${(i / 4) * 100}%`
                      }}
                    />
                  ))}
                </div>
              )}
              
              <div className="relative h-6">
                <div
                  className={cn(
                    "h-full rounded-r transition-all duration-700 ease-out",
                    animated && "delay-100"
                  )}
                  style={{
                    width: `${widthPercentage}%`,
                    backgroundColor: barColor,
                    minWidth: point.animatedValue > 0 ? "4px" : "0"
                  }}
                />
              </div>
            </div>
            
            {showValues && (
              <div className="text-xs text-gray-400 min-w-[40px] text-right font-medium">
                {point.value.toLocaleString()}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  const chart = variant === "vertical" ? <VerticalBars /> : <HorizontalBars />

  if (title) {
    return (
      <Card variant="glass" className={className}>
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: `${height}px` }}>
            {chart}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("w-full", className)} style={{ height: `${height}px` }}>
      {chart}
    </div>
  )
}

interface LineChartProps {
  data: ChartDataPoint[]
  title?: string
  height?: number
  showGrid?: boolean
  showDots?: boolean
  showArea?: boolean
  strokeColor?: string
  areaColor?: string
  className?: string
  smooth?: boolean
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 200,
  showGrid = true,
  showDots = true,
  showArea = false,
  strokeColor = "#8c110d",
  areaColor = "#8c110d20",
  className,
  smooth = true
}) => {
  const maxValue = Math.max(...data.map(d => d.value))
  const [animatedProgress, setAnimatedProgress] = React.useState(0)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(1)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const createPath = (progress: number) => {
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - (point.value / maxValue) * 100 * progress
      return `${x},${y}`
    })

    if (smooth) {
      // Create smooth curve using cubic bezier
      let path = `M ${points[0]}`
      for (let i = 1; i < points.length; i++) {
        const [x1, y1] = points[i - 1].split(',').map(Number)
        const [x2, y2] = points[i].split(',').map(Number)
        const cp1x = x1 + (x2 - x1) / 3
        const cp1y = y1
        const cp2x = x1 + (2 * (x2 - x1)) / 3
        const cp2y = y2
        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`
      }
      return path
    } else {
      return `M ${points.join(' L ')}`
    }
  }

  const createAreaPath = (progress: number) => {
    const linePath = createPath(progress)
    return `${linePath} L 100,100 L 0,100 Z`
  }

  return (
    <Card variant="glass" className={className}>
      {title && (
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="relative" style={{ height: `${height}px` }}>
          {showGrid && (
            <svg className="absolute inset-0 w-full h-full">
              {/* Horizontal grid lines */}
              {Array.from({ length: 5 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={`${(i / 4) * 100}%`}
                  x2="100%"
                  y2={`${(i / 4) * 100}%`}
                  stroke="#374151"
                  strokeWidth="1"
                  opacity="0.3"
                />
              ))}
              {/* Vertical grid lines */}
              {Array.from({ length: data.length }).map((_, i) => (
                <line
                  key={i}
                  x1={`${(i / (data.length - 1)) * 100}%`}
                  y1="0"
                  x2={`${(i / (data.length - 1)) * 100}%`}
                  y2="100%"
                  stroke="#374151"
                  strokeWidth="1"
                  opacity="0.3"
                />
              ))}
            </svg>
          )}

          <svg className="absolute inset-0 w-full h-full">
            {showArea && (
              <path
                d={createAreaPath(animatedProgress)}
                fill={areaColor}
                className="transition-all duration-1000 ease-out"
              />
            )}
            
            <path
              d={createPath(animatedProgress)}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              className="transition-all duration-1000 ease-out"
            />
            
            {showDots && data.map((point, index) => {
              const cx = (index / (data.length - 1)) * 100
              const cy = 100 - (point.value / maxValue) * 100 * animatedProgress
              
              return (
                <circle
                  key={index}
                  cx={`${cx}%`}
                  cy={`${cy}%`}
                  r="4"
                  fill={strokeColor}
                  className="transition-all duration-1000 ease-out"
                />
              )
            })}
          </svg>

          {/* Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
            {data.map((point, index) => (
              <div
                key={index}
                className="text-xs text-gray-400 text-center"
                style={{
                  left: `${(index / (data.length - 1)) * 100}%`,
                  transform: 'translateX(-50%)',
                  position: 'absolute'
                }}
              >
                {point.label}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PieChartProps {
  data: ChartDataPoint[]
  title?: string
  size?: number
  showLabels?: boolean
  showPercentages?: boolean
  className?: string
  donut?: boolean
  innerRadius?: number
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  size = 200,
  showLabels = true,
  showPercentages = true,
  className,
  donut = false,
  innerRadius = 60
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const [animatedData, setAnimatedData] = React.useState(data.map(d => ({ ...d, percentage: 0 })))

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData(data.map(d => ({ ...d, percentage: (d.value / total) * 100 })))
    }, 100)

    return () => clearTimeout(timer)
  }, [data, total])

  const createPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(0, 0, radius, endAngle)
    const end = polarToCartesian(0, 0, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

    return [
      "M", 0, 0,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ")
  }

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  let currentAngle = 0
  const radius = size / 2
  const donutRadius = donut ? innerRadius : 0

  return (
    <Card variant="glass" className={className}>
      {title && (
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative" style={{ width: size, height: size }}>
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90"
              style={{ width: size, height: size }}
            >
              {animatedData.map((point, index) => {
                const startAngle = currentAngle
                const endAngle = currentAngle + (point.percentage * 360) / 100
                currentAngle = endAngle

                return (
                  <g key={index}>
                    {/* Outer path */}
                    <path
                      d={createPath(startAngle, endAngle, radius)}
                      fill={point.color || "#8c110d"}
                      className="transition-all duration-700 ease-out hover:opacity-80 cursor-pointer"
                    />
                    
                    {/* Inner path for donut */}
                    {donut && (
                      <path
                        d={createPath(startAngle, endAngle, donutRadius)}
                        fill="black"
                        className="transition-all duration-700 ease-out"
                      />
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Center text for donut */}
            {donut && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{total.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Total</div>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          {showLabels && (
            <div className="ml-6 space-y-2">
              {animatedData.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: point.color || "#8c110d" }}
                  />
                  <span className="text-sm text-gray-300">{point.label}</span>
                  {showPercentages && (
                    <span className="text-sm text-gray-400">
                      ({point.percentage.toFixed(1)}%)
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface StatCardProps {
  title: string
  value: number | string
  change?: {
    value: number
    type: "increase" | "decrease" | "neutral"
  }
  icon?: React.ReactNode
  color?: "primary" | "success" | "warning" | "error"
  className?: string
  animated?: boolean
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color = "primary",
  className,
  animated = true
}) => {
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    if (!animated || typeof value !== "number") {
      setDisplayValue(typeof value === "number" ? value : 0)
      return
    }

    const timer = setTimeout(() => {
      const duration = 1000
      const steps = 60
      const stepDuration = duration / steps
      const increment = value / steps
      let current = 0

      const counter = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(counter)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, stepDuration)

      return () => clearInterval(counter)
    }, 100)

    return () => clearTimeout(timer)
  }, [value, animated])

  const colorClasses = {
    primary: "text-[#8c110d]",
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600"
  }

  const changeIcon = change?.type === "increase" ? "↑" : change?.type === "decrease" ? "↓" : "→"
  const changeColor = change?.type === "increase" ? "text-green-600" : change?.type === "decrease" ? "text-red-600" : "text-gray-600"

  return (
    <Card variant="glass" className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className={cn("text-2xl font-bold text-white", colorClasses[color])}>
              {typeof value === "number" ? displayValue.toLocaleString() : value}
            </p>
            {change && (
              <div className={cn("flex items-center gap-1 text-sm", changeColor)}>
                <span>{changeIcon}</span>
                <span>{Math.abs(change.value).toLocaleString()}%</span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={cn("p-3 rounded-lg", colorClasses[color], "opacity-20")}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export {
  BarChart,
  LineChart,
  PieChart,
  StatCard,
  type ChartDataPoint
}