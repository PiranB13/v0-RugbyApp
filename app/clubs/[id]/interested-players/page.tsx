"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { InterestedPlayersList } from "@/components/interested-players-list"

// Sample data - in a real app, this would come from an API
const sampleOpportunities = [
  {
    id: 1,
    position: "Scrum-half",
    description:
      "Looking for an experienced scrum-half with strong passing skills and game management ability. Ideal for players with university or semi-professional experience.",
    requirements: "Fast service, tactical kicking, good communication",
    commitment: "Training twice weekly, matches on Saturdays",
    deadline: "August 15, 2023",
    interestedPlayers: [
      {
        id: "player1",
        name: "James Wilson",
        photo: "/placeholder.svg?height=64&width=64",
        position: "Scrum-half",
        level: "Semi-pro",
        region: "London, UK",
        experience: "5 years at semi-professional level",
        expressedInterestDate: "2023-07-28",
        status: "shortlisted",
        message:
          "I've been playing scrum-half for 5 years and looking for a new challenge. I'm available for trials anytime.",
      },
      {
        id: "player2",
        name: "Michael Brown",
        photo: "/placeholder.svg?height=64&width=64",
        position: "Scrum-half",
        level: "Amateur",
        region: "Bristol, UK",
        experience: "3 years at university level",
        expressedInterestDate: "2023-07-30",
        status: "pending",
      },
      {
        id: "player3",
        name: "David Thompson",
        photo: "/placeholder.svg?height=64&width=64",
        position: "Scrum-half / Fly-half",
        level: "Semi-pro",
        region: "Manchester, UK",
        experience: "4 years at club level",
        expressedInterestDate: "2023-08-02",
        status: "contacted",
        message:
          "I'm currently playing for Manchester RFC but looking to relocate to London. Available for discussion.",
      },
    ],
  },
  {
    id: 2,
    position: "Prop",
    description:
      "Seeking props with solid scrummaging technique to strengthen our front row. Opportunity for regular first team rugby for the right candidates.",
    requirements: "Strong scrummaging, mobility around the park",
    commitment: "Training twice weekly, matches on Saturdays",
    deadline: "August 30, 2023",
    interestedPlayers: [
      {
        id: "player4",
        name: "Robert Johnson",
        photo: "/placeholder.svg?height=64&width=64",
        position: "Prop",
        level: "Semi-pro",
        region: "Cardiff, UK",
        experience: "7 years at club level",
        expressedInterestDate: "2023-07-25",
        status: "pending",
      },
      {
        id: "player5",
        name: "Thomas Williams",
        photo: "/placeholder.svg?height=64&width=64",
        position: "Prop",
        level: "Amateur",
        region: "London, UK",
        experience: "2 years at amateur level",
        expressedInterestDate: "2023-08-01",
        status: "rejected",
      },
    ],
  },
  {
    id: 3,
    position: "Centre",
    description:
      "Opportunity for centers with good handling skills and defensive organization. Looking for players who can create opportunities in attack.",
    requirements: "Strong defense, good hands, communication",
    commitment: "Training twice weekly, matches on Saturdays",
    deadline: "August 30, 2023",
    interestedPlayers: [
      {
        id: "player6",
        name: "Sarah Jenkins",
        photo: "/placeholder.svg?height=64&width=64",
        position: "Centre",
        level: "Semi-pro",
        region: "Edinburgh, UK",
        experience: "5 years at university and club level",
        expressedInterestDate: "2023-07-29",
        status: "shortlisted",
        message:
          "I'm looking to move to London for work and would love to join your club. I've played center for Scotland U21s.",
      },
    ],
  },
  {
    id: 4,
    position: "Fly-half",
    description:
      "Seeking a tactically astute fly-half to direct our attacking play. Must have good kicking from hand and strong game management.",
    requirements: "Tactical awareness, kicking skills, leadership",
    commitment: "Training twice weekly, matches on Saturdays",
    deadline: "September 5, 2023",
    interestedPlayers: [],
  },
]

export default function InterestedPlayersPage() {
  const [opportunities, setOpportunities] = useState(sampleOpportunities)
  const [activeTab, setActiveTab] = useState<"all" | "recent">("all")

  // Calculate stats
  const totalInterested = opportunities.reduce((total, opp) => total + opp.interestedPlayers.length, 0)

  const recentInterested = opportunities.reduce(
    (total, opp) =>
      total +
      opp.interestedPlayers.filter((player) => {
        const expressedDate = new Date(player.expressedInterestDate)
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        return expressedDate >= oneWeekAgo
      }).length,
    0,
  )

  const shortlisted = opportunities.reduce(
    (total, opp) => total + opp.interestedPlayers.filter((player) => player.status === "shortlisted").length,
    0,
  )

  // Handle updating player status
  const handleUpdatePlayerStatus = (opportunityId: number, playerId: string, status: string) => {
    const updatedOpportunities = opportunities.map((opportunity) => {
      if (opportunity.id === opportunityId) {
        const updatedPlayers = opportunity.interestedPlayers.map((player) => {
          if (player.id === playerId) {
            return { ...player, status: status as any }
          }
          return player
        })
        return { ...opportunity, interestedPlayers: updatedPlayers }
      }
      return opportunity
    })

    setOpportunities(updatedOpportunities)
  }

  // Filter opportunities based on active tab
  const getFilteredOpportunities = () => {
    if (activeTab === "all") {
      return opportunities
    } else {
      // Filter to only show opportunities with recent interest (last 7 days)
      return opportunities
        .map((opp) => {
          const oneWeekAgo = new Date()
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

          const recentPlayers = opp.interestedPlayers.filter((player) => {
            const expressedDate = new Date(player.expressedInterestDate)
            return expressedDate >= oneWeekAgo
          })

          if (recentPlayers.length > 0) {
            return { ...opp, interestedPlayers: recentPlayers }
          }
          return { ...opp, interestedPlayers: [] }
        })
        .filter((opp) => opp.interestedPlayers.length > 0)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/clubs/london-eagles" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft size={18} />
              <span className="ml-2">Back to Club Profile</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <ThemeToggle />
            <Link href="/settings" className="text-foreground hover:text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-[#1e4620] dark:bg-[#1e4620] flex items-center justify-center text-white">
                JW
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Interested Players</h1>
            <p className="text-muted-foreground mt-1">
              Manage players who have expressed interest in your club's opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{totalInterested}</CardTitle>
                <CardDescription>Total Interested Players</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  Across {opportunities.filter((o) => o.interestedPlayers.length > 0).length} positions
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{recentInterested}</CardTitle>
                <CardDescription>New This Week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  In the last 7 days
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{shortlisted}</CardTitle>
                <CardDescription>Shortlisted Players</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  Ready for next steps
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "recent")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="all">All Interested Players</TabsTrigger>
              <TabsTrigger value="recent">Recent Interest (Last 7 Days)</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <InterestedPlayersList
                opportunities={getFilteredOpportunities()}
                onUpdatePlayerStatus={handleUpdatePlayerStatus}
              />
            </TabsContent>

            <TabsContent value="recent" className="mt-0">
              <InterestedPlayersList
                opportunities={getFilteredOpportunities()}
                onUpdatePlayerStatus={handleUpdatePlayerStatus}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
