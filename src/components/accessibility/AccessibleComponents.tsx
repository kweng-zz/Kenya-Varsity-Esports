import * as React from "react"
import { cn } from "@/lib/utils"

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  ariaLabel?: string
  ariaDescribedBy?: string
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
}

const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    children,
    ariaLabel,
    ariaDescribedBy,
    loading = false,
    loadingText = "Loading...",
    icon,
    iconPosition = "left",
    variant = "primary",
    size = "md",
    disabled,
    className,
    onClick,
    ...props
  }, ref) => {
    const [isLoading, setIsLoading] = React.useState(false)

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || isLoading || disabled) return
      
      setIsLoading(true)
      try {
        await onClick?.(e)
      } finally {
        setIsLoading(false)
      }
    }

    const variantClasses = {
      primary: "bg-[#8c110d] text-white hover:bg-[#b91c17] focus:ring-[#8c110d]",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-600",
      outline: "border border-gray-400 text-gray-300 hover:bg-gray-800 focus:ring-gray-400",
      ghost: "text-gray-300 hover:bg-gray-800 focus:ring-gray-400",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
    }

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    }

    const isDisabled = disabled || loading || isLoading

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={isLoading || loading}
        onClick={handleClick}
        {...props}
      >
        {(isLoading || loading) ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="mr-2" aria-hidden="true">{icon}</span>
            )}
            <span>{children}</span>
            {icon && iconPosition === "right" && (
              <span className="ml-2" aria-hidden="true">{icon}</span>
            )}
          </>
        )}
      </button>
    )
  }
)
AccessibleButton.displayName = "AccessibleButton"

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  required?: boolean
  showRequiredIndicator?: boolean
}

const AccessibleInput = React.forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({
    label,
    error,
    hint,
    required = false,
    showRequiredIndicator = true,
    id,
    className,
    ...props
  }, ref) => {
    const inputId = id || React.useId()
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    const hasError = !!error
    const hasHint = !!hint

    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-300"
        >
          {label}
          {required && showRequiredIndicator && (
            <span className="text-red-400 ml-1" aria-label="required">*</span>
          )}
        </label>
        
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-[#8c110d] focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            hasError
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-700 focus:border-[#8c110d]",
            className
          )}
          aria-invalid={hasError}
          aria-describedby={cn(
            hasError && errorId,
            hasHint && hintId
          ).trim() || undefined}
          aria-required={required}
          {...props}
        />
        
        {hasHint && (
          <p id={hintId} className="text-sm text-gray-400">
            {hint}
          </p>
        )}
        
        {hasError && (
          <p id={errorId} className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
AccessibleInput.displayName = "AccessibleInput"

interface AccessibleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  hint?: string
  required?: boolean
  showRequiredIndicator?: boolean
  options: Array<{ value: string; label: string; disabled?: boolean }>
}

const AccessibleSelect = React.forwardRef<HTMLSelectElement, AccessibleSelectProps>(
  ({
    label,
    error,
    hint,
    required = false,
    showRequiredIndicator = true,
    options,
    id,
    className,
    ...props
  }, ref) => {
    const selectId = id || React.useId()
    const errorId = `${selectId}-error`
    const hintId = `${selectId}-hint`

    const hasError = !!error
    const hasHint = !!hint

    return (
      <div className="space-y-2">
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-300"
        >
          {label}
          {required && showRequiredIndicator && (
            <span className="text-red-400 ml-1" aria-label="required">*</span>
          )}
        </label>
        
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full px-3 py-2 bg-gray-800 border rounded-lg text-white",
            "focus:outline-none focus:ring-2 focus:ring-[#8c110d] focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            hasError
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-700 focus:border-[#8c110d]",
            className
          )}
          aria-invalid={hasError}
          aria-describedby={cn(
            hasError && errorId,
            hasHint && hintId
          ).trim() || undefined}
          aria-required={required}
          {...props}
        >
          {!required && (
            <option value="">Select an option</option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {hasHint && (
          <p id={hintId} className="text-sm text-gray-400">
            {hint}
          </p>
        )}
        
        {hasError && (
          <p id={errorId} className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
AccessibleSelect.displayName = "AccessibleSelect"

interface AccessibleCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  required?: boolean
  description?: string
}

const AccessibleCheckbox = React.forwardRef<HTMLInputElement, AccessibleCheckboxProps>(
  ({
    label,
    error,
    hint,
    required = false,
    description,
    id,
    className,
    ...props
  }, ref) => {
    const checkboxId = id || React.useId()
    const errorId = `${checkboxId}-error`
    const hintId = `${checkboxId}-hint`
    const descriptionId = `${checkboxId}-description`

    const hasError = !!error
    const hasHint = !!hint
    const hasDescription = !!description

    return (
      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={cn(
              "mt-0.5 h-4 w-4 rounded border-gray-700 bg-gray-800 text-[#8c110d]",
              "focus:outline-none focus:ring-2 focus:ring-[#8c110d] focus:ring-offset-2 focus:ring-offset-black",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              hasError && "border-red-500 focus:ring-red-500",
              className
            )}
            aria-invalid={hasError}
            aria-describedby={cn(
              hasError && errorId,
              hasHint && hintId,
              hasDescription && descriptionId
            ).trim() || undefined}
            aria-required={required}
            {...props}
          />
          
          <div className="flex-1">
            <label
              htmlFor={checkboxId}
              className="text-sm font-medium text-gray-300 cursor-pointer"
            >
              {label}
              {required && (
                <span className="text-red-400 ml-1" aria-label="required">*</span>
              )}
            </label>
            
            {hasDescription && (
              <p id={descriptionId} className="text-sm text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        
        {hasHint && (
          <p id={hintId} className="text-sm text-gray-400">
            {hint}
          </p>
        )}
        
        {hasError && (
          <p id={errorId} className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
AccessibleCheckbox.displayName = "AccessibleCheckbox"

// Focus Management Hook
const useFocusManagement = (initialFocusRef?: React.RefObject<HTMLElement>) => {
  const previousFocusRef = React.useRef<HTMLElement | null>(null)

  const trapFocus = React.useCallback((containerRef: React.RefObject<HTMLElement>) => {
    const container = containerRef.current
    if (!container) return

    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement

    // Get all focusable elements within the container
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus the first element
    firstElement?.focus()

    // Handle tab key to trap focus within container
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const restoreFocus = React.useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus()
    }
  }, [])

  const setInitialFocus = React.useCallback((elementRef: React.RefObject<HTMLElement>) => {
    elementRef.current?.focus()
  }, [])

  React.useEffect(() => {
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus()
    }
  }, [initialFocusRef])

  return {
    trapFocus,
    restoreFocus,
    setInitialFocus
  }
}

// Skip Link Component
const SkipLink: React.FC<{ 
  href: string
  children: React.ReactNode
  className?: string 
}> = ({ href, children, className }) => (
  <a
    href={href}
    className={cn(
      "absolute top-0 left-0 z-50 -translate-y-full",
      "bg-[#8c110d] text-white px-4 py-2 rounded",
      "focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white",
      "transition-transform duration-200",
      className
    )}
  >
    {children}
  </a>
)

// Screen Reader Announcer
const useAnnouncer = () => {
  const [announcement, setAnnouncement] = React.useState("")
  
  const announce = React.useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    setAnnouncement(message)
    // Clear announcement after it should be read
    setTimeout(() => setAnnouncement(""), 1000)
  }, [])

  const Announcer = React.useCallback(() => (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  ), [announcement])

  return { announce, Announcer }
}

export {
  AccessibleButton,
  AccessibleInput,
  AccessibleSelect,
  AccessibleCheckbox,
  useFocusManagement,
  SkipLink,
  useAnnouncer
}