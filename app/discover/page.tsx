"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  User,
  Users,
  Building,
  Clock,
  Filter,
  SlidersHorizontal,
  SearchIcon,
  BookmarkPlus,
  ArrowUpDown,
  X,
  Grid,
  Map,
  Locate,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { SearchFilters } from "@/components/discover/search-filters"
import { MobileFilters } from "@/components/discover/mobile-filters"
import dynamic from "next/dynamic"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

// Dynamically import the MapView component with no SSR
const MapView = dynamic(() => import("@/components/discover/map-view").then((mod) => mod.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-muted/30">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p>Loading map component...</p>
      </div>
    </div>
  ),
})

// Mock data types
type EntityType = "player" | "coach" | "club"
type Position =
  | "Prop"
  | "Hooker"
  | "Lock"
  | "Flanker"
  | "Number 8"
  | "Scrum-half"
  | "Fly-half"
  | "Center"
  | "Wing"
  | "Full-back"
type Region = "North" | "South" | "East" | "West" | "Central" | "International"
type Availability = "Available" | "Limited Availability" | "Not Available" | "Recruiting" | "Open for Trials"
type Level = "Amateur" | "Semi-Professional" | "Professional" | "Youth" | "Senior" | "Elite"

interface SearchResult {
  id: string
  type: EntityType
  name: string
  position?: Position
  region: Region
  availability: Availability
  level: Level
  imageUrl?: string
  lastActive: string
  distance?: number
  isVerified?: boolean
  location: {
    lat: number
    lng: number
    address?: string
  }
}

// Mock data with location coordinates
const mockResults: SearchResult[] = [
  {
    id: "p1",
    type: "player",
    name: "James Wilson",
    position: "Fly-half",
    region: "North",
    availability: "Available",
    level: "Semi-Professional",
    imageUrl: "/rugby-player-action.png",
    lastActive: "2 days ago",
    distance: 5.2,
    isVerified: true,
    location: {
      lat: 51.5074,
      lng: -0.1278,
      address: "London, UK",
    },
  },
  {
    id: "p2",
    type: "player",
    name: "Sarah Johnson",
    position: "Wing",
    region: "South",
    availability: "Limited Availability",
    level: "Professional",
    lastActive: "5 hours ago",
    distance: 12.8,
    location: {
      lat: 51.4816,
      lng: -0.1903,
      address: "Fulham, London, UK",
    },
  },
  {
    id: "c1",
    type: "coach",
    name: "Michael Thompson",
    region: "Central",
    availability: "Available",
    level: "Professional",
    imageUrl: "/placeholder-l9p2e.png",
    lastActive: "1 day ago",
    distance: 8.3,
    isVerified: true,
    location: {
      lat: 51.5287,
      lng: -0.1051,
      address: "Islington, London, UK",
    },
  },
  {
    id: "cl1",
    type: "club",
    name: "Northside Rugby Club",
    region: "North",
    availability: "Recruiting",
    level: "Semi-Professional",
    imageUrl: "/generic-rugby-logo.png",
    lastActive: "Just now",
    distance: 3.7,
    isVerified: true,
    location: {
      lat: 51.5762,
      lng: -0.0982,
      address: "Tottenham, London, UK",
    },
  },
  {
    id: "p3",
    type: "player",
    name: "David Chen",
    position: "Prop",
    region: "East",
    availability: "Available",
    level: "Amateur",
    lastActive: "3 days ago",
    distance: 15.1,
    location: {
      lat: 51.5392,
      lng: 0.0628,
      address: "Barking, London, UK",
    },
  },
  {
    id: "c2",
    type: "coach",
    name: "Elizabeth Parker",
    region: "West",
    availability: "Limited Availability",
    level: "Elite",
    imageUrl: "/female-rugby-coach.png",
    lastActive: "1 week ago",
    distance: 20.4,
    location: {
      lat: 51.4479,
      lng: -0.3235,
      address: "Richmond, London, UK",
    },
  },
  {
    id: "cl2",
    type: "club",
    name: "Westside Warriors",
    region: "West",
    availability: "Open for Trials",
    level: "Youth",
    imageUrl: "/youth-rugby-logo.png",
    lastActive: "2 days ago",
    distance: 7.9,
    location: {
      lat: 51.4813,
      lng: -0.2087,
      address: "Hammersmith, London, UK",
    },
  },
  {
    id: "p4",
    type: "player",
    name: "Thomas Wright",
    position: "Scrum-half",
    region: "South",
    availability: "Not Available",
    level: "Professional",
    imageUrl: "/rugby-scrum-half.png",
    lastActive: "4 hours ago",
    distance: 9.3,
    isVerified: true,
    location: {
      lat: 51.4613,
      lng: -0.1156,
      address: "Brixton, London, UK",
    },
  },
  {
    id: "p5",
    type: "player",
    name: "Emma Lewis",
    position: "Center",
    region: "Central",
    availability: "Available",
    level: "Semi-Professional",
    imageUrl: "/female-rugby-player.png",
    lastActive: "Yesterday",
    distance: 4.6,
    location: {
      lat: 51.5245,
      lng: -0.0886,
      address: "Shoreditch, London, UK",
    },
  },
  {
    id: "cl3",
    type: "club",
    name: "Eastside Eagles",
    region: "East",
    availability: "Recruiting",
    level: "Amateur",
    lastActive: "3 days ago",
    distance: 11.2,
    location: {
      lat: 51.5465,
      lng: 0.0353,
      address: "Stratford, London, UK",
    },
  },
  {
    id: "c3",
    type: "coach",
    name: "Robert Davies",
    region: "North",
    availability: "Available",
    level: "Amateur",
    lastActive: "6 hours ago",
    distance: 6.8,
    location: {
      lat: 51.5504,
      lng: -0.1052,
      address: "Camden, London, UK",
    },
  },
  {
    id: "p6",
    type: "player",
    name: "Olivia Martinez",
    position: "Flanker",
    region: "South",
    availability: "Limited Availability",
    level: "Youth",
    lastActive: "2 days ago",
    distance: 14.3,
    location: {
      lat: 51.4305,
      lng: -0.0766,
      address: "Crystal Palace, London, UK",
    },
  },
]

// Filter options
const positions: Position[] = [
  "Prop",
  "Hooker",
  "Lock",
  "Flanker",
  "Number 8",
  "Scrum-half",
  "Fly-half",
  "Center",
  "Wing",
  "Full-back",
]
const regions: Region[] = ["North", "South", "East", "West", "Central", "International"]
const availabilities: Availability[] = [
  "Available",
  "Limited Availability",
  "Not Available",
  "Recruiting",
  "Open for Trials",
]
const levels: Level[] = ["Amateur", "Semi-Professional", "Professional", "Youth", "Senior", "Elite"]

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<{
    types: EntityType[]
    positions: Position[]
    regions: Region[]
    availabilities: Availability[]
    levels: Level[]
  }>({
    types: [],
    positions: [],
    regions: [],
    availabilities: [],
    levels: [],
  })
  const [sortBy, setSortBy] = useState<"relevance" | "distance" | "recent">("relevance")
  const [results, setResults] = useState<SearchResult[]>(mockResults)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [isLocating, setIsLocating] = useState(false)
  const { toast } = useToast()

  // Filter results based on active filters
  useEffect(() => {
    let filtered = [...mockResults]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (result) =>
          result.name.toLowerCase().includes(query) ||
          (result.position && result.position.toLowerCase().includes(query)),
      )
    }

    // Apply type filters
    if (activeFilters.types.length > 0) {
      filtered = filtered.filter((result) => activeFilters.types.includes(result.type))
    }

    // Apply position filters (only for players)
    if (activeFilters.positions.length > 0) {
      filtered = filtered.filter(
        (result) => result.type !== "player" || (result.position && activeFilters.positions.includes(result.position)),
      )
    }

    // Apply region filters
    if (activeFilters.regions.length > 0) {
      filtered = filtered.filter((result) => activeFilters.regions.includes(result.region))
    }

    // Apply availability filters
    if (activeFilters.availabilities.length > 0) {
      filtered = filtered.filter((result) => activeFilters.availabilities.includes(result.availability))
    }

    // Apply level filters
    if (activeFilters.levels.length > 0) {
      filtered = filtered.filter((result) => activeFilters.levels.includes(result.level))
    }

    // Apply sorting
    if (sortBy === "distance") {
      filtered.sort((a, b) => (a.distance || 999) - (b.distance || 999))
    } else if (sortBy === "recent") {
      // This is just a mock sort based on lastActive
      // In a real app, you'd sort by actual timestamps
      const getTimeValue = (time: string): number => {
        if (time.includes("Just now")) return 0
        if (time.includes("hours")) return Number.parseInt(time) * 3600
        if (time.includes("day")) return Number.parseInt(time) * 86400
        if (time.includes("week")) return Number.parseInt(time) * 604800
        return 999999
      }
      filtered.sort((a, b) => getTimeValue(a.lastActive) - getTimeValue(b.lastActive))
    }

    setResults(filtered)
  }, [searchQuery, activeFilters, sortBy])

  const toggleFilter = <T extends keyof typeof activeFilters>(
    filterType: T,
    value: (typeof activeFilters)[T][number],
  ) => {
    setActiveFilters((prev) => {
      const current = [...prev[filterType]] as (typeof activeFilters)[T]
      const index = current.indexOf(value)

      if (index === -1) {
        current.push(value)
      } else {
        current.splice(index, 1)
      }

      return {
        ...prev,
        [filterType]: current,
      }
    })
  }

  const clearFilters = () => {
    setActiveFilters({
      types: [],
      positions: [],
      regions: [],
      availabilities: [],
      levels: [],
    })
    setSearchQuery("")
  }

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((count, filters) => count + filters.length, 0)
  }

  const activeFilterCount = getActiveFilterCount()

  // Function to get user's location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      })
      return
    }

    setIsLocating(true)

    // Switch to map view if not already in map view
    if (viewMode !== "map") {
      setViewMode("map")
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success - the map component will handle the actual centering
        setIsLocating(false)
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location."

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied. Please enable location services."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "The request to get your location timed out."
            break
        }

        toast({
          title: "Location error",
          description: errorMessage,
          variant: "destructive",
        })

        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Discover</h1>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="md:hidden" onClick={() => setShowMobileFilters(true)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            <div className="hidden md:flex items-center gap-2">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "map")} className="h-9">
                <TabsList className="h-8">
                  <TabsTrigger value="grid" className="text-xs h-8 px-3">
                    <Grid className="h-3.5 w-3.5 mr-1" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="map" className="text-xs h-8 px-3">
                    <Map className="h-3.5 w-3.5 mr-1" />
                    Map
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {viewMode === "map" && (
                <Button variant="outline" size="sm" className="h-8" onClick={getUserLocation} disabled={isLocating}>
                  <Locate className={`h-3.5 w-3.5 mr-1 ${isLocating ? "animate-pulse" : ""}`} />
                  {isLocating ? "Locating..." : "My Location"}
                </Button>
              )}

              <div className="flex items-center gap-1">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sort:</span>
              </div>

              <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)} className="h-9">
                <TabsList className="h-8">
                  <TabsTrigger value="relevance" className="text-xs h-8">
                    Relevance
                  </TabsTrigger>
                  <TabsTrigger value="distance" className="text-xs h-8">
                    Closest
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="text-xs h-8">
                    Recent
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Search and filter bar */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search players, coaches, clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="hidden md:flex items-center gap-2 flex-wrap">
              <SearchFilters
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                positions={positions}
                regions={regions}
                availabilities={availabilities}
                levels={levels}
              />

              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="md:hidden">
              <div className="flex flex-wrap gap-1 mt-2">
                {activeFilterCount > 0 ? (
                  <>
                    <Badge variant="outline" className="bg-muted/50">
                      {activeFilterCount} filters active
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-6 px-2 text-xs text-muted-foreground"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">No filters applied</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile view mode toggle */}
        <div className="md:hidden flex justify-between items-center">
          <div className="text-sm text-muted-foreground">{results.length} results found</div>

          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "map")} className="h-8">
              <TabsList className="h-7">
                <TabsTrigger value="grid" className="text-xs h-7 px-2">
                  <Grid className="h-3 w-3 mr-1" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="map" className="text-xs h-7 px-2">
                  <Map className="h-3 w-3 mr-1" />
                  Map
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {viewMode === "map" ? (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={getUserLocation}
                disabled={isLocating}
              >
                <Locate className={`h-3 w-3 mr-1 ${isLocating ? "animate-pulse" : ""}`} />
                {isLocating ? "Locating..." : "My Location"}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  // This would open a mobile sort dialog in a real implementation
                  const nextSort = sortBy === "relevance" ? "distance" : sortBy === "distance" ? "recent" : "relevance"
                  setSortBy(nextSort)
                }}
              >
                <ArrowUpDown className="h-3 w-3 mr-1" />
                {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </Button>
            )}
          </div>
        </div>

        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <div className="hidden md:flex flex-wrap gap-2">
            {activeFilters.types.map((type) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {type === "player" && <User className="h-3 w-3" />}
                {type === "coach" && <Users className="h-3 w-3" />}
                {type === "club" && <Building className="h-3 w-3" />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => toggleFilter("types", type)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            {activeFilters.positions.map((position) => (
              <Badge key={position} variant="secondary" className="flex items-center gap-1">
                {position}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => toggleFilter("positions", position)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            {activeFilters.regions.map((region) => (
              <Badge key={region} variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {region}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => toggleFilter("regions", region)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            {activeFilters.availabilities.map((availability) => (
              <Badge key={availability} variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {availability}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => toggleFilter("availabilities", availability)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            {activeFilters.levels.map((level) => (
              <Badge key={level} variant="secondary" className="flex items-center gap-1">
                {level}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => toggleFilter("levels", level)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Results count for desktop */}
        <div className="hidden md:block text-sm text-muted-foreground -mb-2">{results.length} results found</div>

        {/* View modes */}
        {viewMode === "grid" ? (
          /* Results grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result) => (
              <Card key={result.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="absolute top-2 right-2 z-10">
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm rounded-full">
                        <BookmarkPlus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="p-4 flex items-center gap-4">
                      <Avatar className="h-16 w-16 rounded-md border">
                        <AvatarImage
                          src={result.imageUrl || "/placeholder.svg?height=200&width=200&query=rugby"}
                          alt={result.name}
                        />
                        <AvatarFallback className="rounded-md">
                          {result.type === "player" && <User className="h-8 w-8" />}
                          {result.type === "coach" && <Users className="h-8 w-8" />}
                          {result.type === "club" && <Building className="h-8 w-8" />}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <h3 className="font-medium">{result.name}</h3>
                          {result.isVerified && (
                            <svg
                              className="h-4 w-4 text-blue-500"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                fill="currentColor"
                                fillOpacity="0.2"
                              />
                              <path
                                d="M16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z"
                                fill="currentColor"
                              />
                            </svg>
                          )}
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                          {result.type === "player" && result.position && (
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {result.position}
                            </span>
                          )}
                          {result.type === "coach" && (
                            <span className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              Coach
                            </span>
                          )}
                          {result.type === "club" && (
                            <span className="flex items-center">
                              <Building className="h-3 w-3 mr-1" />
                              Club
                            </span>
                          )}
                          <span className="mx-2">•</span>
                          <span>{result.level}</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex items-center text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {result.region}
                            {result.distance && <span className="ml-1">({result.distance.toFixed(1)} km)</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-2 pt-1 flex items-center justify-between border-t">
                    <Badge
                      variant={
                        result.availability === "Available"
                          ? "success"
                          : result.availability === "Limited Availability"
                            ? "warning"
                            : result.availability === "Not Available"
                              ? "destructive"
                              : result.availability === "Recruiting"
                                ? "default"
                                : "outline"
                      }
                      className={cn(
                        "rounded-sm text-xs font-normal",
                        result.availability === "Available" && "bg-green-100 text-green-800 hover:bg-green-100",
                        result.availability === "Limited Availability" &&
                          "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
                        result.availability === "Not Available" && "bg-red-100 text-red-800 hover:bg-red-100",
                        result.availability === "Recruiting" && "bg-blue-100 text-blue-800 hover:bg-blue-100",
                        result.availability === "Open for Trials" &&
                          "bg-purple-100 text-purple-800 hover:bg-purple-100",
                      )}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {result.availability}
                    </Badge>

                    <span className="text-xs text-muted-foreground">{result.lastActive}</span>
                  </div>
                </CardContent>

                <CardFooter className="p-3 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/${result.type}s/${result.id}`}>View Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          /* Map view */
          <div className="h-[calc(100vh-300px)] min-h-[500px] bg-muted rounded-lg overflow-hidden">
            {typeof window !== "undefined" && <MapView results={results} />}
          </div>
        )}

        {results.length === 0 && (
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium">No results found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
            {activeFilterCount > 0 && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Mobile filters dialog */}
      <MobileFilters
        show={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        clearFilters={clearFilters}
        positions={positions}
        regions={regions}
        availabilities={availabilities}
        levels={levels}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
    </div>
  )
}
