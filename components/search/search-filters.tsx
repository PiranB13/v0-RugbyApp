"use client"

import { useState } from "react"
import type { SearchFilters, EntityType } from "@/types/search"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { getPositions, getSkillLevels, getAvailabilities, getLocations } from "@/services/search-service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { X, Filter, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SearchFiltersProps {
  filters: SearchFilters
  onFilterChange: (filters: SearchFilters) => void
  onReset: () => void
  className?: string
}

export function SearchFilters({ filters, onFilterChange, onReset, className = "" }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const positions = getPositions()
  const skillLevels = getSkillLevels()
  const availabilities = getAvailabilities()
  const locations = getLocations()

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onFilterChange({
      ...filters,
      [key]: value,
    })
  }

  const toggleEntityType = (type: EntityType) => {
    const currentTypes = [...filters.entityType]
    const index = currentTypes.indexOf(type)

    if (index === -1) {
      currentTypes.push(type)
    } else {
      currentTypes.splice(index, 1)
    }

    updateFilter("entityType", currentTypes)
  }

  const togglePosition = (position: string) => {
    const currentPositions = [...(filters.position || [])]
    const index = currentPositions.indexOf(position)

    if (index === -1) {
      currentPositions.push(position)
    } else {
      currentPositions.splice(index, 1)
    }

    updateFilter("position", currentPositions)
  }

  const toggleSkillLevel = (level: string) => {
    const currentLevels = [...(filters.skillLevel || [])]
    const index = currentLevels.indexOf(level)

    if (index === -1) {
      currentLevels.push(level)
    } else {
      currentLevels.splice(index, 1)
    }

    updateFilter("skillLevel", currentLevels)
  }

  const toggleAvailability = (availability: string) => {
    const currentAvailabilities = [...(filters.availability || [])]
    const index = currentAvailabilities.indexOf(availability)

    if (index === -1) {
      currentAvailabilities.push(availability)
    } else {
      currentAvailabilities.splice(index, 1)
    }

    updateFilter("availability", currentAvailabilities)
  }

  const getActiveFilterCount = (): number => {
    let count = 0
    if (filters.entityType.length > 0 && filters.entityType.length < 3) count++
    if (filters.location) count++
    if (filters.position && filters.position.length > 0) count++
    if (filters.ageRange && (filters.ageRange[0] > 18 || filters.ageRange[1] < 50)) count++
    if (filters.experience !== undefined) count++
    if (filters.skillLevel && filters.skillLevel.length > 0) count++
    if (filters.availability && filters.availability.length > 0) count++
    return count
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <div className={cn("bg-white rounded-lg shadow", className)}>
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="font-normal">
              {activeFilterCount} active
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </Button>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className={`md:block ${isOpen ? "block" : "hidden"}`}>
        <Accordion type="multiple" defaultValue={["entity-type", "location"]}>
          <AccordionItem value="entity-type">
            <AccordionTrigger className="px-4">Entity Type</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="entity-player"
                    checked={filters.entityType.includes("player")}
                    onCheckedChange={() => toggleEntityType("player")}
                  />
                  <Label htmlFor="entity-player">Players</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="entity-coach"
                    checked={filters.entityType.includes("coach")}
                    onCheckedChange={() => toggleEntityType("coach")}
                  />
                  <Label htmlFor="entity-coach">Coaches</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="entity-club"
                    checked={filters.entityType.includes("club")}
                    onCheckedChange={() => toggleEntityType("club")}
                  />
                  <Label htmlFor="entity-club">Clubs</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="location">
            <AccordionTrigger className="px-4">Location</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <Select
                value={filters.location || ""}
                onValueChange={(value) => updateFilter("location", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any location</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          {(filters.entityType.includes("player") || filters.entityType.length === 0) && (
            <>
              <AccordionItem value="position">
                <AccordionTrigger className="px-4">Position</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {positions.map((position) => (
                      <div key={position} className="flex items-center space-x-2">
                        <Checkbox
                          id={`position-${position}`}
                          checked={filters.position?.includes(position) || false}
                          onCheckedChange={() => togglePosition(position)}
                        />
                        <Label htmlFor={`position-${position}`}>{position}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="age-range">
                <AccordionTrigger className="px-4">Age Range</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[18, 50]}
                      value={filters.ageRange || [18, 50]}
                      min={18}
                      max={50}
                      step={1}
                      onValueChange={(value) => updateFilter("ageRange", value as [number, number])}
                    />
                    <div className="flex justify-between">
                      <span>{filters.ageRange?.[0] || 18} years</span>
                      <span>{filters.ageRange?.[1] || 50} years</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="skill-level">
                <AccordionTrigger className="px-4">Skill Level</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="flex flex-col gap-2">
                    {skillLevels.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${level}`}
                          checked={filters.skillLevel?.includes(level) || false}
                          onCheckedChange={() => toggleSkillLevel(level)}
                        />
                        <Label htmlFor={`skill-${level}`}>{level}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="availability">
                <AccordionTrigger className="px-4">Availability</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="flex flex-col gap-2">
                    {availabilities.map((availability) => (
                      <div key={availability} className="flex items-center space-x-2">
                        <Checkbox
                          id={`availability-${availability}`}
                          checked={filters.availability?.includes(availability) || false}
                          onCheckedChange={() => toggleAvailability(availability)}
                        />
                        <Label htmlFor={`availability-${availability}`}>{availability}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </>
          )}

          {(filters.entityType.includes("player") ||
            filters.entityType.includes("coach") ||
            filters.entityType.length === 0) && (
            <AccordionItem value="experience">
              <AccordionTrigger className="px-4">Experience</AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <Slider
                    defaultValue={[0]}
                    value={filters.experience !== undefined ? [filters.experience] : [0]}
                    min={0}
                    max={20}
                    step={1}
                    onValueChange={(value) => updateFilter("experience", value[0])}
                  />
                  <div className="flex justify-between">
                    <span>Min {filters.experience || 0} years</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  )
}
