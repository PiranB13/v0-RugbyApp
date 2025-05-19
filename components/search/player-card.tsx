import type { PlayerResult } from "@/types/search"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, User, CheckCircle } from "lucide-react"
import Link from "next/link"

interface PlayerCardProps {
  player: PlayerResult
}

export function PlayerCard({ player }: PlayerCardProps) {
  const { name, age, position, location, experience, skillLevel, stats, verified, imageUrl } = player

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={imageUrl || "/placeholder.svg"} alt={name} />
            <AvatarFallback>
              <User className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-grow">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{name}</h3>
              {verified && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            <div className="text-sm text-muted-foreground">
              {position} • {age} years
            </div>
            <div className="text-sm">{location}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">{skillLevel}</Badge>
              <Badge variant="outline">{experience} years exp</Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted rounded-md p-2">
            <div className="text-lg font-semibold">{stats.matches}</div>
            <div className="text-xs text-muted-foreground">Matches</div>
          </div>
          <div className="bg-muted rounded-md p-2">
            <div className="text-lg font-semibold">{stats.tries}</div>
            <div className="text-xs text-muted-foreground">Tries</div>
          </div>
          <div className="bg-muted rounded-md p-2">
            <div className="text-lg font-semibold">{stats.tackles}</div>
            <div className="text-xs text-muted-foreground">Tackles</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4 flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/profile/${player.id}`}>View Profile</Link>
        </Button>
        <Button size="icon" variant="ghost">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
