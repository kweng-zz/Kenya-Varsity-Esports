"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/enhanced-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TournamentCard, type Tournament } from "@/components/tournaments/TournamentCard"
import { TournamentBracket, type TournamentMatch, type TournamentTeam } from "@/components/tournaments/TournamentBracket"
import { TournamentLeaderboard, type LeaderboardEntry } from "@/components/tournaments/TournamentLeaderboard"
import { ResponsiveTable, type TableColumn } from "@/components/tournaments/ResponsiveComponents"
import { TournamentLoadingState } from "@/components/tournaments/TournamentLoadingStates"
import { BarChart, LineChart, PieChart, StatCard, type ChartDataPoint } from "@/components/analytics/DataVisualization"
import { AnimatedCard, AnimatedButton, ProgressRing, Confetti } from "@/components/animations/MicroInteractions"
import { AccessibleButton, AccessibleInput } from "@/components/accessibility/AccessibleComponents"

// Sample Data
const sampleTournaments: Tournament[] = [
  {
    id: "1",
    name: "KVE Spring Championship 2026",
    game: "PUBG Mobile",
    startDate: new Date("2026-03-15"),
    endDate: new Date("2026-03-20"),
    status: "registration",
    prizePool: 50000,
    maxParticipants: 64,
    currentParticipants: 48,
    format: "single-elimination",
    canRegister: true,
    isRegistered: false
  },
  {
    id: "2",
    name: "University Valorant League",
    game: "Valorant",
    startDate: new Date("2026-04-01"),
    endDate: new Date("2026-04-15"),
    status: "upcoming",
    prizePool: 25000,
    maxParticipants: 32,
    currentParticipants: 12,
    format: "double-elimination",
    canRegister: true,
    isRegistered: true
  }
]

const sampleTeams: TournamentTeam[] = [
  { id: "1", name: "Nairobi Knights", seed: 1 },
  { id: "2", name: "Mombasa Warriors", seed: 4 },
  { id: "3", name: "Kisumu Eagles", seed: 2 },
  { id: "4", name: "Eldoret Lions", seed: 3 }
]

const sampleMatches: TournamentMatch[] = [
  {
    id: "m1",
    round: 1,
    matchNumber: 1,
    team1: sampleTeams[0],
    team2: sampleTeams[3],
    status: "completed",
    winner: "1",
    score: { team1: 16, team2: 12 },
    startTime: new Date("2026-03-15T10:00:00")
  },
  {
    id: "m2",
    round: 1,
    matchNumber: 2,
    team1: sampleTeams[2],
    team2: sampleTeams[1],
    status: "live",
    score: { team1: 8, team2: 5 },
    startTime: new Date("2026-03-15T12:00:00")
  },
  {
    id: "m3",
    round: 2,
    matchNumber: 3,
    team1: sampleTeams[0],
    team2: sampleTeams[2],
    status: "pending",
    startTime: new Date("2026-03-15T16:00:00")
  }
]

const sampleLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "u1",
    username: "ProGamer123",
    teamName: "Nairobi Knights",
    score: 2450,
    stats: { wins: 8, losses: 2, kd: 2.4 },
    isCurrent: true,
    change: "up"
  },
  {
    rank: 2,
    userId: "u2",
    username: "SniperElite",
    teamName: "Mombasa Warriors",
    score: 2380,
    stats: { wins: 7, losses: 3, kd: 2.1 },
    change: "down"
  }
]

const chartData: ChartDataPoint[] = [
  { label: "Mon", value: 120, color: "#8c110d" },
  { label: "Tue", value: 180, color: "#961c18" },
  { label: "Wed", value: 140, color: "#f59e0b" },
  { label: "Thu", value: 220, color: "#10b981" },
  { label: "Fri", value: 280, color: "#3b82f6" }
]

const pieChartData: ChartDataPoint[] = [
  { label: "PUBG Mobile", value: 45, color: "#8c110d" },
  { label: "Valorant", value: 25, color: "#961c18" },
  { label: "Free Fire", value: 20, color: "#f59e0b" },
  { label: "Call of Duty", value: 10, color: "#10b981" }
]

const participantColumns: TableColumn<any>[] = [
  {
    key: "team",
    header: "Team Name",
    render: (value) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">
            {value.charAt(0)}
          </span>
        </div>
        <span className="text-white font-medium">{value}</span>
      </div>
    ),
    priority: "high"
  },
  {
    key: "university",
    header: "University",
    priority: "high"
  },
  {
    key: "members",
    header: "Members",
    render: (value) => (
      <Badge variant="outline">{value}</Badge>
    ),
    priority: "medium"
  },
  {
    key: "status",
    header: "Status",
    render: (value) => (
      <Badge
        variant={value === "confirmed" ? "success" : value === "pending" ? "warning" : "secondary"}
      >
        {value}
      </Badge>
    ),
    priority: "high"
  }
]

const sampleParticipants = [
  { team: "Nairobi Knights", university: "University of Nairobi", members: 5, status: "confirmed" },
  { team: "Mombasa Warriors", university: "Technical University of Mombasa", members: 4, status: "confirmed" },
  { team: "Kisumu Eagles", university: "Maseno University", members: 6, status: "pending" }
]

export default function TournamentEnhancedUI() {
  const [showConfetti, setShowConfetti] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedTournament, setSelectedTournament] = React.useState<string | null>(null)

  const handleRegister = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-black">
      {showConfetti && <Confetti trigger={true} />}
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Enhanced Tournament Experience
          </h1>
          <p className="text-gray-400 text-lg">
            Production-ready UI components for competitive gaming
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Active Tournaments"
            value={12}
            change={{ value: 20, type: "increase" }}
            icon={<div className="w-6 h-6 bg-[#8c110d] rounded" />}
            color="primary"
          />
          <StatCard
            title="Total Participants"
            value={2847}
            change={{ value: 15, type: "increase" }}
            icon={<div className="w-6 h-6 bg-green-600 rounded" />}
            color="success"
          />
          <StatCard
            title="Prize Pool"
            value={"$125,000"}
            change={{ value: 8, type: "increase" }}
            icon={<div className="w-6 h-6 bg-yellow-600 rounded" />}
            color="warning"
          />
          <StatCard
            title="Live Matches"
            value={8}
            change={{ value: 5, type: "decrease" }}
            icon={<div className="w-6 h-6 bg-red-600 rounded" />}
            color="error"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart
            data={chartData}
            title="Daily Tournament Activity"
            height={200}
            animated={true}
          />
          <PieChart
            data={pieChartData}
            title="Game Distribution"
            size={200}
            showLabels={true}
            showPercentages={true}
            donut={true}
          />
        </div>

        {/* Tournament Cards */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Featured Tournaments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleTournaments.map((tournament) => (
              <AnimatedCard key={tournament.id} hover scale glow>
                <TournamentCard
                  tournament={tournament}
                  variant="detailed"
                  showActions={true}
                  onRegister={handleRegister}
                  onView={() => setSelectedTournament(tournament.id)}
                />
              </AnimatedCard>
            ))}
          </div>
        </div>

        {/* Tournament Bracket */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Live Bracket</h2>
          <TournamentBracket
            matches={sampleMatches}
            interactive={true}
            onMatchClick={(match) => console.log("Match clicked:", match)}
          />
        </div>

        {/* Leaderboard */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Current Standings</h2>
          <TournamentLeaderboard
            entries={sampleLeaderboard}
            tournament={{
              id: "1",
              name: "KVE Championship",
              game: "PUBG Mobile",
              status: "live",
              isLive: true
            }}
            variant="detailed"
            currentUser="u1"
            onUserClick={(userId) => console.log("User clicked:", userId)}
          />
        </div>

        {/* Participants Table */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Registered Teams</h2>
          <ResponsiveTable
            data={sampleParticipants}
            columns={participantColumns}
            mobileVariant="stacked"
            onRowClick={(team) => console.log("Team clicked:", team)}
          />
        </div>

        {/* Interactive Demo Section */}
        <AnimatedCard hover tilt glow className="p-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Interactive Components Demo
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Animated Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Animated Buttons</h3>
                <div className="space-y-3">
                  <AnimatedButton variant="bounce" onClick={() => console.log("Bounce!")}>
                    Bounce Effect
                  </AnimatedButton>
                  <AnimatedButton variant="glow" onClick={() => console.log("Glow!")}>
                    Glow Effect
                  </AnimatedButton>
                  <AnimatedButton variant="ripple" onClick={() => console.log("Ripple!")}>
                    Ripple Effect
                  </AnimatedButton>
                </div>
              </div>

              {/* Progress Rings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Progress Indicators</h3>
                <div className="flex flex-col items-center space-y-4">
                  <ProgressRing progress={75} size={80} />
                  <ProgressRing progress={50} size={60} color="#10b981" />
                  <ProgressRing progress={90} size={70} color="#f59e0b" />
                </div>
              </div>

              {/* Accessible Forms */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Accessible Forms</h3>
                <div className="space-y-3">
                  <AccessibleInput
                    label="Team Name"
                    placeholder="Enter your team name"
                    required
                  />
                  <AccessibleButton
                    onClick={handleRegister}
                    loading={isLoading}
                    loadingText="Registering..."
                  >
                    {isLoading ? "Processing..." : "Register Team"}
                  </AccessibleButton>
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Loading States Demo */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Loading States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TournamentLoadingState variant="card" count={2} />
            <TournamentLoadingState variant="leaderboard" count={3} />
          </div>
        </div>

        {/* Line Chart */}
        <LineChart
          data={chartData}
          title="Tournament Growth Trend"
          height={200}
          showGrid={true}
          showDots={true}
          showArea={true}
          smooth={true}
        />
      </div>
    </div>
  )
}