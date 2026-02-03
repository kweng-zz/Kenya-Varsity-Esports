import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/enhanced-card"
import { Progress } from "@/components/ui/progress"

interface TournamentBracketProps {
  matches: TournamentMatch[]
  className?: string
  interactive?: boolean
  onMatchClick?: (match: TournamentMatch) => void
  variant?: "single" | "double" | "round-robin"
}

interface TournamentMatch {
  id: string
  round: number
  matchNumber: number
  team1?: TournamentTeam
  team2?: TournamentTeam
  winner?: string
  score?: {
    team1: number
    team2: number
  }
  status: "pending" | "live" | "completed"
  startTime?: Date
}

interface TournamentTeam {
  id: string
  name: string
  logo?: string
  seed?: number
}

const TournamentBracket = React.forwardRef<HTMLDivElement, TournamentBracketProps>(
  ({ matches, className, interactive = false, onMatchClick, variant = "single" }, ref) => {
    const rounds = React.useMemo(() => {
      const roundMap = new Map<number, TournamentMatch[]>()
      matches.forEach(match => {
        if (!roundMap.has(match.round)) {
          roundMap.set(match.round, [])
        }
        roundMap.get(match.round)!.push(match)
      })
      
      // Sort matches within each round by match number
      roundMap.forEach(roundMatches => {
        roundMatches.sort((a, b) => a.matchNumber - b.matchNumber)
      })
      
      return Array.from(roundMap.entries()).sort(([a], [b]) => a - b)
    }, [matches])

    const getStatusColor = (status: TournamentMatch["status"]) => {
      switch (status) {
        case "live": return "bg-green-500"
        case "completed": return "bg-gray-500"
        case "pending": return "bg-yellow-500"
      }
    }

    const MatchCard = ({ match }: { match: TournamentMatch }) => {
      const hasWinner = match.winner && match.status === "completed"
      
      return (
        <Card
          variant="tournament"
          padding="sm"
          interactive={interactive ? "click" : "none"}
          className={cn(
            "min-w-[200px] border-2",
            match.status === "live" && "ring-2 ring-green-500 ring-opacity-50",
            interactive && "cursor-pointer"
          )}
          onClick={() => interactive && onMatchClick?.(match)}
        >
          <CardContent className="p-3">
            {/* Match Status */}
            <div className="flex items-center justify-between mb-2">
              <Badge
                variant={match.status === "live" ? "success" : match.status === "completed" ? "secondary" : "warning"}
                size="sm"
              >
                {match.status.toUpperCase()}
              </Badge>
              {match.startTime && (
                <span className="text-xs text-gray-400">
                  {match.startTime.toLocaleTimeString()}
                </span>
              )}
            </div>

            {/* Teams */}
            <div className="space-y-2">
              {/* Team 1 */}
              <div className={cn(
                "flex items-center justify-between p-2 rounded",
                hasWinner && match.winner === match.team1?.id && "bg-green-500/10"
              )}>
                <div className="flex items-center gap-2">
                  {match.team1?.seed && (
                    <span className="text-xs font-bold text-gray-400">#{match.team1.seed}</span>
                  )}
                  <span className={cn(
                    "font-medium text-sm",
                    hasWinner && match.winner === match.team1?.id && "text-green-400"
                  )}>
                    {match.team1?.name || "TBD"}
                  </span>
                  {hasWinner && match.winner === match.team1?.id && (
                    <Badge variant="success" size="sm">W</Badge>
                  )}
                </div>
                {match.score && (
                  <span className={cn(
                    "font-bold",
                    hasWinner && match.winner === match.team1?.id && "text-green-400"
                  )}>
                    {match.score.team1}
                  </span>
                )}
              </div>

              {/* Team 2 */}
              <div className={cn(
                "flex items-center justify-between p-2 rounded",
                hasWinner && match.winner === match.team2?.id && "bg-green-500/10"
              )}>
                <div className="flex items-center gap-2">
                  {match.team2?.seed && (
                    <span className="text-xs font-bold text-gray-400">#{match.team2.seed}</span>
                  )}
                  <span className={cn(
                    "font-medium text-sm",
                    hasWinner && match.winner === match.team2?.id && "text-green-400"
                  )}>
                    {match.team2?.name || "TBD"}
                  </span>
                  {hasWinner && match.winner === match.team2?.id && (
                    <Badge variant="success" size="sm">W</Badge>
                  )}
                </div>
                {match.score && (
                  <span className={cn(
                    "font-bold",
                    hasWinner && match.winner === match.team2?.id && "text-green-400"
                  )}>
                    {match.score.team2}
                  </span>
                )}
              </div>
            </div>

            {/* Match Number */}
            <div className="text-center mt-2 text-xs text-gray-500">
              Match {match.matchNumber}
            </div>
          </CardContent>
        </Card>
      )
    }

    const renderSingleElimination = () => (
      <div className="flex gap-8 overflow-x-auto pb-4">
        {rounds.map(([roundNumber, roundMatches]) => (
          <div key={roundNumber} className="flex flex-col gap-4">
            <h3 className="text-center font-bold text-white mb-2">
              {roundNumber === 1 ? "Round 1" : 
               roundNumber === rounds.length ? "Finals" : 
               `Round ${roundNumber}`}
            </h3>
            <div className="flex flex-col gap-4">
              {roundMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )

    const renderRoundRobin = () => {
      const matchesByGroup = matches.reduce((groups, match) => {
        const group = match.round
        if (!groups[group]) groups[group] = []
        groups[group].push(match)
        return groups
      }, {} as Record<number, TournamentMatch[]>)

      return (
        <div className="space-y-8">
          {Object.entries(matchesByGroup).map(([group, groupMatches]) => (
            <div key={group}>
              <h3 className="text-center font-bold text-white mb-4">Group {group}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("w-full", className)}>
        {variant === "round-robin" ? renderRoundRobin() : renderSingleElimination()}
      </div>
    )
  }
)
TournamentBracket.displayName = "TournamentBracket"

export { TournamentBracket, type TournamentMatch, type TournamentTeam }