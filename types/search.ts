export type EntityType = "player" | "coach" | "club"

export type SearchFilters = {
  entityType: EntityType[]
  location?: string
  position?: string[]
  ageRange?: [number, number]
  experience?: number
  availability?: string[]
  skillLevel?: string[]
  query: string
}

export type PlayerResult = {
  id: string
  type: "player"
  name: string
  age: number
  position: string
  location: string
  experience: number
  skillLevel: string
  availability: string
  imageUrl?: string
  stats: {
    matches: number
    tries: number
    tackles: number
    [key: string]: number
  }
  verified: boolean
}

export type CoachResult = {
  id: string
  type: "coach"
  name: string
  specialization: string[]
  experience: number
  location: string
  qualifications: string[]
  imageUrl?: string
  verified: boolean
}

export type ClubResult = {
  id: string
  type: "club"
  name: string
  location: string
  division: string
  established: number
  facilities: string[]
  imageUrl?: string
  verified: boolean
  openPositions?: string[]
}

export type SearchResult = PlayerResult | CoachResult | ClubResult
