import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/enhanced-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface TournamentLeaderboardProps {
  entries: LeaderboardEntry[]
  tournament: {
    id: string
    name: string
    game: string
    status: string
    isLive?: boolean
  }
  variant?: "compact" | "detailed" | "minimal"
  maxEntries?: number
  showRanking?: boolean
  showProgress?: boolean
  currentUser?: string
  className?: string
  onUserClick?: (userId: string) => void
}

interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  teamName?: string
  avatar?: string
  score: number
  stats?: {
    wins?: number
    losses?: number
    draws?: number
    points?: number
    kd?: number
  }
  change?: "up" | "down" | "same"
  isCurrent?: boolean
  lastMatch?: {
    result: "win" | "loss" | "draw"
    opponent: string
    score: string
  }
}

const TournamentLeaderboard = React.forwardRef<HTMLDivElement, TournamentLeaderboardProps>(
  ({ 
    entries, 
    tournament, 
    variant = "detailed",
    maxEntries = 10,
    showRanking = true,
    showProgress = false,
    currentUser,
    className,
    onUserClick 
  }, ref) => {
    const displayedEntries = maxEntries ? entries.slice(0, maxEntries) : entries
    const topScore = Math.max(...displayedEntries.map(e => e.score))

    const getRankDisplay = (rank: number) => {
      if (rank === 1) return "🥇"
      if (rank === 2) return "🥈"
      if (rank === 3) return "🥉"
      return `#${rank}`
    }

    const getRankBadgeVariant = (rank: number) => {
      if (rank === 1) return "tournament" as const
      if (rank === 2) return "secondary" as const
      if (rank === 3) return "outline" as const
      return "secondary" as const
    }

    const getChangeIcon = (change?: "up" | "down" | "same") => {
      switch (change) {
        case "up":
          return <span className="text-green-400">↑</span>
        case "down":
          return <span className="text-red-400">↓</span>
        case "same":
          return <span className="text-gray-400">—</span>
        default:
          return null
      }
    }

    const getLastMatchBadge = (result: "win" | "loss" | "draw") => {
      const variants = {
        win: { variant: "success" as const, label: "W" },
        loss: { variant: "destructive" as const, label: "L" },
        draw: { variant: "secondary" as const, label: "D" },
      }
      return variants[result]
    }

    const MinimalView = () => (
      <div className="space-y-1">
        {displayedEntries.map((entry) => (
          <div
            key={entry.userId}
            className={cn(
              "flex items-center justify-between p-2 rounded hover:bg-gray-800 transition-colors",
              entry.isCurrent && "bg-[#8c110d]/20 border border-[#8c110d]/40",
              onUserClick && "cursor-pointer"
            )}
            onClick={() => onUserClick?.(entry.userId)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-gray-400 w-6">
                #{entry.rank}
              </span>
              <span className="text-sm text-white">
                {entry.username}
              </span>
              {entry.change && (
                <span className="text-xs">
                  {getChangeIcon(entry.change)}
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-[#8c110d]">
              {entry.score.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    )

    const CompactView = () => (
      <div className="space-y-2">
        {displayedEntries.map((entry) => (
          <Card
            key={entry.userId}
            variant={entry.isCurrent ? "tournament" : "glass"}
            padding="sm"
            interactive={onUserClick ? "click" : "none"}
            className={cn(
              "transition-all duration-200",
              entry.isCurrent && "ring-2 ring-[#8c110d]/50"
            )}
            onClick={() => onUserClick?.(entry.userId)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={getRankBadgeVariant(entry.rank)} size="sm">
                    {getRankDisplay(entry.rank)}
                  </Badge>
                  
                  <div className="flex items-center gap-2">
                    {entry.avatar && (
                      <img
                        src={entry.avatar}
                        alt={entry.username}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium text-white text-sm">
                        {entry.username}
                      </div>
                      {entry.teamName && (
                        <div className="text-xs text-gray-400">
                          {entry.teamName}
                        </div>
                      )}
                    </div>
                  </div>

                  {entry.change && (
                    <span className="text-xs">
                      {getChangeIcon(entry.change)}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <div className="font-bold text-white">
                    {entry.score.toLocaleString()}
                  </div>
                  {entry.lastMatch && (
                    <Badge
                      variant={getLastMatchBadge(entry.lastMatch.result).variant}
                      size="sm"
                    >
                      {getLastMatchBadge(entry.lastMatch.result).label}
                    </Badge>
                  )}
                </div>
              </div>

              {showProgress && (
                <div className="mt-3">
                  <Progress
                    value={(entry.score / topScore) * 100}
                    variant="tournament"
                    className="h-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )

    const DetailedView = () => (
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">
              {tournament.name} Leaderboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{tournament.game}</Badge>
              {tournament.isLive && (
                <Badge variant="success" className="animate-pulse">
                  🔴 LIVE
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-4 pb-2 border-b border-gray-700">
              <div className="col-span-1 text-center text-sm text-gray-400">Rank</div>
              <div className="col-span-4 text-sm text-gray-400">Player/Team</div>
              <div className="col-span-2 text-center text-sm text-gray-400">Score</div>
              <div className="col-span-2 text-center text-sm text-gray-400">W-L-D</div>
              <div className="col-span-1 text-center text-sm text-gray-400">K/D</div>
              <div className="col-span-2 text-center text-sm text-gray-400">Last</div>
            </div>

            {/* Entries */}
            {displayedEntries.map((entry) => (
              <div
                key={entry.userId}
                className={cn(
                  "grid grid-cols-12 gap-4 items-center p-4 rounded-lg transition-colors",
                  entry.isCurrent 
                    ? "bg-[#8c110d]/20 border border-[#8c110d]/40" 
                    : "hover:bg-gray-800/50",
                  onUserClick && "cursor-pointer"
                )}
                onClick={() => onUserClick?.(entry.userId)}
              >
                {/* Rank */}
                <div className="col-span-1 text-center">
                  <Badge 
                    variant={getRankBadgeVariant(entry.rank)}
                    className={cn(
                      entry.rank <= 3 && "font-bold",
                      entry.isCurrent && "ring-2 ring-white"
                    )}
                  >
                    {getRankDisplay(entry.rank)}
                  </Badge>
                </div>

                {/* Player/Team */}
                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    {entry.avatar && (
                      <img
                        src={entry.avatar}
                        alt={entry.username}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium text-white">
                        {entry.username}
                        {entry.isCurrent && (
                          <Badge variant="success" size="sm" className="ml-2">
                            YOU
                          </Badge>
                        )}
                      </div>
                      {entry.teamName && (
                        <div className="text-sm text-gray-400">
                          {entry.teamName}
                        </div>
                      )}
                    </div>
                  </div>
                  {entry.change && (
                    <div className="mt-1">
                      {getChangeIcon(entry.change)}
                    </div>
                  )}
                </div>

                {/* Score */}
                <div className="col-span-2 text-center">
                  <div className="text-lg font-bold text-white">
                    {entry.score.toLocaleString()}
                  </div>
                  {showProgress && (
                    <div className="mt-1">
                      <Progress
                        value={(entry.score / topScore) * 100}
                        variant="tournament"
                        className="h-1"
                      />
                    </div>
                  )}
                </div>

                {/* W-L-D */}
                <div className="col-span-2 text-center">
                  {entry.stats && (
                    <div className="text-sm text-gray-300">
                      {entry.stats.wins || 0}-{entry.stats.losses || 0}-{entry.stats.draws || 0}
                    </div>
                  )}
                </div>

                {/* K/D */}
                <div className="col-span-1 text-center">
                  {entry.stats?.kd && (
                    <div className="text-sm text-gray-300">
                      {entry.stats.kd.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Last Match */}
                <div className="col-span-2 text-center">
                  {entry.lastMatch && (
                    <div className="space-y-1">
                      <Badge
                        variant={getLastMatchBadge(entry.lastMatch.result).variant}
                        size="sm"
                      >
                        {getLastMatchBadge(entry.lastMatch.result).label}
                      </Badge>
                      <div className="text-xs text-gray-400">
                        {entry.lastMatch.score}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {maxEntries && entries.length > maxEntries && (
            <div className="flex justify-center mt-6">
              <Button variant="outline">
                View All {entries.length} Entries
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )

    return (
      <div ref={ref} className={cn("w-full", className)}>
        {variant === "minimal" && <MinimalView />}
        {variant === "compact" && <CompactView />}
        {variant === "detailed" && <DetailedView />}
      </div>
    )
  }
)
TournamentLeaderboard.displayName = "TournamentLeaderboard"

export { TournamentLeaderboard, type LeaderboardEntry }