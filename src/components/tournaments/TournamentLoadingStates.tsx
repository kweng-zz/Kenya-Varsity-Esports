import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton, SkeletonCard, SkeletonTable } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/enhanced-card"

interface TournamentLoadingStateProps {
  variant?: "card" | "table" | "bracket" | "leaderboard" | "details"
  count?: number
  className?: string
}

const TournamentLoadingStates = {
  Card: ({ count = 3, className }: { count?: number; className?: string }) => (
    <div className={cn("grid gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} variant="tournament" className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-700 animate-pulse" />
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
              <div className="h-6 w-48 bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-5 w-20 bg-gray-700 rounded-full animate-pulse" />
              <div className="h-5 w-24 bg-gray-700 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-40 bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-24 bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-32 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  ),

  Table: ({ rows = 5, className }: { rows?: number; className?: string }) => (
    <Card variant="glass" className={className}>
      <div className="p-6">
        <div className="h-8 w-48 bg-gray-700 rounded mb-6 animate-pulse" />
        
        {/* Table Header */}
        <div className="grid grid-cols-8 gap-4 pb-4 border-b border-gray-700">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
        
        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-8 gap-4 py-4 border-b border-gray-800">
            {Array.from({ length: 8 }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </Card>
  ),

  Bracket: ({ rounds = 4, className }: { rounds?: number; className?: string }) => (
    <div className={cn("flex gap-8 overflow-x-auto pb-4", className)}>
      {Array.from({ length: rounds }).map((_, roundIndex) => (
        <div key={roundIndex} className="flex flex-col gap-4">
          <div className="h-6 w-20 bg-gray-700 rounded mb-4 mx-auto animate-pulse" />
          {Array.from({ length: Math.pow(2, rounds - roundIndex - 1) }).map((_, matchIndex) => (
            <div key={matchIndex} className="border-2 border-gray-700 rounded-lg p-3 min-w-[200px]">
              <div className="space-y-3">
                <div className="h-4 w-16 bg-gray-700 rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-6 bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-6 bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-3 w-12 bg-gray-700 rounded mx-auto animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),

  Leaderboard: ({ entries = 5, className }: { entries?: number; className?: string }) => (
    <Card variant="glass" className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-gray-700 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-gray-700 rounded-full animate-pulse" />
            <div className="h-6 w-16 bg-gray-700 rounded-full animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-6 gap-4 pb-2 border-b border-gray-700">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
          
          {/* Entries */}
          {Array.from({ length: entries }).map((_, entryIndex) => (
            <div key={entryIndex} className="grid grid-cols-6 gap-4 items-center p-4 rounded-lg">
              <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="h-5 w-12 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-8 bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-12 bg-gray-700 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  ),

  Details: ({ className }: { className?: string }) => (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="h-48 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg animate-pulse" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glass">
            <div className="p-6 space-y-4">
              <div className="h-8 w-64 bg-gray-700 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-gray-700 rounded-full animate-pulse" />
                <div className="h-5 w-24 bg-gray-700 rounded-full animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="h-3 w-16 bg-gray-700 rounded mb-2 animate-pulse" />
                  <div className="h-5 w-32 bg-gray-700 rounded animate-pulse" />
                </div>
                <div>
                  <div className="h-3 w-12 bg-gray-700 rounded mb-2 animate-pulse" />
                  <div className="h-5 w-32 bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-700 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <Card variant="glass">
            <div className="p-6 space-y-4">
              <div className="h-6 w-24 bg-gray-700 rounded animate-pulse" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </Card>
          
          <Card variant="glass">
            <div className="p-6 space-y-4">
              <div className="h-6 w-32 bg-gray-700 rounded animate-pulse" />
              <div className="h-2 w-full bg-gray-700 rounded animate-pulse" />
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  ),
}

const TournamentLoadingState: React.FC<TournamentLoadingStateProps> = ({ 
  variant = "card", 
  count,
  className 
}) => {
  switch (variant) {
    case "card":
      return <TournamentLoadingStates.Card count={count} className={className} />
    case "table":
      return <TournamentLoadingStates.Table rows={count} className={className} />
    case "bracket":
      return <TournamentLoadingStates.Bracket rounds={count} className={className} />
    case "leaderboard":
      return <TournamentLoadingStates.Leaderboard entries={count} className={className} />
    case "details":
      return <TournamentLoadingStates.Details className={className} />
    default:
      return <TournamentLoadingStates.Card count={count} className={className} />
  }
}

export { TournamentLoadingState, TournamentLoadingStates }