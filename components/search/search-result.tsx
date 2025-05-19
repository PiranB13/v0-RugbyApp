import type { SearchResult } from "@/types/search"
import { PlayerCard } from "./player-card"
import { CoachCard } from "./coach-card"
import { ClubCard } from "./club-card"

interface SearchResultProps {
  result: SearchResult
}

export function SearchResultCard({ result }: SearchResultProps) {
  switch (result.type) {
    case "player":
      return <PlayerCard player={result} />
    case "coach":
      return <CoachCard coach={result} />
    case "club":
      return <ClubCard club={result} />
    default:
      return null
  }
}
