import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/enhanced-card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface TournamentCardProps {
  tournament: Tournament
  className?: string
  variant?: "default" | "compact" | "detailed"
  showActions?: boolean
  onRegister?: () => void
  onView?: () => void
  onEdit?: () => void
}

interface Tournament {
  id: string
  name: string
  game: string
  gameLogo?: string
  startDate: Date
  endDate: Date
  status: "upcoming" | "registration" | "live" | "completed"
  prizePool?: number
  maxParticipants?: number
  currentParticipants?: number
  format: "single-elimination" | "double-elimination" | "round-robin" | "swiss"
  banner?: string
  location?: string
  description?: string
  rules?: string[]
  isRegistered?: boolean
  canRegister?: boolean
}

const TournamentCard = React.forwardRef<HTMLDivElement, TournamentCardProps>(
  ({ tournament, className, variant = "default", showActions = false, onRegister, onView, onEdit }, ref) => {
    const getStatusBadge = (status: Tournament["status"]) => {
      const variants = {
        upcoming: { variant: "secondary" as const, label: "Upcoming" },
        registration: { variant: "info" as const, label: "Registration Open" },
        live: { variant: "success" as const, label: "Live" },
        completed: { variant: "secondary" as const, label: "Completed" },
      }
      return variants[status]
    }

    const getFormatBadge = (format: Tournament["format"]) => {
      const labels = {
        "single-elimination": "Single Elim",
        "double-elimination": "Double Elim",
        "round-robin": "Round Robin",
        "swiss": "Swiss",
      }
      return labels[format]
    }

    const getProgressPercentage = () => {
      if (!tournament.maxParticipants || !tournament.currentParticipants) return 0
      return (tournament.currentParticipants / tournament.maxParticipants) * 100
    }

    const isFull = tournament.maxParticipants && tournament.currentParticipants && 
                   tournament.currentParticipants >= tournament.maxParticipants

    const statusInfo = getStatusBadge(tournament.status)

    const CompactView = () => (
      <Card variant="tournament" padding="sm" interactive="click" className="h-full">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {tournament.gameLogo && (
                  <img src={tournament.gameLogo} alt={tournament.game} className="w-6 h-6 rounded" />
                )}
                <h3 className="font-bold text-white line-clamp-1">{tournament.name}</h3>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={statusInfo.variant} size="sm">
                  {statusInfo.label}
                </Badge>
                <Badge variant="outline" size="sm">
                  {getFormatBadge(tournament.format)}
                </Badge>
              </div>
              <div className="text-sm text-gray-400">
                {tournament.startDate.toLocaleDateString()} - {tournament.endDate.toLocaleDateString()}
              </div>
              {tournament.prizePool && (
                <div className="text-sm font-bold text-[#8c110d] mt-1">
                  Prize: ${tournament.prizePool.toLocaleString()}
                </div>
              )}
            </div>
            
            {showActions && (
              <div className="flex flex-col gap-2">
                <Button size="sm" onClick={onView}>
                  View
                </Button>
                {tournament.canRegister && !tournament.isRegistered && (
                  <Button size="sm" variant="outline" onClick={onRegister}>
                    Register
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )

    const DetailedView = () => (
      <Card variant="tournament" className="h-full overflow-hidden">
        {tournament.banner && (
          <div className="h-32 bg-gradient-to-r from-[#8c110d] to-[#b91c17] relative overflow-hidden">
            <img 
              src={tournament.banner} 
              alt={tournament.name}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2">
                {tournament.gameLogo && (
                  <img src={tournament.gameLogo} alt={tournament.game} className="w-8 h-8 rounded" />
                )}
                <h3 className="font-bold text-white text-lg">{tournament.name}</h3>
              </div>
            </div>
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant={statusInfo.variant}>
              {statusInfo.label}
            </Badge>
            <Badge variant="outline">
              {getFormatBadge(tournament.format)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Start:</span>
              <div className="text-white font-medium">
                {tournament.startDate.toLocaleDateString()}
              </div>
            </div>
            <div>
              <span className="text-gray-400">End:</span>
              <div className="text-white font-medium">
                {tournament.endDate.toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Prize Pool */}
          {tournament.prizePool && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-3 border border-yellow-500/30">
              <div className="text-yellow-400 text-sm font-medium">Prize Pool</div>
              <div className="text-yellow-300 text-2xl font-bold">
                ${tournament.prizePool.toLocaleString()}
              </div>
            </div>
          )}

          {/* Participants */}
          {tournament.maxParticipants && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Participants</span>
                <span className="text-white font-medium">
                  {tournament.currentParticipants || 0} / {tournament.maxParticipants}
                </span>
              </div>
              <Progress 
                value={getProgressPercentage()} 
                max={100}
                variant="tournament"
                className="h-2"
              />
              {isFull && (
                <div className="text-xs text-red-400 mt-1">Tournament is full</div>
              )}
            </div>
          )}

          {/* Description */}
          {tournament.description && (
            <div>
              <div className="text-gray-400 text-sm mb-1">Description</div>
              <p className="text-white text-sm line-clamp-3">
                {tournament.description}
              </p>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-2">
              <Button onClick={onView} className="flex-1">
                View Details
              </Button>
              {tournament.canRegister && !tournament.isRegistered && (
                <Button onClick={onRegister} variant="outline" className="flex-1">
                  Register Now
                </Button>
              )}
              {tournament.isRegistered && (
                <Badge variant="success" className="flex-1 justify-center">
                  Registered ✓
                </Badge>
              )}
              {onEdit && (
                <Button onClick={onEdit} variant="outline" size="sm">
                  Edit
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )

    const DefaultView = () => (
      <Card variant="tournament" interactive="hover" className="h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                {tournament.gameLogo && (
                  <img src={tournament.gameLogo} alt={tournament.game} className="w-8 h-8 rounded" />
                )}
                <h3 className="font-bold text-white text-lg">{tournament.name}</h3>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={statusInfo.variant}>
                  {statusInfo.label}
                </Badge>
                <Badge variant="outline">
                  {getFormatBadge(tournament.format)}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="text-gray-400">
                  {tournament.startDate.toLocaleDateString()} - {tournament.endDate.toLocaleDateString()}
                </div>
                
                {tournament.prizePool && (
                  <div className="font-bold text-[#8c110d]">
                    Prize: ${tournament.prizePool.toLocaleString()}
                  </div>
                )}

                {tournament.maxParticipants && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Participants:</span>
                    <span className="text-white font-medium">
                      {tournament.currentParticipants || 0} / {tournament.maxParticipants}
                    </span>
                  </div>
                )}

                {tournament.location && (
                  <div className="text-gray-400">
                    📍 {tournament.location}
                  </div>
                )}
              </div>

              {tournament.description && (
                <p className="text-gray-300 text-sm mt-3 line-clamp-2">
                  {tournament.description}
                </p>
              )}
            </div>
          </div>

          {showActions && (
            <div className="flex gap-2 mt-4">
              <Button onClick={onView} className="flex-1">
                View Tournament
              </Button>
              {tournament.canRegister && !tournament.isRegistered && (
                <Button onClick={onRegister} variant="outline" className="flex-1">
                  Register
                </Button>
              )}
              {tournament.isRegistered && (
                <Badge variant="success" className="flex-1 justify-center py-2">
                  Registered ✓
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )

    return (
      <div ref={ref} className={cn("w-full", className)}>
        {variant === "compact" && <CompactView />}
        {variant === "detailed" && <DetailedView />}
        {variant === "default" && <DefaultView />}
      </div>
    )
  }
)
TournamentCard.displayName = "TournamentCard"

export { TournamentCard, type Tournament }