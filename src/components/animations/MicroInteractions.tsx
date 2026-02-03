"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
  scale?: boolean
  tilt?: boolean
  glow?: boolean
  className?: string
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, hover = true, scale = true, tilt = false, glow = false, className, ...props }, ref) => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
    const cardRef = React.useRef<HTMLDivElement>(null)

    const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!tilt || !cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      setMousePosition({ x, y })
    }, [tilt])

    const handleMouseLeave = React.useCallback(() => {
      if (!tilt) return
      setMousePosition({ x: 0.5, y: 0.5 })
    }, [tilt])

    const tiltStyle = tilt ? {
      transform: `
        perspective(1000px)
        rotateX(${(mousePosition.y - 0.5) * 10}deg)
        rotateY(${(mousePosition.x - 0.5) * 10}deg)
        ${scale ? 'scale(1.02)' : ''}
      `
    } : {}

    return (
      <div
        ref={cardRef}
        className={cn(
          "relative rounded-lg border bg-card text-card-foreground transition-all duration-300",
          hover && "hover:shadow-lg",
          scale && "hover:scale-[1.02]",
          glow && "hover:shadow-[0_0_20px_rgba(140,17,13,0.3)]",
          className
        )}
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    )
  }
)
AnimatedCard.displayName = "AnimatedCard"

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "bounce" | "pulse" | "glow" | "slide" | "ripple"
  size?: "sm" | "md" | "lg"
  className?: string
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, variant = "bounce", size = "md", className, onClick, ...props }, ref) => {
    const [isAnimating, setIsAnimating] = React.useState(false)
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (variant === "ripple") {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        const newRipple = {
          id: Date.now(),
          x,
          y
        }
        
        setRipples(prev => [...prev, newRipple])
        
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id))
        }, 600)
      }

      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 300)
      
      onClick?.(e)
    }

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    }

    const variantClasses = {
      bounce: isAnimating ? "animate-bounce" : "hover:animate-bounce",
      pulse: "animate-pulse hover:animate-ping",
      glow: "hover:shadow-[0_0_20px_rgba(140,17,13,0.5)] transition-shadow",
      slide: isAnimating ? "translate-x-1" : "hover:translate-x-1",
      ripple: "relative overflow-hidden"
    }

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-md bg-[#8c110d] text-white font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-[#8c110d] focus:ring-offset-2 focus:ring-offset-black",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {variant === "ripple" && ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute bg-white opacity-30 rounded-full animate-ping"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
          />
        ))}
        
        <span className="relative z-10">{children}</span>
      </button>
    )
  }
)
AnimatedButton.displayName = "AnimatedButton"

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  showPercentage?: boolean
  color?: string
  backgroundColor?: string
  animated?: boolean
}

const ProgressRing = React.forwardRef<SVGSVGElement, ProgressRingProps>(
  ({
    progress,
    size = 120,
    strokeWidth = 8,
    className,
    showPercentage = true,
    color = "#8c110d",
    backgroundColor = "#374151",
    animated = true
  }, ref) => {
    const normalizedRadius = (size - strokeWidth) / 2
    const circumference = normalizedRadius * 2 * Math.PI
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
      <div className={cn("relative inline-flex items-center justify-center", className)}>
        <svg
          ref={ref}
          height={size}
          width={size}
          className="transform -rotate-90"
        >
          <circle
            stroke={backgroundColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ 
              strokeDashoffset,
              transition: animated ? 'stroke-dashoffset 0.5s ease-in-out' : 'none'
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
    )
  }
)
ProgressRing.displayName = "ProgressRing"

interface FloatingLabelProps {
  children: React.ReactNode
  label: string
  htmlFor?: string
  className?: string
}

const FloatingLabel: React.FC<FloatingLabelProps> = ({ 
  children, 
  label, 
  htmlFor, 
  className 
}) => {
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(false)

  const child = React.Children.only(children) as React.ReactElement<any>
  const childProps = child.props

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0)
    childProps.onChange?.(e)
  }

  const shouldFloat = isFocused || hasValue

  return (
    <div className={cn("relative", className)}>
      {React.cloneElement(child as React.ReactElement<any>, {
        onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
          handleFocus()
          childProps.onFocus?.(e)
        },
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          handleBlur()
          childProps.onBlur?.(e)
        },
        onChange: handleChange,
        className: cn(
          "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#8c110d] focus:border-transparent",
          childProps.className
        )
      })}
      
      <label
        htmlFor={htmlFor}
        className={cn(
          "absolute left-3 transition-all duration-200 pointer-events-none text-gray-400",
          shouldFloat
            ? "top-1 text-xs -translate-y-0"
            : "top-1/2 -translate-y-1/2 text-sm"
        )}
      >
        {label}
      </label>
    </div>
  )
}

interface ConfettiProps {
  trigger: boolean
  duration?: number
  particleCount?: number
  colors?: string[]
}

const Confetti: React.FC<ConfettiProps> = ({
  trigger,
  duration = 3000,
  particleCount = 50,
  colors = ["#8c110d", "#961c18", "#f59e0b", "#10b981", "#3b82f6"]
}) => {
  const [particles, setParticles] = React.useState<Array<{
    id: number
    x: number
    y: number
    color: string
    rotation: number
    scale: number
  }>>([])

  React.useEffect(() => {
    if (!trigger) return

    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5
    }))

    setParticles(newParticles)

    const timer = setTimeout(() => {
      setParticles([])
    }, duration)

    return () => clearTimeout(timer)
  }, [trigger, particleCount, colors, duration])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            animation: `fall ${duration}ms ease-out forwards`,
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(120vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

interface ShimmerProps {
  width?: string | number
  height?: string | number
  className?: string
  borderRadius?: string
}

const Shimmer: React.FC<ShimmerProps> = ({
  width = "100%",
  height = "1rem",
  className,
  borderRadius = "0.25rem"
}) => (
  <div
    className={cn(
      "relative overflow-hidden bg-gray-800",
      className
    )}
    style={{ width, height, borderRadius }}
  >
    <div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-pulse"
      style={{
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s ease-in-out infinite"
      }}
    />
    
    <style jsx>{`
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
    `}</style>
  </div>
)

interface CounterProps {
  end: number
  start?: number
  duration?: number
  delay?: number
  className?: string
  suffix?: string
  prefix?: string
}

const Counter: React.FC<CounterProps> = ({
  end,
  start = 0,
  duration = 2000,
  delay = 0,
  className,
  suffix = "",
  prefix = ""
}) => {
  const [count, setCount] = React.useState(start)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const startTime = Date.now()
      const endTime = startTime + duration

      const animate = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        
        setCount(Math.floor(start + (end - start) * easeOutQuart))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }, delay)

    return () => clearTimeout(timer)
  }, [end, start, duration, delay])

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export {
  AnimatedCard,
  AnimatedButton,
  ProgressRing,
  FloatingLabel,
  Confetti,
  Shimmer,
  Counter
}