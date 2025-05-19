import type { SearchFilters, SearchResult } from "@/types/search"

// Mock data for positions
export function getPositions() {
  return ["Prop", "Hooker", "Lock", "Flanker", "Number 8", "Scrum-half", "Fly-half", "Center", "Wing", "Full-back"]
}

// Mock data for skill levels
export function getSkillLevels() {
  return ["Amateur", "Semi-Professional", "Professional", "Youth", "Senior", "Elite"]
}

// Mock data for availabilities
export function getAvailabilities() {
  return ["Available", "Limited Availability", "Not Available", "Recruiting", "Open for Trials"]
}

// Mock data for locations
export function getLocations() {
  return ["North", "South", "East", "West", "Central", "International"]
}

// This would be replaced with a real API call in a production app
export async function searchEntities(
  filters: SearchFilters,
  page = 1,
  pageSize = 10,
): Promise<{ results: SearchResult[]; total: number }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // This is a mock implementation - in a real app, this would call your backend API
  const mockResults: SearchResult[] = [
    {
      id: "p1",
      type: "player",
      name: "James Wilson",
      age: 24,
      position: "Fly-half",
      location: "North",
      experience: 6,
      skillLevel: "Semi-Professional",
      availability: "Available",
      imageUrl: "/rugby-player-action.png",
      stats: {
        matches: 87,
        tries: 23,
        tackles: 156,
      },
      verified: true,
    },
    {
      id: "p2",
      type: "player",
      name: "Sarah Johnson",
      age: 22,
      position: "Wing",
      location: "South",
      experience: 4,
      skillLevel: "Professional",
      availability: "Limited Availability",
      stats: {
        matches: 45,
        tries: 18,
        tackles: 92,
      },
    },
    // Add more mock results here
  ]

  // Apply filters
  let filtered = [...mockResults]

  // Filter by query
  if (filters.query) {
    const query = filters.query.toLowerCase()
    filtered = filtered.filter(
      (result) =>
        result.name.toLowerCase().includes(query) || (result.position && result.position.toLowerCase().includes(query)),
    )
  }

  // Filter by entity type
  if (filters.entityType.length > 0) {
    filtered = filtered.filter((result) => filters.entityType.includes(result.type))
  }

  // Apply pagination
  const total = filtered.length
  const start = (page - 1) * pageSize
  const paginatedResults = filtered.slice(start, start + pageSize)

  return {
    results: paginatedResults,
    total,
  }
}
