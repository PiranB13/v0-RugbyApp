"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { User, Users, Building, MapPin, Clock, ArrowUpDown } from "lucide-react"

interface MobileFiltersProps {
  show: boolean
  onClose: () => void
  activeFilters: {
    types: string[]
    positions: string[]
    regions: string[]
    availabilities: string[]
    levels: string[]
  }
  toggleFilter: <T extends keyof MobileFiltersProps["activeFilters"]>(
    filterType: T,
    value: MobileFiltersProps["activeFilters"][T][number],
  ) => void
  clearFilters: () => void
  positions: string[]
  regions: string[]
  availabilities: string[]
  levels: string[]
  sortBy: "relevance" | "distance" | "recent"
  setSortBy: (value: "relevance" | "distance" | "recent") => void
}

export function MobileFilters({
  show,
  onClose,
  activeFilters,
  toggleFilter,
  clearFilters,
  positions,
  regions,
  availabilities,
  levels,
  sortBy,
  setSortBy,
}: MobileFiltersProps) {
  const activeFilterCount = Object.values(activeFilters).reduce((count, filters) => count + filters.length, 0)

  return (
    <Sheet open={show} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] sm:max-w-md sm:h-[90vh]">
        <SheetHeader className="mb-4">
          <SheetTitle>Filters & Sort</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(85vh-10rem)] pr-4">
          <div className="space-y-6">
            {/* Sort options */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort By
              </h3>
              <RadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="relevance" id="relevance" />
                  <Label htmlFor="relevance">Relevance</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="distance" id="distance" />
                  <Label htmlFor="distance">Distance (Closest First)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recent" id="recent" />
                  <Label htmlFor="recent">Recently Active</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Role Type Filter */}
            <div>
              <h3 className="text-sm font-medium mb-3">Role Type</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="player"
                    checked={activeFilters.types.includes("player")}
                    onCheckedChange={() => toggleFilter("types", "player")}
                  />
                  <label
                    htmlFor="player"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Players
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="coach"
                    checked={activeFilters.types.includes("coach")}
                    onCheckedChange={() => toggleFilter("types", "coach")}
                  />
                  <label
                    htmlFor="coach"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Coaches
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="club"
                    checked={activeFilters.types.includes("club")}
                    onCheckedChange={() => toggleFilter("types", "club")}
                  />
                  <label
                    htmlFor="club"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Clubs
                  </label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Position Filter */}
            <div>
              <h3 className="text-sm font-medium mb-3">Position</h3>
              <div className="grid grid-cols-2 gap-2">
                {positions.map((position) => (
                  <div key={position} className="flex items-center space-x-2">
                    <Checkbox
                      id={`position-${position}`}
                      checked={activeFilters.positions.includes(position)}
                      onCheckedChange={() => toggleFilter("positions", position)}
                    />
                    <label
                      htmlFor={`position-${position}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {position}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Region Filter */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Region
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {regions.map((region) => (
                  <div key={region} className="flex items-center space-x-2">
                    <Checkbox
                      id={`region-${region}`}
                      checked={activeFilters.regions.includes(region)}
                      onCheckedChange={() => toggleFilter("regions", region)}
                    />
                    <label
                      htmlFor={`region-${region}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {region}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Availability Filter */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Availability
              </h3>
              <div className="space-y-2">
                {availabilities.map((availability) => (
                  <div key={availability} className="flex items-center space-x-2">
                    <Checkbox
                      id={`availability-${availability}`}
                      checked={activeFilters.availabilities.includes(availability)}
                      onCheckedChange={() => toggleFilter("availabilities", availability)}
                    />
                    <label
                      htmlFor={`availability-${availability}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {availability}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Level Filter */}
            <div>
              <h3 className="text-sm font-medium mb-3">Level of Play</h3>
              <div className="grid grid-cols-2 gap-2">
                {levels.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={`level-${level}`}
                      checked={activeFilters.levels.includes(level)}
                      onCheckedChange={() => toggleFilter("levels", level)}
                    />
                    <label
                      htmlFor={`level-${level}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" className="w-full" onClick={clearFilters}>
            Clear All Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
          <Button className="w-full" onClick={onClose}>
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
