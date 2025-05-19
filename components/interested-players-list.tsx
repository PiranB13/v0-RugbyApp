"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { MessageSquare, MoreHorizontal, Search, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data - in a real app would come from an API
const interestedPlayers = [
  {
    id: "player1",
    name: "James Wilson",
    position: "Fly-half",
    age: 22,
    height: "6'1\"",
    weight: "92kg",
    experience: "5 years",
    profileImage: "/placeholder.svg?height=100&width=100",
    expressedInterestDate: "2023-05-15T10:30:00Z",
    opportunity: {
      id: "opp1",
      title: "Fly-half position",
      status: "open",
    },
    status: "new",
    notes: "Strong kicking game, good vision",
    lastContact: null,
    matchPercentage: 85,
  },
  {
    id: "player2",
    name: "Michael Johnson",
    position: "Scrum-half",
    age: 24,
    height: "5'9\"",
    weight: "85kg",
    experience: "7 years",
    profileImage: "/placeholder.svg?height=100&width=100",
    expressedInterestDate: "2023-05-10T14:20:00Z",
    opportunity: {
      id: "opp2",
      title: "Scrum-half position",
      status: "open",
    },
    status: "contacted",
    notes: "Quick pass, good communication",
    lastContact: "2023-05-12T09:15:00Z",
    matchPercentage: 92,
  },
  {
    id: "player3",
    name: "David Smith",
    position: "Prop",
    age: 26,
    height: "6'2\"",
    weight: "115kg",
    experience: "8 years",
    profileImage: "/placeholder.svg?height=100&width=100",
    expressedInterestDate: "2023-05-08T11:45:00Z",
    opportunity: {
      id: "opp3",
      title: "Prop position",
      status: "open",
    },
    status: "in_discussion",
    notes: "Strong scrummager, good work rate",
    lastContact: "2023-05-14T16:30:00Z",
    matchPercentage: 78,
  },
  {
    id: "player4",
    name: "Robert Brown",
    position: "Lock",
    age: 25,
    height: "6'6\"",
    weight: "118kg",
    experience: "6 years",
    profileImage: "/placeholder.svg?height=100&width=100",
    expressedInterestDate: "2023-05-05T09:10:00Z",
    opportunity: {
      id: "opp4",
      title: "Lock position",
      status: "open",
    },
    status: "trial_scheduled",
    notes: "Great lineout jumper, physical in defense",
    lastContact: "2023-05-13T10:20:00Z",
    matchPercentage: 88,
  },
  {
    id: "player5",
    name: "Thomas Williams",
    position: "Flanker",
    age: 23,
    height: "6'3\"",
    weight: "105kg",
    experience: "5 years",
    profileImage: "/placeholder.svg?height=100&width=100",
    expressedInterestDate: "2023-05-03T13:25:00Z",
    opportunity: {
      id: "opp5",
      title: "Flanker position",
      status: "open",
    },
    status: "offer_made",
    notes: "Excellent at the breakdown, high work rate",
    lastContact: "2023-05-15T11:40:00Z",
    matchPercentage: 95,
  },
  {
    id: "player6",
    name: "Daniel Jones",
    position: "Number 8",
    age: 27,
    height: "6'4\"",
    weight: "112kg",
    experience: "9 years",
    profileImage: "/placeholder.svg?height=100&width=100",
    expressedInterestDate: "2023-05-01T15:50:00Z",
    opportunity: {
      id: "opp6",
      title: "Number 8 position",
      status: "open",
    },
    status: "rejected",
    notes: "Strong ball carrier, good handling skills",
    lastContact: "2023-05-10T14:15:00Z",
    matchPercentage: 72,
  },
]

export function InterestedPlayersList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [positionFilter, setPositionFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  // Filter players based on search query, status, and position
  const filteredPlayers = interestedPlayers.filter((player) => {
    // Apply search filter
    if (
      searchQuery &&
      !player.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !player.position.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Apply status filter
    if (statusFilter !== "all" && player.status !== statusFilter) {
      return false
    }

    // Apply position filter
    if (positionFilter !== "all" && player.position !== positionFilter) {
      return false
    }

    return true
  })

  // Sort players based on selected sort option
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.expressedInterestDate).getTime() - new Date(a.expressedInterestDate).getTime()
      case "match":
        return b.matchPercentage - a.matchPercentage
      case "name":
        return a.name.localeCompare(b.name)
      case "position":
        return a.position.localeCompare(b.position)
      default:
        return 0
    }
  })

  // Get unique positions for filter dropdown
  const uniquePositions = Array.from(new Set(interestedPlayers.map((player) => player.position)))

  // Get status counts for tabs
  const statusCounts = {
    all: interestedPlayers.length,
    new: interestedPlayers.filter((player) => player.status === "new").length,
    contacted: interestedPlayers.filter((player) => player.status === "contacted").length,
    in_discussion: interestedPlayers.filter((player) => player.status === "in_discussion").length,
    trial_scheduled: interestedPlayers.filter((player) => player.status === "trial_scheduled").length,
    offer_made: interestedPlayers.filter((player) => player.status === "offer_made").length,
    rejected: interestedPlayers.filter((player) => player.status === "rejected").length,
  }

  // Format status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case "new":
        return "New"
      case "contacted":
        return "Contacted"
      case "in_discussion":
        return "In Discussion"
      case "trial_scheduled":
        return "Trial Scheduled"
      case "offer_made":
        return "Offer Made"
      case "rejected":
        return "Rejected"
      default:
        return status
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "contacted":
        return "bg-purple-500"
      case "in_discussion":
        return "bg-yellow-500"
      case "trial_scheduled":
        return "bg-orange-500"
      case "offer_made":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interested Players</CardTitle>
        <CardDescription>Manage players who have expressed interest in opportunities at your club.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search players..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Positions</SelectLabel>
                    <SelectItem value="all">All Positions</SelectItem>
                    {uniquePositions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort Options</SelectLabel>
                    <SelectItem value="date">Date (Newest First)</SelectItem>
                    <SelectItem value="match">Match Percentage</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="position">Position</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status tabs */}
          <Tabs defaultValue="all" onValueChange={setStatusFilter}>
            <TabsList className="w-full overflow-x-auto">
              <TabsTrigger value="all">
                All <Badge className="ml-2">{statusCounts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="new">
                New <Badge className="ml-2">{statusCounts.new}</Badge>
              </TabsTrigger>
              <TabsTrigger value="contacted">
                Contacted <Badge className="ml-2">{statusCounts.contacted}</Badge>
              </TabsTrigger>
              <TabsTrigger value="in_discussion">
                In Discussion <Badge className="ml-2">{statusCounts.in_discussion}</Badge>
              </TabsTrigger>
              <TabsTrigger value="trial_scheduled">
                Trial <Badge className="ml-2">{statusCounts.trial_scheduled}</Badge>
              </TabsTrigger>
              <TabsTrigger value="offer_made">
                Offer Made <Badge className="ml-2">{statusCounts.offer_made}</Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected <Badge className="ml-2">{statusCounts.rejected}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* Player cards */}
            <TabsContent value={statusFilter} className="mt-6">
              {sortedPlayers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedPlayers.map((player) => (
                    <Card key={player.id} className="overflow-hidden">
                      <div className="flex justify-between items-start p-4">
                        <div className="flex items-center">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                            <Image
                              src={player.profileImage || "/placeholder.svg"}
                              alt={player.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              <Link href={`/players/${player.id}`} className="hover:underline">
                                {player.name}
                              </Link>
                            </h3>
                            <p className="text-sm text-muted-foreground">{player.position}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge className={`${getStatusColor(player.status)} text-white mr-2`}>
                            {formatStatus(player.status)}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Link href={`/players/${player.id}`} className="flex items-center w-full">
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  View Profile
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link href={`/messages?player=${player.id}`} className="flex items-center w-full">
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Send Message
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Update Status
                              </DropdownMenuItem>
                              <DropdownMenuItem>Add Note</DropdownMenuItem>
                              <DropdownMenuItem>Schedule Trial</DropdownMenuItem>
                              <DropdownMenuItem>Make Offer</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CardContent className="p-4 pt-0">
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Age:</span> {player.age}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Height:</span> {player.height}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Weight:</span> {player.weight}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Experience:</span> {player.experience}
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="text-sm text-muted-foreground mb-1">Match Percentage</div>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{ width: `${player.matchPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{player.matchPercentage}%</span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="text-sm text-muted-foreground mb-1">Opportunity</div>
                          <div className="font-medium">{player.opportunity.title}</div>
                        </div>
                        <div className="mb-3">
                          <div className="text-sm text-muted-foreground mb-1">Expressed Interest</div>
                          <div>{format(new Date(player.expressedInterestDate), "PPP")}</div>
                        </div>
                        {player.notes && (
                          <div className="mb-3">
                            <div className="text-sm text-muted-foreground mb-1">Notes</div>
                            <div className="text-sm">{player.notes}</div>
                          </div>
                        )}
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <Link href={`/players/${player.id}`}>View Profile</Link>
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1 bg-[#1e4620] hover:bg-[#2a5f2d]"
                            asChild
                          >
                            <Link href={`/messages?player=${player.id}`}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Message
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <UserPlus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No players found</h3>
                  <p className="text-muted-foreground mb-4">
                    No players match your current filters. Try adjusting your search or filters.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                      setPositionFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
