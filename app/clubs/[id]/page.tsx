"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Edit,
  ExternalLink,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageSquare,
  PlayCircle,
  Share2,
  Trophy,
  Twitter,
  Youtube,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { ClubProfileEditForm } from "@/components/club-profile-edit-form"
import { InterestNotificationBadge } from "@/components/interest-notification-badge"
import { MessageButton } from "@/components/message-button"

export default function ClubProfile() {
  // State to track if we're in edit mode
  const [isEditing, setIsEditing] = useState(false)

  // Sample club data - in a real app, this would come from an API or database
  const [club, setClub] = useState({
    id: "london-eagles",
    name: "London Eagles RFC",
    logo: "/placeholder.svg?height=120&width=120",
    region: "London, UK",
    level: "BUCS Super Rugby",
    isRecruiting: true,
    founded: "1892",
    homeGround: "Eagles Stadium, London",
    colors: "Green and Gold",
    website: "https://www.londoneaglesrfc.com",
    description:
      "London Eagles RFC is a semi-professional rugby club with a rich history dating back to 1892. Based in the heart of London, we compete in the BUCS Super Rugby league and have a strong tradition of developing young talent. Our first team has won the regional championship three times in the last decade, and we pride ourselves on playing an exciting, attacking brand of rugby.",
    philosophy:
      "At London Eagles, we believe in playing positive, attacking rugby while maintaining the core values of respect, teamwork, and discipline. We focus on player development both on and off the field, with many of our athletes balancing rugby with university studies or professional careers. Our coaching philosophy emphasizes skill development, game understanding, and physical preparation.",
    achievements: [
      "BUCS Super Rugby Champions (2019, 2021)",
      "London Cup Winners (2018, 2020, 2022)",
      "National Shield Finalists (2021)",
    ],
    coachingStaff: [
      {
        id: 1,
        name: "James Robertson",
        role: "Head Coach",
        photo: "/placeholder.svg?height=100&width=100",
        qualifications: "RFU Level 4, Former England U20s Coach",
        experience: "15+ years coaching experience",
      },
      {
        id: 2,
        name: "Sarah Williams",
        role: "Assistant Coach - Backs",
        photo: "/placeholder.svg?height=100&width=100",
        qualifications: "RFU Level 3, Former Premiership Player",
        experience: "8 years coaching experience",
      },
      {
        id: 3,
        name: "Michael Chen",
        role: "Assistant Coach - Forwards",
        photo: "/placeholder.svg?height=100&width=100",
        qualifications: "RFU Level 3, Former International Player",
        experience: "10 years coaching experience",
      },
      {
        id: 4,
        name: "David Thompson",
        role: "S&C Coach",
        photo: "/placeholder.svg?height=100&width=100",
        qualifications: "UKSCA Accredited, MSc Sports Science",
        experience: "12 years with elite athletes",
      },
    ],
    opportunities: [
      {
        id: 1,
        position: "Scrum-half",
        description:
          "Looking for an experienced scrum-half with strong passing skills and game management ability. Ideal for players with university or semi-professional experience.",
        requirements: "Fast service, tactical kicking, good communication",
        commitment: "Training twice weekly, matches on Saturdays",
        deadline: "August 15, 2023",
      },
      {
        id: 2,
        position: "Prop",
        description:
          "Seeking props with solid scrummaging technique to strengthen our front row. Opportunity for regular first team rugby for the right candidates.",
        requirements: "Strong scrummaging, mobility around the park",
        commitment: "Training twice weekly, matches on Saturdays",
        deadline: "August 30, 2023",
      },
      {
        id: 3,
        position: "Centre",
        description:
          "Opportunity for centers with good handling skills and defensive organization. Looking for players who can create opportunities in attack.",
        requirements: "Strong defense, good hands, communication",
        commitment: "Training twice weekly, matches on Saturdays",
        deadline: "August 30, 2023",
      },
      {
        id: 4,
        position: "Fly-half",
        description:
          "Seeking a tactically astute fly-half to direct our attacking play. Must have good kicking from hand and strong game management.",
        requirements: "Tactical awareness, kicking skills, leadership",
        commitment: "Training twice weekly, matches on Saturdays",
        deadline: "September 5, 2023",
      },
    ],
    media: [
      {
        id: 1,
        type: "video",
        title: "Season Highlights 2022/23",
        thumbnail: "/placeholder.svg?height=180&width=320",
        url: "#",
      },
      {
        id: 2,
        type: "video",
        title: "Cup Final Victory",
        thumbnail: "/placeholder.svg?height=180&width=320",
        url: "#",
      },
      {
        id: 3,
        type: "video",
        title: "Training Session Breakdown",
        thumbnail: "/placeholder.svg?height=180&width=320",
        url: "#",
      },
      {
        id: 4,
        type: "video",
        title: "Player Development Program",
        thumbnail: "/placeholder.svg?height=180&width=320",
        url: "#",
      },
    ],
    leaguePosition: 3,
    leagueTable: [
      { position: 1, team: "Bristol University", played: 10, won: 8, drawn: 1, lost: 1, points: 41 },
      { position: 2, team: "Exeter University", played: 10, won: 8, drawn: 0, lost: 2, points: 40 },
      { position: 3, team: "London Eagles RFC", played: 10, won: 7, drawn: 1, lost: 2, points: 36 },
      { position: 4, team: "Cardiff University", played: 10, won: 6, drawn: 1, lost: 3, points: 31 },
      { position: 5, team: "Durham University", played: 10, won: 5, drawn: 2, lost: 3, points: 29 },
    ],
    upcomingFixtures: [
      { date: "Aug 12, 2023", opponent: "Bristol University", location: "Home", competition: "BUCS Super Rugby" },
      { date: "Aug 19, 2023", opponent: "Exeter University", location: "Away", competition: "BUCS Super Rugby" },
      { date: "Aug 26, 2023", opponent: "Cardiff University", location: "Home", competition: "BUCS Super Rugby" },
      { date: "Sep 2, 2023", opponent: "Durham University", location: "Away", competition: "BUCS Super Rugby" },
    ],
    contact: {
      email: "recruitment@londoneaglesrfc.com",
      phone: "+44 20 1234 5678",
      address: "Eagles Stadium, 123 Rugby Road, London, SW1 1AA",
      social: {
        twitter: "https://twitter.com/",
        facebook: "https://facebook.com/",
        instagram: "https://instagram.com/",
        youtube: "https://youtube.com/",
      },
    },
  })

  const [interestedPositions, setInterestedPositions] = useState<number[]>([])

  // Mock function to check if current user is an admin of this club
  // In a real app, this would check against user roles and permissions
  const isClubAdmin = true

  const handleInterested = (opportunityId: number) => {
    if (interestedPositions.includes(opportunityId)) {
      setInterestedPositions(interestedPositions.filter((id) => id !== opportunityId))
    } else {
      setInterestedPositions([...interestedPositions, opportunityId])
    }
  }

  const handleSaveChanges = (updatedClub: typeof club) => {
    // In a real app, you would send this data to your API
    console.log("Saving club changes:", updatedClub)
    setClub(updatedClub)
    setIsEditing(false)

    // Show success message
    alert("Club profile updated successfully!")
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="bg-background border-b border-border sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={18} />
                <span className="ml-2">Cancel Editing</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/settings" className="text-foreground hover:text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-[#1e4620] dark:bg-[#1e4620] flex items-center justify-center text-white">
                  JW
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Edit Form */}
        <div className="container mx-auto px-4 py-6">
          <ClubProfileEditForm club={club} onSave={handleSaveChanges} onCancel={() => setIsEditing(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft size={18} />
              <span className="ml-2">Back to Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isClubAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </Button>
            )}
            {isClubAdmin && (
              <Link href={`/clubs/${club.id}/interested-players`}>
                <Button variant="outline" size="sm" className="flex items-center gap-2 relative">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">View Interest</span>
                  <InterestNotificationBadge count={6} /> {/* In a real app, calculate this from your data */}
                </Button>
              </Link>
            )}
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <ThemeToggle />
            <Link href="/settings" className="text-foreground hover:text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-[#1e4620] dark:bg-[#1e4620] flex items-center justify-center text-white">
                JW
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Club Header Banner */}
      <div className="bg-[#1e4620] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-lg overflow-hidden flex items-center justify-center p-2">
                <Image
                  src={club.logo || "/placeholder.svg"}
                  alt={club.name}
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{club.name}</h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                    <span className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {club.region}
                    </span>
                    <span className="flex items-center">
                      <Trophy className="mr-1 h-4 w-4" />
                      {club.level}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                  {club.isRecruiting && (
                    <Badge className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm">
                      <CheckCircle className="mr-1 h-4 w-4" /> Actively Recruiting
                    </Badge>
                  )}
                  <Button className="bg-white text-[#1e4620] hover:bg-gray-100">
                    <MessageSquare className="mr-2 h-4 w-4" /> Contact Club
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Club Overview */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Club Overview</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">About {club.name}</h3>
                  <p className="text-muted-foreground">{club.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Team Philosophy</h3>
                  <p className="text-muted-foreground">{club.philosophy}</p>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Club Achievements</h3>
                  <div className="space-y-2">
                    {club.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Trophy className="h-5 w-5 text-[#1e4620] dark:text-[#3a8e3f] mt-0.5 shrink-0" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coaching Staff */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Coaching Staff</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {club.coachingStaff.map((coach) => (
                    <div key={coach.id} className="flex gap-4 bg-muted/30 p-4 rounded-lg">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted">
                        <Image src={coach.photo || "/placeholder.svg"} alt={coach.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{coach.name}</h3>
                        <p className="text-sm text-[#1e4620] dark:text-[#3a8e3f] font-medium">{coach.role}</p>
                        <p className="text-xs text-muted-foreground mt-1">{coach.qualifications}</p>
                        <p className="text-xs text-muted-foreground">{coach.experience}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Opportunities */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-2xl font-semibold">Open Opportunities</h2>
                <Badge variant="outline" className="bg-[#1e4620] text-white">
                  {club.opportunities.length} Positions
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-4" style={{ minWidth: "100%", width: "max-content" }}>
                    {club.opportunities.map((opportunity) => (
                      <Card
                        key={opportunity.id}
                        className="w-[350px] flex-shrink-0 border-l-4 border-l-[#1e4620] dark:border-l-[#3a8e3f]"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-semibold">{opportunity.position}</h3>
                            <Badge variant="outline">Deadline: {opportunity.deadline}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                          <div className="mt-4 space-y-2">
                            <div>
                              <h4 className="text-sm font-medium">Requirements:</h4>
                              <p className="text-sm text-muted-foreground">{opportunity.requirements}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Commitment:</h4>
                              <p className="text-sm text-muted-foreground">{opportunity.commitment}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                          <Button
                            className={
                              interestedPositions.includes(opportunity.id)
                                ? "bg-[#1e4620]/20 text-[#1e4620] dark:text-[#3a8e3f] hover:bg-[#1e4620]/30 border border-[#1e4620] dark:border-[#3a8e3f] w-full"
                                : "bg-[#1e4620] hover:bg-[#2a5f2d] text-white w-full"
                            }
                            onClick={() => handleInterested(opportunity.id)}
                          >
                            {interestedPositions.includes(opportunity.id) ? "Interest Expressed" : "Express Interest"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Gallery */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Media Gallery</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {club.media.map((item) => (
                    <div key={item.id} className="group relative">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                        <Image
                          src={item.thumbnail || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      <div className="mt-2">
                        <h3 className="font-medium">{item.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Club Info Card */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Club Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Founded</span>
                  <span className="font-medium">{club.founded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Home Ground</span>
                  <span className="font-medium">{club.homeGround}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Club Colors</span>
                  <span className="font-medium">{club.colors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Website</span>
                  <a
                    href={club.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1e4620] dark:text-[#3a8e3f] hover:underline flex items-center"
                  >
                    Visit Site <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* League Table Widget */}
            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold">League Table</h3>
                <p className="text-xs text-muted-foreground">BUCS Super Rugby</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-2 text-xs font-medium">Pos</th>
                        <th className="text-left p-2 text-xs font-medium">Team</th>
                        <th className="text-center p-2 text-xs font-medium">P</th>
                        <th className="text-center p-2 text-xs font-medium">W</th>
                        <th className="text-center p-2 text-xs font-medium">D</th>
                        <th className="text-center p-2 text-xs font-medium">L</th>
                        <th className="text-center p-2 text-xs font-medium">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {club.leagueTable.map((row) => (
                        <tr
                          key={row.position}
                          className={
                            row.team === club.name
                              ? "bg-[#1e4620]/10 dark:bg-[#3a8e3f]/10 font-medium"
                              : "border-t border-border"
                          }
                        >
                          <td className="p-2 text-xs">{row.position}</td>
                          <td className="p-2 text-xs">{row.team}</td>
                          <td className="p-2 text-xs text-center">{row.played}</td>
                          <td className="p-2 text-xs text-center">{row.won}</td>
                          <td className="p-2 text-xs text-center">{row.drawn}</td>
                          <td className="p-2 text-xs text-center">{row.lost}</td>
                          <td className="p-2 text-xs text-center font-medium">{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 text-xs text-center text-muted-foreground">
                  Data provided by BUCS Super Rugby API
                </div>
              </CardContent>
            </Card>

            {/* Fixture Calendar */}
            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold">Upcoming Fixtures</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {club.upcomingFixtures.map((fixture, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      index < club.upcomingFixtures.length - 1 ? "pb-4 border-b border-border" : ""
                    }`}
                  >
                    <div className="bg-muted p-2 rounded-md">
                      <Calendar className="h-5 w-5 text-[#1e4620] dark:text-[#3a8e3f]" />
                    </div>
                    <div>
                      <p className="font-medium">vs {fixture.opponent}</p>
                      <p className="text-sm text-muted-foreground">{fixture.competition}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {fixture.location}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{fixture.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full text-sm">
                  View Full Calendar
                </Button>
              </CardFooter>
            </Card>

            {/* Contact Button */}
            <Card>
              <CardContent className="p-4">
                <MessageButton
                  recipientId={club.id}
                  recipientName={club.name}
                  className="w-full bg-[#1e4620] hover:bg-[#2a5f2d] text-white"
                />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Contact Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[#1e4620] dark:text-[#3a8e3f] mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href={`mailto:${club.contact.email}`}
                      className="text-sm text-[#1e4620] dark:text-[#3a8e3f] hover:underline"
                    >
                      {club.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#1e4620] dark:text-[#3a8e3f] mt-0.5" />
                  <div>
                    <p className="font-medium">Training Ground</p>
                    <p className="text-sm text-muted-foreground">{club.contact.address}</p>
                    <Button variant="link" className="p-0 h-auto text-xs text-[#1e4620] dark:text-[#3a8e3f]">
                      View on Map
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="font-medium mb-3">Social Media</p>
                  <div className="flex gap-3">
                    <a
                      href={club.contact.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-muted p-2 rounded-full hover:bg-muted/80 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a
                      href={club.contact.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-muted p-2 rounded-full hover:bg-muted/80 transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      href={club.contact.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-muted p-2 rounded-full hover:bg-muted/80 transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a
                      href={club.contact.social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-muted p-2 rounded-full hover:bg-muted/80 transition-colors"
                    >
                      <Youtube className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
