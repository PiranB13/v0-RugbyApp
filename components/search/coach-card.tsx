import type { CoachResult } from "@/types/search"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, User, CheckCircle, Award } from "lucide-react"
import Link from "next/link"

interface CoachCardProps {
  coach: CoachResult
}

export function CoachCard({ coach }: CoachCardProps) {
  const { name, specialization, experience, location, qualifications, verified, imageUrl } = coach

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
            <div className="text-sm text-muted-foreground">Coach • {experience} years exp</div>
            <div className="text-sm">{location}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {specialization.map((spec, index) => (
                <Badge key={index} variant="outline">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Qualifications</h4>
          <div className="space-y-2">
            {qualifications.map((qualification, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-amber-500" />
                <span>{qualification}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4 flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/coaches/${coach.id}`}>View Profile</Link>
        </Button>
        <Button size="icon" variant="ghost">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
