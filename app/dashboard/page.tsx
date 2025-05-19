"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bell, Calendar, Eye, Home, Mail, MessageSquare, Search, Settings, Star, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { MessageNotifications } from "@/components/message-notifications"

export default function Dashboard() {
  // Sample data for the dashboard
  const user = {
    name: "James Wilson",
    role: "Player",
    location: "London, UK",
    position: "Scrum-half",
    availability: "Weekends",
    level: "Semi-pro",
    profileViews: 42,
    messages: 5,
    savedClubs: 8,
  }

  const clubPosts = [
    {
      id: 1,
      clubName: "London Eagles RFC",
      roleNeeded: "Scrum-half",
      datePosted: "2 days ago",
      description:
        "Looking for an experienced scrum-half to join our semi-professional team for the upcoming season. Training twice a week with matches on Saturdays.",
      logo: "/placeholder.svg?height=50&width=50",
    },
    {
      id: 2,
      clubName: "Bristol Bears Academy",
      roleNeeded: "Fly-half",
      datePosted: "3 days ago",
      description:
        "Our academy is seeking talented fly-halves aged 18-21 for development opportunities. Professional coaching and pathway to senior team available.",
      logo: "/placeholder.svg?height=50&width=50",
    },
    {
      id: 3,
      clubName: "Edinburgh Rugby Club",
      roleNeeded: "Prop",
      datePosted: "1 week ago",
      description:
        "Amateur club with strong community ties looking for props to strengthen our forward pack. All levels of experience welcome.",
      logo: "/placeholder.svg?height=50&width=50",
    },
    {
      id: 4,
      clubName: "Cardiff RFC",
      roleNeeded: "Winger",
      datePosted: "1 week ago",
      description:
        "Seeking fast wingers with good handling skills. Our club competes at regional level with opportunities to progress.",
      logo: "/placeholder.svg?height=50&width=50",
    },
    {
      id: 5,
      clubName: "Newcastle Falcons Community",
      roleNeeded: "Centre",
      datePosted: "2 weeks ago",
      description:
        "Community team affiliated with Newcastle Falcons looking for centres. Regular training and competitive matches in local leagues.",
      logo: "/placeholder.svg?height=50&width=50",
    },
  ]

  const notifications = [
    {
      id: 1,
      content: "London Eagles RFC viewed your profile",
      time: "2 hours ago",
    },
    {
      id: 2,
      content: "Bristol Bears Academy sent you a message",
      time: "1 day ago",
    },
    {
      id: 3,
      content: "Your profile was recommended to 3 clubs",
      time: "2 days ago",
    },
    {
      id: 4,
      content: "Edinburgh Rugby Club saved your profile",
      time: "3 days ago",
    },
  ]

  const [interestedPosts, setInterestedPosts] = useState<number[]>([])

  const handleInterested = (postId: number) => {
    if (interestedPosts.includes(postId)) {
      setInterestedPosts(interestedPosts.filter((id) => id !== postId))
    } else {
      setInterestedPosts([...interestedPosts, postId])
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              <span className="text-[#1e4620] dark:text-[#3a8e3f]">Rugby</span>Connect
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-foreground hover:text-muted-foreground flex items-center gap-2">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link href="/messages" className="text-foreground hover:text-muted-foreground flex items-center gap-2">
              <MessageSquare size={18} />
              <span>Messages</span>
            </Link>
            <Link href="/search" className="text-foreground hover:text-muted-foreground flex items-center gap-2">
              <Search size={18} />
              <span>Search</span>
            </Link>
            <Link
              href="/notifications"
              className="text-foreground hover:text-muted-foreground flex items-center gap-2 relative"
            >
              <Bell size={18} />
              <span>Notifications</span>
              <span className="absolute -top-1 -right-1 bg-[#1e4620] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                4
              </span>
            </Link>
            <Link
              href="/messages"
              className="text-foreground hover:text-muted-foreground flex items-center gap-2 relative"
            >
              <div className="relative">
                <MessageNotifications />
              </div>
              <span>Messages</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/settings" className="text-foreground hover:text-muted-foreground">
              <Settings size={20} />
            </Link>
            <Link href="/profile" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#1e4620] dark:bg-[#1e4620] flex items-center justify-center text-white">
                JW
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Profile */}
          <div className="lg:col-span-3">
            <div className="sticky top-20">
              <Card>
                <div className="h-24 bg-gradient-to-r from-[#1e4620] to-[#2a5f2d]"></div>
                <div className="flex justify-center -mt-12">
                  <div className="w-24 h-24 rounded-full border-4 border-background bg-muted flex items-center justify-center text-2xl font-bold">
                    JW
                  </div>
                </div>
                <CardHeader className="text-center pt-2">
                  <Link href="/profile">
                    <h2 className="text-xl font-bold hover:text-[#1e4620] dark:hover:text-[#3a8e3f] transition-colors">
                      {user.name}
                    </h2>
                  </Link>
                  <p className="text-muted-foreground">
                    {user.role} • {user.location}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{user.position}</Badge>
                    <Badge variant="outline">{user.availability}</Badge>
                    <Badge variant="outline">{user.level}</Badge>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Profile Completion</h3>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-[#1e4620] dark:bg-[#3a8e3f] h-2.5 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Complete your profile to get more opportunities
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border flex justify-between">
                  <Button variant="ghost">
                    <User className="mr-2 h-4 w-4" />
                    <Link href="/profile">View Profile</Link>
                  </Button>
                  <Button variant="ghost">
                    <Settings className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <h3 className="font-semibold">Upcoming Events</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted p-2 rounded-md">
                      <Calendar className="h-5 w-5 text-[#1e4620] dark:text-[#3a8e3f]" />
                    </div>
                    <div>
                      <p className="font-medium">Trial Session</p>
                      <p className="text-sm text-muted-foreground">London Eagles RFC</p>
                      <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-muted p-2 rounded-md">
                      <Calendar className="h-5 w-5 text-[#1e4620] dark:text-[#3a8e3f]" />
                    </div>
                    <div>
                      <p className="font-medium">Recruitment Day</p>
                      <p className="text-sm text-muted-foreground">Bristol Bears Academy</p>
                      <p className="text-xs text-muted-foreground">Sat, 15 Jun • 9:00 AM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Center Column - Feed */}
          <div className="lg:col-span-6 space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Club Opportunities</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                {clubPosts.map((post) => (
                  <Card key={post.id} className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <Image
                          src={post.logo || "/placeholder.svg"}
                          alt={post.clubName}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                        <div>
                          <h4 className="font-semibold">{post.clubName}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Looking for: {post.roleNeeded}</span>
                            <span>•</span>
                            <span>{post.datePosted}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-muted-foreground">{post.description}</p>
                    </CardContent>
                    <CardFooter className="border-t border-border pt-3">
                      <Button
                        className={
                          interestedPosts.includes(post.id)
                            ? "bg-[#1e4620]/20 text-[#1e4620] dark:text-[#3a8e3f] hover:bg-[#1e4620]/30 border border-[#1e4620] dark:border-[#3a8e3f]"
                            : "bg-[#1e4620] hover:bg-[#2a5f2d] text-white"
                        }
                        onClick={() => handleInterested(post.id)}
                      >
                        {interestedPosts.includes(post.id) ? "Interested" : "I'm Interested"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Notifications & Stats */}
          <div className="lg:col-span-3">
            <div className="sticky top-20 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <Link href="/notifications" className="text-sm text-[#1e4620] dark:text-[#3a8e3f] hover:underline">
                      View all
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="bg-muted p-2 rounded-full">
                        <Bell className="h-4 w-4 text-[#1e4620] dark:text-[#3a8e3f]" />
                      </div>
                      <div>
                        <p className="text-sm">{notification.content}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Your Stats</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-md">
                        <Eye className="h-5 w-5 text-[#1e4620] dark:text-[#3a8e3f]" />
                      </div>
                      <div>
                        <p className="font-medium">Profile Views</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold">{user.profileViews}</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-md">
                        <Mail className="h-5 w-5 text-[#1e4620] dark:text-[#3a8e3f]" />
                      </div>
                      <div>
                        <p className="font-medium">Messages</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold">{user.messages}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-md">
                        <Star className="h-5 w-5 text-[#1e4620] dark:text-[#3a8e3f]" />
                      </div>
                      <div>
                        <p className="font-medium">Saved Clubs</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold">{user.savedClubs}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Suggested Connections</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">SC</div>
                      <div>
                        <p className="font-medium">Sarah Connor</p>
                        <p className="text-xs text-muted-foreground">Coach • London</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#1e4620] dark:border-[#3a8e3f] text-[#1e4620] dark:text-[#3a8e3f] hover:bg-[#1e4620]/10"
                    >
                      Connect
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">MR</div>
                      <div>
                        <p className="font-medium">Mike Roberts</p>
                        <p className="text-xs text-muted-foreground">Player • Bristol</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#1e4620] dark:border-[#3a8e3f] text-[#1e4620] dark:text-[#3a8e3f] hover:bg-[#1e4620]/10"
                    >
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
