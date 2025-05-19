"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, User, Users, Building, MapPin, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchFiltersProps {
  activeFilters: {
    types: string[]
    positions: string[]
    regions: string[]
    availabilities: string[]
    levels: string[]
  }
  toggleFilter: <T extends keyof SearchFiltersProps["activeFilters"]>(
    filterType: T,
    value: SearchFiltersProps["activeFilters"][T][number],
  ) => void
  positions: string[]
  regions: string[]
  availabilities: string[]
  levels: string[]
}

export function SearchFilters({
  activeFilters,
  toggleFilter,
  positions,
  regions,
  availabilities,
  levels,
}: SearchFiltersProps) {
  return (
    <>
      {/* Role Type Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("h-9", activeFilters.types.length > 0 && "bg-primary/5 border-primary/20")}
          >
            Role
            {activeFilters.types.length > 0 && (
              <span className="ml-1 text-xs bg-primary/10 text-primary rounded-full px-1.5">
                {activeFilters.types.length}
              </span>
            )}
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Role Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="p-0">
              <label className="flex items-center space-x-2 px-2 py-1.5 w-full cursor-pointer">
                <Checkbox
                  checked={activeFilters.types.includes("player")}
                  onCheckedChange={() => toggleFilter("types", "player")}
                />
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Players</span>
                </div>
              </label>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <label className="flex items-center space-x-2 px-2 py-1.5 w-full cursor-pointer">
                <Checkbox
                  checked={activeFilters.types.includes("coach")}
                  onCheckedChange={() => toggleFilter("types", "coach")}
                />
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Coaches</span>
                </div>
              </label>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <label className="flex items-center space-x-2 px-2 py-1.5 w-full cursor-pointer">
                <Checkbox
                  checked={activeFilters.types.includes("club")}
                  onCheckedChange={() => toggleFilter("types", "club")}
                />
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>Clubs</span>
                </div>
              </label>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Position Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("h-9", activeFilters.positions.length > 0 && "bg-primary/5 border-primary/20")}
          >
            Position
            {activeFilters.positions.length > 0 && (
              <span className="ml-1 text-xs bg-primary/10 text-primary rounded-full px-1.5">
                {activeFilters.positions.length}
              </span>
            )}
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Position</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-[300px] overflow-y-auto">
            {positions.map((position) => (
              <DropdownMenuItem key={position} className="p-0">
                <label className="flex items-center space-x-2 px-2 py-1.5 w-full cursor-pointer">
                  <Checkbox
                    checked={activeFilters.positions.includes(position)}
                    onCheckedChange={() => toggleFilter("positions", position)}
                  />
                  <span>{position}</span>
                </label>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Region Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("h-9", activeFilters.regions.length > 0 && "bg-primary/5 border-primary/20")}
          >
            <MapPin className="mr-1 h-4 w-4" />
            Region
            {activeFilters.regions.length > 0 && (
              <span className="ml-1 text-xs bg-primary/10 text-primary rounded-full px-1.5">
                {activeFilters.regions.length}
              </span>
            )}
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Region</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {regions.map((region) => (
            <DropdownMenuItem key={region} className="p-0">
              <label className="flex items-center space-x-2 px-2 py-1.5 w-full cursor-pointer">
                <Checkbox
                  checked={activeFilters.regions.includes(region)}
                  onCheckedChange={() => toggleFilter("regions", region)}
                />
                <span>{region}</span>
              </label>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Availability Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("h-9", activeFilters.availabilities.length > 0 && "bg-primary/5 border-primary/20")}
          >
            <Clock className="mr-1 h-4 w-4" />
            Availability
            {activeFilters.availabilities.length > 0 && (
              <span className="ml-1 text-xs bg-primary/10 text-primary rounded-full px-1.5">
                {activeFilters.availabilities.length}
              </span>
            )}
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Availability</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availabilities.map((availability) => (
            <DropdownMenuItem key={availability} className="p-0">
              <label className="flex items-center space-x-2 px-2 py-1.5 w-full cursor-pointer">
                <Checkbox
                  checked={activeFilters.availabilities.includes(availability)}
                  onCheckedChange={() => toggleFilter("availabilities", availability)}
                />
                <span>{availability}</span>
              </label>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Level Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("h-9", activeFilters.levels.length > 0 && "bg-primary/5 border-primary/20")}
          >
            Level
            {activeFilters.levels.length > 0 && (
              <span className="ml-1 text-xs bg-primary/10 text-primary rounded-full px-1.5">
                {activeFilters.levels.length}
              </span>
            )}
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Level of Play</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {levels.map((level) => (
            <DropdownMenuItem key={level} className="p-0">
              <label className="flex items-center space-x-2 px-2 py-1.5 w-full cursor-pointer">
                <Checkbox
                  checked={activeFilters.levels.includes(level)}
                  onCheckedChange={() => toggleFilter("levels", level)}
                />
                <span>{level}</span>
              </label>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
