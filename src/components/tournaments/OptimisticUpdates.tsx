import * as React from "react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, RotateCcw } from "lucide-react"

interface OptimisticUpdateProps {
  children: React.ReactNode
  isLoading?: boolean
  isSuccess?: boolean
  isError?: boolean
  error?: string
  reset?: () => void
  loadingMessage?: string
  successMessage?: string
  showReset?: boolean
  className?: string
}

interface OptimisticActionConfig {
  id: string
  type: "create" | "update" | "delete"
  entity: string
  data?: any
  rollback?: () => Promise<void> | void
}

interface OptimisticState {
  actions: Map<string, OptimisticActionConfig>
  isLoading: boolean
  error: string | null
}

const OptimisticUpdateContext = React.createContext<{
  state: OptimisticState
  executeAction: (config: OptimisticActionConfig) => Promise<void>
  resolveAction: (id: string, success: boolean, error?: string) => void
  resetState: () => void
}>({
  state: { actions: new Map(), isLoading: false, error: null },
  executeAction: async () => {},
  resolveAction: () => {},
  resetState: () => {}
})

const OptimisticProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = React.useState<OptimisticState>({
    actions: new Map(),
    isLoading: false,
    error: null
  })

  const executeAction = React.useCallback(async (config: OptimisticActionConfig) => {
    setState(prev => ({
      ...prev,
      actions: new Map(prev.actions).set(config.id, config),
      isLoading: true,
      error: null
    }))
  }, [])

  const resolveAction = React.useCallback((id: string, success: boolean, error?: string) => {
    setState(prev => {
      const newActions = new Map(prev.actions)
      newActions.delete(id)
      
      return {
        actions: newActions,
        isLoading: false,
        error: success ? null : error || null
      }
    })
  }, [])

  const resetState = React.useCallback(() => {
    setState({
      actions: new Map(),
      isLoading: false,
      error: null
    })
  }, [])

  return (
    <OptimisticUpdateContext.Provider value={{
      state,
      executeAction,
      resolveAction,
      resetState
    }}>
      {children}
    </OptimisticUpdateContext.Provider>
  )
}

const useOptimistic = () => {
  const context = React.useContext(OptimisticUpdateContext)
  if (!context) {
    throw new Error("useOptimistic must be used within an OptimisticProvider")
  }
  return context
}

interface OptimisticStatusProps {
  actionId?: string
  showSpinner?: boolean
  className?: string
  variant?: "inline" | "card" | "toast"
}

const OptimisticStatus: React.FC<OptimisticStatusProps> = ({
  actionId,
  showSpinner = true,
  className,
  variant = "inline"
}) => {
  const { state } = useOptimistic()
  const action = actionId ? state.actions.get(actionId) : null

  if (!action && !state.isLoading && !state.error) return null

  const InlineStatus = () => (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      {showSpinner && state.isLoading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
      {state.isLoading && (
        <span className="text-blue-400">
          Updating {action?.entity || "item"}...
        </span>
      )}
      {state.error && (
        <>
          <XCircle className="h-4 w-4 text-red-400" />
          <span className="text-red-400">{state.error}</span>
        </>
      )}
    </div>
  )

  const CardStatus = () => (
    <div className={cn("rounded-lg border p-4", className)}>
      {state.isLoading && (
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
          <div>
            <div className="font-medium text-white">
              Updating {action?.entity || "item"}...
            </div>
            <div className="text-sm text-gray-400">
              Your changes are being processed
            </div>
          </div>
        </div>
      )}
      {state.error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            {state.error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )

  const ToastStatus = () => (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 min-w-[300px] rounded-lg border p-4 shadow-lg",
      "bg-black/90 backdrop-blur-sm border-gray-700",
      className
    )}>
      {state.isLoading && (
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
          <div>
            <div className="font-medium text-white">
              Updating {action?.entity || "item"}...
            </div>
            <div className="text-sm text-gray-400">
              Your changes are being processed
            </div>
          </div>
        </div>
      )}
      {state.error && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="font-medium text-white">Update Failed</div>
          </div>
          <div className="text-sm text-gray-400">{state.error}</div>
          <Button variant="outline" size="sm" className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  )

  switch (variant) {
    case "card":
      return <CardStatus />
    case "toast":
      return <ToastStatus />
    default:
      return <InlineStatus />
  }
}

const OptimisticWrapper: React.FC<OptimisticUpdateProps> = ({
  children,
  isLoading,
  isSuccess,
  isError,
  error,
  reset,
  loadingMessage = "Processing...",
  successMessage,
  showReset = true,
  className
}) => {
  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30", className)}>
        <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
        <div className="flex-1">
          <div className="text-blue-400 font-medium">{loadingMessage}</div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive" className={className}>
        <XCircle className="h-4 w-4" />
        <AlertDescription className="flex-1">
          {error || "An error occurred while processing your request."}
        </AlertDescription>
        {showReset && reset && (
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </Alert>
    )
  }

  if (isSuccess && successMessage) {
    return (
      <div className={cn("flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30", className)}>
        <CheckCircle className="h-5 w-5 text-green-400" />
        <div className="flex-1">
          <div className="text-green-400 font-medium">{successMessage}</div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Higher-order component for optimistic updates
const withOptimisticUpdate = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    loadingMessage?: string
    successMessage?: string
    errorMessage?: string
  }
) => {
  const WrappedComponent = (props: P) => {
    const { state, executeAction, resolveAction } = useOptimistic()
    const [localState, setLocalState] = React.useState({
      isLoading: false,
      error: null as string | null,
      success: false
    })

    const handleOptimisticAction = React.useCallback(async (
      actionId: string,
      action: () => Promise<any>
    ) => {
      setLocalState({ isLoading: true, error: null, success: false })
      await executeAction({
        id: actionId,
        type: "update",
        entity: "item"
      })

      try {
        const result = await action()
        resolveAction(actionId, true)
        setLocalState({ isLoading: false, error: null, success: true })
        return result
      } catch (error) {
        resolveAction(actionId, false, error instanceof Error ? error.message : "Unknown error")
        setLocalState({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : "Unknown error", 
          success: false 
        })
        throw error
      }
    }, [executeAction, resolveAction])

    return (
      <OptimisticWrapper
        isLoading={localState.isLoading}
        isError={!!localState.error}
        error={localState.error || undefined}
        isSuccess={localState.success}
        successMessage={options?.successMessage}
        loadingMessage={options?.loadingMessage}
      >
        <Component {...props} onOptimisticAction={handleOptimisticAction} />
      </OptimisticWrapper>
    )
  }

  WrappedComponent.displayName = `withOptimisticUpdate(${Component.displayName || Component.name})`
  return WrappedComponent
}

export {
  OptimisticProvider,
  useOptimistic,
  OptimisticStatus,
  OptimisticWrapper,
  withOptimisticUpdate,
  type OptimisticActionConfig,
  type OptimisticState
}