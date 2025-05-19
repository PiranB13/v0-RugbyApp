import type { ClubResult } from "@/types/search"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Building, CheckCircle, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

interface ClubCardProps {
  club: ClubResult
}

export function ClubCard({ club }: ClubCardProps) {
  const { name, location, division, established, facilities, verified, imageUrl, openPositions } = club

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={imageUrl || "/placeholder.svg"} alt={name} />
            <AvatarFallback>
              <Building className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-grow">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{name}</h3>
              {verified && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            <div className="text-sm text-muted-foreground">{division}</div>
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-3 w-3" />
              {location}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-3 w-3" />
              Est. {established}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Facilities</h4>
          <div className="flex flex-wrap gap-2">
            {facilities.map((facility, index) => (
              <Badge key={index} variant="outline">
                {facility}
              </Badge>
            ))}
          </div>

          {openPositions && openPositions.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Open Positions</h4>
              <div className="flex flex-wrap gap-2">
                {openPositions.map((position, index) => (
                  <Badge key={index} variant="secondary">
                    {position}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4 flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/clubs/${club.id}`}>View Club</Link>
        </Button>
        <Button size="icon" variant="ghost">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
