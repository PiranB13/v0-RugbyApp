"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { SearchFilters, SearchResult, EntityType } from "@/types/search"
import { searchEntities } from "@/services/search-service"
import { SearchFilters as SearchFiltersComponent } from "@/components/search/search-filters"
import { SearchResultCard } from "@/components/search/search-result"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { Search, Users, UserCog, Building, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const PAGE_SIZE = 9

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [filters, setFilters] = useState<SearchFilters>({
    entityType: parseEntityTypes(searchParams.get("type")),
    location: searchParams.get("location") || undefined,
    position: parseArrayParam(searchParams.get("position")),
    ageRange: parseAgeRange(searchParams.get("age")),
    experience: searchParams.get("experience") ? Number.parseInt(searchParams.get("experience")!) : undefined,
    skillLevel: parseArrayParam(searchParams.get("skill")),
    availability: parseArrayParam(searchParams.get("availability")),
    query: searchParams.get("q") || "",
  })
  const [results, setResults] = useState<SearchResult[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(Number.parseInt(searchParams.get("page") || "1"))
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "relevance")

  // Parse URL parameters
  function parseEntityTypes(param: string | null): EntityType[] {
    if (!param) return ["player", "coach", "club"]
    return param.split(",").filter((t) => ["player", "coach", "club"].includes(t)) as EntityType[]
  }

  function parseArrayParam(param: string | null): string[] | undefined {
    if (!param) return undefined
    return param.split(",")
  }

  function parseAgeRange(param: string | null): [number, number] | undefined {
    if (!param) return undefined
    const [min, max] = param.split("-").map(Number)
    if (isNaN(min) || isNaN(max)) return undefined
    return [min, max]
  }

  // Update URL with current filters
  const updateUrl = () => {
    const params = new URLSearchParams()

    if (filters.query) params.set("q", filters.query)
    if (filters.entityType.length > 0 && filters.entityType.length < 3) {
      params.set("type", filters.entityType.join(","))
    }
    if (filters.location) params.set("location", filters.location)
    if (filters.position && filters.position.length > 0) params.set("position", filters.position.join(","))
    if (filters.ageRange) params.set("age", `${filters.ageRange[0]}-${filters.ageRange[1]}`)
    if (filters.experience !== undefined) params.set("experience", filters.experience.toString())
    if (filters.skillLevel && filters.skillLevel.length > 0) params.set("skill", filters.skillLevel.join(","))
    if (filters.availability && filters.availability.length > 0)
      params.set("availability", filters.availability.join(","))
    if (currentPage > 1) params.set("page", currentPage.toString())
    if (sortBy !== "relevance") params.set("sort", sortBy)

    router.push(`/search?${params.toString()}`)
  }

  // Fetch search results
  const fetchResults = async () => {
    setIsLoading(true)
    try {
      const { results, total } = await searchEntities(filters, currentPage, PAGE_SIZE)
      setResults(results)
      setTotalResults(total)
    } catch (error) {
      console.error("Error fetching search results:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ ...filters, query: searchQuery })
    setCurrentPage(1)
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      entityType: ["player", "coach", "club"],
      query: searchQuery,
    })
    setCurrentPage(1)
    setSortBy("relevance")
  }

  // Update URL when filters or pagination changes
  useEffect(() => {
    updateUrl()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage, sortBy])

  // Fetch results when URL params change
  useEffect(() => {
    fetchResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage, sortBy])

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / PAGE_SIZE)

  // Get entity type counts
  const getEntityTypeCounts = () => {
    const counts = {
      player: 0,
      coach: 0,
      club: 0,
    }

    results.forEach((result) => {
      counts[result.type]++
    })

    return counts
  }

  const entityCounts = getEntityTypeCounts()

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search players, coaches, clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <SearchFiltersComponent
            filters={filters}
            onFilterChange={setFilters}
            onReset={resetFilters}
            className="sticky top-4"
          />
        </div>

        {/* Search results */}
        <div className="flex-grow">
          {/* Results header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div>
              <h2 className="text-lg font-medium">{isLoading ? "Searching..." : `${totalResults} results found`}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                {entityCounts.player > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {entityCounts.player} Players
                  </Badge>
                )}
                {entityCounts.coach > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <UserCog className="h-3 w-3" />
                    {entityCounts.coach} Coaches
                  </Badge>
                )}
                {entityCounts.club > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {entityCounts.club} Clubs
                  </Badge>
                )}
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="experience_desc">Experience (High to Low)</SelectItem>
                  <SelectItem value="experience_asc">Experience (Low to High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result) => (
                <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-medium">No results found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={resetFilters} className="mt-4">
                Reset Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
