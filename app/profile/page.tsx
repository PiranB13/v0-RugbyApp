"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Instagram,
  MapPin,
  PlayCircle,
  Plus,
  Shield,
  Star,
  Trash2,
  Trophy,
  Upload,
  X,
  Youtube,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { EditableSection } from "@/components/editable-section"
import { PrivacyIndicator } from "@/components/privacy-indicator"
import { PrivacySettingsDialog, type ProfilePrivacySettings } from "@/components/privacy-settings-dialog"

// Define types for our stats
interface PhysicalStat {
  id: string
  name: string
  value: string
  visible: boolean
}

interface RugbyStat {
  name: string
  value: number
  visible: boolean
  pointValue?: number // Points per unit for automatic calculation
}

export default function PlayerProfile() {
  // Sample player data - in a real app, this would come from an API or database
  const [player, setPlayer] = useState({
    name: "James Wilson",
    primaryPosition: "Scrum-half",
    secondaryPositions: ["Fly-half"],
    region: "London, UK",
    level: "Semi-pro",
    photo: "/placeholder.svg?height=200&width=200",
    profileCompletion: 70,
    bio: "Experienced scrum-half with 5 years of competitive play. Known for quick distribution and tactical kicking.",
    rugbyStats: [
      { name: "Tries", value: 14, visible: true, pointValue: 5 },
      { name: "Conversions", value: 23, visible: true, pointValue: 2 },
      { name: "Penalties", value: 8, visible: true, pointValue: 3 },
      { name: "Games Played", value: 42, visible: true },
      { name: "Total Points", value: 0, visible: true }, // Will be calculated
      { name: "Avg Tackles/Game", value: 8.5, visible: true },
      { name: "Avg Metres/Game", value: 42.3, visible: true },
    ],
    physicalStats: [
      { id: "1", name: "40m Sprint", value: "4.8s", visible: true },
      { id: "2", name: "Vertical Jump", value: "76cm", visible: true },
      { id: "3", name: "Bench Press", value: "100kg", visible: true },
      { id: "4", name: "Back Squat", value: "140kg", visible: true },
      { id: "5", name: "Clean & Jerk", value: "85kg", visible: true },
    ],
    highlights: [
      {
        id: 1,
        type: "rugby",
        title: "Match-winning try vs Bristol Bears",
        thumbnail: "/placeholder.svg?height=180&width=320",
        caption: "Last minute try to secure victory in the cup final",
        date: "May 2023",
      },
      {
        id: 2,
        type: "rugby",
        title: "Defensive masterclass",
        thumbnail: "/placeholder.svg?height=180&width=320",
        caption: "Series of crucial tackles against Exeter Chiefs",
        date: "February 2023",
      },
      {
        id: 3,
        type: "rugby",
        title: "Solo breakaway try",
        thumbnail: "/placeholder.svg?height=180&width=320",
        caption: "80m run from own half against Saracens",
        date: "November 2022",
      },
      {
        id: 4,
        type: "performance",
        title: "Gym session highlights",
        thumbnail: "/placeholder.svg?height=180&width=320",
        caption: "Bench press and squat personal bests",
        date: "January 2023",
      },
      {
        id: 5,
        type: "performance",
        title: "Sprint test",
        thumbnail: "/placeholder.svg?height=180&width=320",
        caption: "40m sprint test - 4.8 seconds",
        date: "December 2022",
      },
    ],
    career: [
      {
        id: 1,
        club: "London Eagles RFC",
        level: "National League 1",
        dateRange: "2022 - Present",
        achievements: ["Player of the Month (3x)", "Top Try Scorer 2023", "League Finalist 2022"],
      },
      {
        id: 2,
        club: "University of Exeter",
        level: "BUCS Super Rugby",
        dateRange: "2019 - 2022",
        achievements: ["BUCS Championship Winner", "University Player of the Year 2021"],
      },
      {
        id: 3,
        club: "Bristol Academy",
        level: "Academy League",
        dateRange: "2017 - 2019",
        achievements: ["Academy Graduate", "U18 County Representative"],
      },
    ],
    social: {
      hudl: "https://www.hudl.com/",
      youtube: "https://www.youtube.com/",
      instagram: "https://www.instagram.com/",
    },
    skills: ["Scrum-half", "Playmaker", "Fast", "Defensive", "Leadership"],
  })

  const [isAvailable, setIsAvailable] = useState(true)
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false)
  const [newPhysicalStat, setNewPhysicalStat] = useState({ name: "", value: "" })
  const [editingPhysicalStats, setEditingPhysicalStats] = useState(false)

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState<ProfilePrivacySettings>({
    overallVisibility: "public",
    sections: {
      basicInfo: "public",
      stats: "connections",
      highlights: "public",
      career: "public",
      contact: "connections",
    },
    options: {
      hideFromSearch: false,
      hideAvailabilityStatus: false,
      anonymousViews: true,
      notifyOnProfileViews: true,
    },
  })

  // Form state for editing
  const [basicInfoForm, setBasicInfoForm] = useState({
    name: player.name,
    primaryPosition: player.primaryPosition,
    secondaryPositions: [...player.secondaryPositions],
    region: player.region,
    level: player.level,
    bio: player.bio,
  })

  // Initialize rugbyStatsForm with calculated total points
  const initialRugbyStats = [...player.rugbyStats]
  const tries = initialRugbyStats.find((stat) => stat.name === "Tries")?.value || 0
  const conversions = initialRugbyStats.find((stat) => stat.name === "Conversions")?.value || 0
  const penalties = initialRugbyStats.find((stat) => stat.name === "Penalties")?.value || 0
  const totalPoints = tries * 5 + conversions * 2 + penalties * 3

  const totalPointsIndex = initialRugbyStats.findIndex((stat) => stat.name === "Total Points")
  if (totalPointsIndex !== -1) {
    initialRugbyStats[totalPointsIndex] = {
      ...initialRugbyStats[totalPointsIndex],
      value: totalPoints,
    }
  }

  const [rugbyStatsForm, setRugbyStatsForm] = useState(initialRugbyStats)
  const [physicalStatsForm, setPhysicalStatsForm] = useState([...player.physicalStats])

  const [socialForm, setSocialForm] = useState({
    hudl: player.social.hudl,
    youtube: player.social.youtube,
    instagram: player.social.instagram,
  })

  const [skillsForm, setSkillsForm] = useState({
    currentSkill: "",
    skills: [...player.skills],
  })

  const [newCareerEntry, setNewCareerEntry] = useState({
    club: "",
    level: "",
    dateRange: "",
    achievements: [""],
  })

  const [newHighlight, setNewHighlight] = useState({
    title: "",
    caption: "",
    date: "",
    type: "rugby" as "rugby" | "performance",
  })

  // Now, let's add a list of rugby positions
  // Add this after all the state declarations:
  const rugbyPositions = [
    "Prop",
    "Hooker",
    "Lock",
    "Flanker",
    "Number 8",
    "Scrum-half",
    "Fly-half",
    "Centre",
    "Wing",
    "Full-back",
  ]

  // Calculate total points when tries, conversions, or penalties change in the form
  useEffect(() => {
    const tries = rugbyStatsForm.find((stat) => stat.name === "Tries")?.value || 0
    const conversions = rugbyStatsForm.find((stat) => stat.name === "Conversions")?.value || 0
    const penalties = rugbyStatsForm.find((stat) => stat.name === "Penalties")?.value || 0

    const totalPoints = tries * 5 + conversions * 2 + penalties * 3

    const totalPointsIndex = rugbyStatsForm.findIndex((stat) => stat.name === "Total Points")
    if (totalPointsIndex !== -1) {
      // Create a new array to avoid mutating state directly
      const updatedStats = [...rugbyStatsForm]
      updatedStats[totalPointsIndex] = {
        ...updatedStats[totalPointsIndex],
        value: totalPoints,
      }

      // Only update if the value has changed to avoid infinite loop
      if (rugbyStatsForm[totalPointsIndex].value !== totalPoints) {
        setRugbyStatsForm(updatedStats)
      }
    }
  }, [
    rugbyStatsForm.find((stat) => stat.name === "Tries")?.value,
    rugbyStatsForm.find((stat) => stat.name === "Conversions")?.value,
    rugbyStatsForm.find((stat) => stat.name === "Penalties")?.value,
  ])

  // Save handlers
  const handleSaveBasicInfo = () => {
    setPlayer({
      ...player,
      name: basicInfoForm.name,
      primaryPosition: basicInfoForm.primaryPosition,
      secondaryPositions: basicInfoForm.secondaryPositions,
      region: basicInfoForm.region,
      level: basicInfoForm.level,
      bio: basicInfoForm.bio,
    })
  }

  const handleSavePhysicalStats = () => {
    setPlayer({
      ...player,
      physicalStats: physicalStatsForm,
    })
    setEditingPhysicalStats(false)
  }

  const handleSaveRugbyStats = () => {
    // Calculate total points before saving
    const tries = rugbyStatsForm.find((stat) => stat.name === "Tries")?.value || 0
    const conversions = rugbyStatsForm.find((stat) => stat.name === "Conversions")?.value || 0
    const penalties = rugbyStatsForm.find((stat) => stat.name === "Penalties")?.value || 0
    const totalPoints = tries * 5 + conversions * 2 + penalties * 3

    const updatedStats = [...rugbyStatsForm]
    const totalPointsIndex = updatedStats.findIndex((stat) => stat.name === "Total Points")
    if (totalPointsIndex !== -1) {
      updatedStats[totalPointsIndex] = {
        ...updatedStats[totalPointsIndex],
        value: totalPoints,
      }
    }

    setPlayer({
      ...player,
      rugbyStats: updatedStats,
    })
  }

  const handleSaveSocial = () => {
    setPlayer({
      ...player,
      social: {
        hudl: socialForm.hudl,
        youtube: socialForm.youtube,
        instagram: socialForm.instagram,
      },
    })
  }

  const handleAddPhysicalStat = () => {
    if (newPhysicalStat.name && newPhysicalStat.value) {
      if (physicalStatsForm.length >= 9) {
        alert("You can only have a maximum of 9 physical stats. Please remove one before adding another.")
        return
      }

      const newStat = {
        id: Date.now().toString(),
        name: newPhysicalStat.name,
        value: newPhysicalStat.value,
        visible: true,
      }

      setPhysicalStatsForm([...physicalStatsForm, newStat])
      setNewPhysicalStat({ name: "", value: "" })
    }
  }

  const handleRemovePhysicalStat = (id: string) => {
    setPhysicalStatsForm(physicalStatsForm.filter((stat) => stat.id !== id))
  }

  const handleUpdatePhysicalStat = (id: string, field: keyof PhysicalStat, value: string | boolean) => {
    setPhysicalStatsForm(physicalStatsForm.map((stat) => (stat.id === id ? { ...stat, [field]: value } : stat)))
  }

  const handleUpdateRugbyStat = (index: number, field: keyof RugbyStat, value: number | boolean) => {
    const updatedStats = [...rugbyStatsForm]
    updatedStats[index] = { ...updatedStats[index], [field]: value }
    setRugbyStatsForm(updatedStats)
  }

  const handleAddSkill = () => {
    if (skillsForm.currentSkill && !skillsForm.skills.includes(skillsForm.currentSkill)) {
      const updatedSkills = [...skillsForm.skills, skillsForm.currentSkill]
      setSkillsForm({
        currentSkill: "",
        skills: updatedSkills,
      })
      setPlayer({
        ...player,
        skills: updatedSkills,
      })
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skillsForm.skills.filter((skill) => skill !== skillToRemove)
    setSkillsForm({
      ...skillsForm,
      skills: updatedSkills,
    })
    setPlayer({
      ...player,
      skills: updatedSkills,
    })
  }

  const handleAddCareerEntry = () => {
    if (newCareerEntry.club && newCareerEntry.level && newCareerEntry.dateRange) {
      const newEntry = {
        id: Date.now(),
        club: newCareerEntry.club,
        level: newCareerEntry.level,
        dateRange: newCareerEntry.dateRange,
        achievements: newCareerEntry.achievements.filter((a) => a.trim() !== ""),
      }

      setPlayer({
        ...player,
        career: [newEntry, ...player.career],
      })

      setNewCareerEntry({
        club: "",
        level: "",
        dateRange: "",
        achievements: [""],
      })
    }
  }

  const handleRemoveCareerEntry = (id: number) => {
    setPlayer({
      ...player,
      career: player.career.filter((entry) => entry.id !== id),
    })
  }

  const handleAddAchievement = () => {
    setNewCareerEntry({
      ...newCareerEntry,
      achievements: [...newCareerEntry.achievements, ""],
    })
  }

  const handleAchievementChange = (index: number, value: string) => {
    const updatedAchievements = [...newCareerEntry.achievements]
    updatedAchievements[index] = value
    setNewCareerEntry({
      ...newCareerEntry,
      achievements: updatedAchievements,
    })
  }

  const handleRemoveAchievement = (index: number) => {
    const updatedAchievements = [...newCareerEntry.achievements]
    updatedAchievements.splice(index, 1)
    setNewCareerEntry({
      ...newCareerEntry,
      achievements: updatedAchievements,
    })
  }

  const handleAddHighlight = () => {
    if (newHighlight.title && newHighlight.caption) {
      const newHighlightEntry = {
        id: Date.now(),
        type: newHighlight.type,
        title: newHighlight.title,
        caption: newHighlight.caption,
        date: newHighlight.date || "Recent",
        thumbnail: "/placeholder.svg?height=180&width=320",
      }

      setPlayer({
        ...player,
        highlights: [...player.highlights, newHighlightEntry],
      })

      setNewHighlight({
        title: "",
        caption: "",
        date: "",
        type: "rugby",
      })
    }
  }

  const handleRemoveHighlight = (id: number) => {
    setPlayer({
      ...player,
      highlights: player.highlights.filter((highlight) => highlight.id !== id),
    })
  }

  const handleSavePrivacySettings = (settings: ProfilePrivacySettings) => {
    setPrivacySettings(settings)
  }

  // Helper function to render section header with privacy indicator
  const renderSectionHeader = (title: string, privacyLevel: "public" | "connections" | "private") => (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">{title}</h2>
      <PrivacyIndicator level={privacyLevel} />
    </div>
  )

  // Calculate total points for display
  const calculateTotalPoints = () => {
    const tries = player.rugbyStats.find((stat) => stat.name === "Tries")?.value || 0
    const conversions = player.rugbyStats.find((stat) => stat.name === "Conversions")?.value || 0
    const penalties = player.rugbyStats.find((stat) => stat.name === "Penalties")?.value || 0
    return tries * 5 + conversions * 2 + penalties * 3
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPrivacyDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Top Section - Player Info */}
            <EditableSection
              title={renderSectionHeader("Player Information", privacySettings.sections.basicInfo)}
              onSave={handleSaveBasicInfo}
              editForm={
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-32">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#1e4620] dark:border-[#3a8e3f] mb-2">
                        <Image
                          src={player.photo || "/placeholder.svg"}
                          alt={player.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button className="w-full text-xs" size="sm">
                        <Upload className="h-3 w-3 mr-1" /> Change Photo
                      </Button>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={basicInfoForm.name}
                            onChange={(e) => setBasicInfoForm({ ...basicInfoForm, name: e.target.value })}
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="primaryPosition">Primary Position</Label>
                            <Select
                              value={basicInfoForm.primaryPosition}
                              onValueChange={(value) => setBasicInfoForm({ ...basicInfoForm, primaryPosition: value })}
                            >
                              <SelectTrigger id="primaryPosition">
                                <SelectValue placeholder="Select primary position" />
                              </SelectTrigger>
                              <SelectContent>
                                {rugbyPositions.map((position) => (
                                  <SelectItem key={position} value={position}>
                                    {position}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Secondary Positions</Label>
                            <div className="grid grid-cols-2 gap-2 p-4 border rounded-md">
                              {rugbyPositions.map((position) => (
                                <div key={position} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`position-${position}`}
                                    checked={basicInfoForm.secondaryPositions.includes(position)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setBasicInfoForm({
                                          ...basicInfoForm,
                                          secondaryPositions: [...basicInfoForm.secondaryPositions, position],
                                        })
                                      } else {
                                        setBasicInfoForm({
                                          ...basicInfoForm,
                                          secondaryPositions: basicInfoForm.secondaryPositions.filter(
                                            (p) => p !== position,
                                          ),
                                        })
                                      }
                                    }}
                                    disabled={position === basicInfoForm.primaryPosition}
                                  />
                                  <Label
                                    htmlFor={`position-${position}`}
                                    className={
                                      position === basicInfoForm.primaryPosition ? "text-muted-foreground" : ""
                                    }
                                  >
                                    {position}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">Select all positions you can play as backup</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="region">Region</Label>
                          <Input
                            id="region"
                            value={basicInfoForm.region}
                            onChange={(e) => setBasicInfoForm({ ...basicInfoForm, region: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="level">Level</Label>
                          <Select
                            value={basicInfoForm.level}
                            onValueChange={(value) => setBasicInfoForm({ ...basicInfoForm, level: value })}
                          >
                            <SelectTrigger id="level">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Amateur">Amateur</SelectItem>
                              <SelectItem value="Semi-pro">Semi-pro</SelectItem>
                              <SelectItem value="Professional">Professional</SelectItem>
                              <SelectItem value="Academy">Academy</SelectItem>
                              <SelectItem value="University">University</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={basicInfoForm.bio}
                          onChange={(e) => setBasicInfoForm({ ...basicInfoForm, bio: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium">Available for recruitment</span>
                        <Switch
                          checked={isAvailable}
                          onCheckedChange={setIsAvailable}
                          className="data-[state=checked]:bg-[#1e4620] data-[state=checked]:dark:bg-[#3a8e3f]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Skills & Attributes</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {skillsForm.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="bg-muted/50 flex items-center gap-1">
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill or attribute"
                        value={skillsForm.currentSkill}
                        onChange={(e) => setSkillsForm({ ...skillsForm, currentSkill: e.target.value })}
                        className="flex-1"
                      />
                      <Button onClick={handleAddSkill} type="button">
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              }
            >
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1e4620] dark:border-[#3a8e3f]">
                    <Image
                      src={player.photo || "/placeholder.svg"}
                      alt={player.name}
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  <Badge className="absolute bottom-0 right-0 bg-[#1e4620] dark:bg-[#3a8e3f] text-white">
                    {player.level}
                  </Badge>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold">{player.name}</h1>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-muted-foreground">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center">
                            <Star className="mr-1 h-4 w-4 text-[#1e4620] dark:text-[#3a8e3f]" />
                            {player.primaryPosition}
                          </span>
                          {player.secondaryPositions.length > 0 && (
                            <span className="text-sm text-muted-foreground pl-5">
                              Also plays: {player.secondaryPositions.join(", ")}
                            </span>
                          )}
                        </div>
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4 text-[#1e4620] dark:text-[#3a8e3f]" />
                          {player.region}
                        </span>
                      </div>
                      {player.bio && <p className="mt-2 text-muted-foreground">{player.bio}</p>}
                    </div>

                    {!privacySettings.options.hideAvailabilityStatus && (
                      <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium">Available for recruitment</span>
                        <Switch
                          checked={isAvailable}
                          onCheckedChange={setIsAvailable}
                          className="data-[state=checked]:bg-[#1e4620] data-[state=checked]:dark:bg-[#3a8e3f]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {player.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-muted/50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </EditableSection>

            {/* Basic Rugby Stats Box */}
            <EditableSection
              title={renderSectionHeader("Basic Rugby Stats", privacySettings.sections.stats)}
              onSave={handleSaveRugbyStats}
              editForm={
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rugbyStatsForm.map((stat, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`rugbyStat-${index}`}>{stat.name}</Label>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`rugbyStat-visible-${index}`}
                              checked={stat.visible}
                              onCheckedChange={(checked) => handleUpdateRugbyStat(index, "visible", !!checked)}
                            />
                            <Label htmlFor={`rugbyStat-visible-${index}`} className="text-sm">
                              Show
                            </Label>
                          </div>
                        </div>
                        <Input
                          id={`rugbyStat-${index}`}
                          type="number"
                          step={stat.name.includes("Avg") ? "0.1" : "1"}
                          value={stat.value}
                          onChange={(e) => handleUpdateRugbyStat(index, "value", Number(e.target.value))}
                          disabled={stat.name === "Total Points"} // Make Total Points read-only
                        />
                        {stat.name === "Total Points" && (
                          <p className="text-xs text-muted-foreground">
                            Automatically calculated: Tries (5pts) + Conversions (2pts) + Penalties (3pts)
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              }
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {player.rugbyStats
                  .filter(
                    (stat) => stat.visible && ["Tries", "Conversions", "Penalties", "Games Played"].includes(stat.name),
                  )
                  .map((stat, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-4">
                      <div className="text-muted-foreground text-sm">{stat.name}</div>
                      <div className="text-3xl font-bold mt-1">{stat.value}</div>
                    </div>
                  ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {player.rugbyStats
                  .filter(
                    (stat) =>
                      stat.visible && ["Total Points", "Avg Tackles/Game", "Avg Metres/Game"].includes(stat.name),
                  )
                  .map((stat, index) => {
                    // For Total Points, use the calculated value
                    const value = stat.name === "Total Points" ? calculateTotalPoints() : stat.value
                    return (
                      <div key={index} className="bg-muted/50 rounded-lg p-4">
                        <div className="text-muted-foreground text-sm">{stat.name}</div>
                        <div className="text-3xl font-bold mt-1">{value}</div>
                      </div>
                    )
                  })}
              </div>
            </EditableSection>

            {/* Physical Stats Section */}
            <EditableSection
              title={renderSectionHeader("Physical Stats", privacySettings.sections.stats)}
              onSave={handleSavePhysicalStats}
              editForm={
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Customize Physical Stats</h3>
                    <p className="text-sm text-muted-foreground">{physicalStatsForm.length}/9 stats used</p>
                  </div>

                  {/* Current Physical Stats */}
                  <div className="space-y-4">
                    {physicalStatsForm.map((stat) => (
                      <div key={stat.id} className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`stat-name-${stat.id}`} className="text-xs text-muted-foreground">
                              Stat Name
                            </Label>
                            <Input
                              id={`stat-name-${stat.id}`}
                              value={stat.name}
                              onChange={(e) => handleUpdatePhysicalStat(stat.id, "name", e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`stat-value-${stat.id}`} className="text-xs text-muted-foreground">
                              Value
                            </Label>
                            <Input
                              id={`stat-value-${stat.id}`}
                              value={stat.value}
                              onChange={(e) => handleUpdatePhysicalStat(stat.id, "value", e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`stat-visible-${stat.id}`}
                            checked={stat.visible}
                            onCheckedChange={(checked) => handleUpdatePhysicalStat(stat.id, "visible", !!checked)}
                          />
                          <Label htmlFor={`stat-visible-${stat.id}`} className="text-sm">
                            Show
                          </Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePhysicalStat(stat.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Physical Stat */}
                  {physicalStatsForm.length < 9 && (
                    <Card className="border-dashed">
                      <CardContent className="p-4 space-y-4">
                        <h4 className="font-medium">Add New Physical Stat</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-stat-name">Stat Name</Label>
                            <Input
                              id="new-stat-name"
                              placeholder="e.g., Deadlift"
                              value={newPhysicalStat.name}
                              onChange={(e) => setNewPhysicalStat({ ...newPhysicalStat, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-stat-value">Value</Label>
                            <Input
                              id="new-stat-value"
                              placeholder="e.g., 180kg"
                              value={newPhysicalStat.value}
                              onChange={(e) => setNewPhysicalStat({ ...newPhysicalStat, value: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button onClick={handleAddPhysicalStat} className="w-full">
                          <Plus className="mr-2 h-4 w-4" /> Add Physical Stat
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              }
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {player.physicalStats
                  .filter((stat) => stat.visible)
                  .map((stat) => (
                    <div key={stat.id} className="bg-muted/50 rounded-lg p-4">
                      <div className="text-muted-foreground text-sm">{stat.name}</div>
                      <div className="text-3xl font-bold mt-1">{stat.value}</div>
                    </div>
                  ))}
              </div>
            </EditableSection>

            {/* Videos Section */}
            <EditableSection
              title={renderSectionHeader("Videos", privacySettings.sections.highlights)}
              editForm={
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Rugby Highlights</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {player.highlights
                      .filter((highlight) => highlight.type === "rugby")
                      .map((highlight) => (
                        <div key={highlight.id} className="group relative">
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                            <Image
                              src={highlight.thumbnail || "/placeholder.svg"}
                              alt={highlight.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                              <PlayCircle className="h-12 w-12 text-white" />
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={() => handleRemoveHighlight(highlight.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="mt-2">
                            <h3 className="font-medium">{highlight.title}</h3>
                            <p className="text-sm text-muted-foreground">{highlight.caption}</p>
                            <p className="text-xs text-muted-foreground mt-1">{highlight.date}</p>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="flex items-center justify-between mt-8">
                    <h3 className="text-lg font-medium">Performance Clips</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {player.highlights
                      .filter((highlight) => highlight.type === "performance")
                      .map((highlight) => (
                        <div key={highlight.id} className="group relative">
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                            <Image
                              src={highlight.thumbnail || "/placeholder.svg"}
                              alt={highlight.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                              <PlayCircle className="h-12 w-12 text-white" />
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={() => handleRemoveHighlight(highlight.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="mt-2">
                            <h3 className="font-medium">{highlight.title}</h3>
                            <p className="text-sm text-muted-foreground">{highlight.caption}</p>
                            <p className="text-xs text-muted-foreground mt-1">{highlight.date}</p>
                          </div>
                        </div>
                      ))}
                  </div>

                  <Card className="border-dashed">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-medium">Add New Video</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="highlightType">Video Type</Label>
                          <Select
                            value={newHighlight.type}
                            onValueChange={(value) =>
                              setNewHighlight({ ...newHighlight, type: value as "rugby" | "performance" })
                            }
                          >
                            <SelectTrigger id="highlightType">
                              <SelectValue placeholder="Select video type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rugby">Rugby Highlight</SelectItem>
                              <SelectItem value="performance">Performance Clip</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="highlightTitle">Title</Label>
                            <Input
                              id="highlightTitle"
                              value={newHighlight.title}
                              onChange={(e) => setNewHighlight({ ...newHighlight, title: e.target.value })}
                              placeholder="e.g., Match-winning try"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="highlightDate">Date</Label>
                            <Input
                              id="highlightDate"
                              value={newHighlight.date}
                              onChange={(e) => setNewHighlight({ ...newHighlight, date: e.target.value })}
                              placeholder="e.g., May 2023"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="highlightCaption">Caption</Label>
                          <Textarea
                            id="highlightCaption"
                            value={newHighlight.caption}
                            onChange={(e) => setNewHighlight({ ...newHighlight, caption: e.target.value })}
                            placeholder="Describe what happens in this video"
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="highlightVideo">Video File</Label>
                          <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-6">
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm font-medium">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground mt-1">MP4, MOV or WebM (max 100MB)</p>
                              <Input id="highlightVideo" type="file" className="hidden" />
                            </div>
                          </div>
                        </div>
                        <Button onClick={handleAddHighlight} className="w-full">
                          <Plus className="mr-2 h-4 w-4" /> Add Video
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              }
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Rugby Highlights</h3>
                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-4" style={{ minWidth: "100%", width: "max-content" }}>
                      {player.highlights
                        .filter((highlight) => highlight.type === "rugby")
                        .map((highlight) => (
                          <div key={highlight.id} className="group relative" style={{ width: "320px", flexShrink: 0 }}>
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                              <Image
                                src={highlight.thumbnail || "/placeholder.svg"}
                                alt={highlight.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                                <PlayCircle className="h-12 w-12 text-white" />
                              </div>
                            </div>
                            <div className="mt-2">
                              <h3 className="font-medium">{highlight.title}</h3>
                              <p className="text-sm text-muted-foreground">{highlight.caption}</p>
                              <p className="text-xs text-muted-foreground mt-1">{highlight.date}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Performance Clips</h3>
                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-4" style={{ minWidth: "100%", width: "max-content" }}>
                      {player.highlights
                        .filter((highlight) => highlight.type === "performance")
                        .map((highlight) => (
                          <div key={highlight.id} className="group relative" style={{ width: "320px", flexShrink: 0 }}>
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                              <Image
                                src={highlight.thumbnail || "/placeholder.svg"}
                                alt={highlight.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                                <PlayCircle className="h-12 w-12 text-white" />
                              </div>
                            </div>
                            <div className="mt-2">
                              <h3 className="font-medium">{highlight.title}</h3>
                              <p className="text-sm text-muted-foreground">{highlight.caption}</p>
                              <p className="text-xs text-muted-foreground mt-1">{highlight.date}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </EditableSection>

            {/* Career Timeline */}
            <EditableSection
              title={renderSectionHeader("Career Timeline", privacySettings.sections.career)}
              editForm={
                <div className="space-y-6">
                  {/* Add new career entry form */}
                  <Card className="border-dashed">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-medium">Add New Career Entry</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="club">Club/Team</Label>
                            <Input
                              id="club"
                              value={newCareerEntry.club}
                              onChange={(e) => setNewCareerEntry({ ...newCareerEntry, club: e.target.value })}
                              placeholder="e.g., London Eagles RFC"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="level">Competition Level</Label>
                            <Input
                              id="level"
                              value={newCareerEntry.level}
                              onChange={(e) => setNewCareerEntry({ ...newCareerEntry, level: e.target.value })}
                              placeholder="e.g., National League 1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dateRange">Date Range</Label>
                            <Input
                              id="dateRange"
                              value={newCareerEntry.dateRange}
                              onChange={(e) => setNewCareerEntry({ ...newCareerEntry, dateRange: e.target.value })}
                              placeholder="e.g., 2022 - Present"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Achievements</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleAddAchievement}
                              className="h-8 text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" /> Add Achievement
                            </Button>
                          </div>
                          {newCareerEntry.achievements.map((achievement, index) => (
                            <div key={index} className="flex gap-2 items-center">
                              <Input
                                value={achievement}
                                onChange={(e) => handleAchievementChange(index, e.target.value)}
                                placeholder="e.g., Player of the Month"
                                className="flex-1"
                              />
                              {newCareerEntry.achievements.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveAchievement(index)}
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        <Button onClick={handleAddCareerEntry} className="w-full">
                          <Plus className="mr-2 h-4 w-4" /> Add Career Entry
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Existing career entries */}
                  <div className="space-y-6">
                    {player.career.map((career, index) => (
                      <div key={career.id} className="relative pl-6 pb-6 group">
                        {/* Timeline connector */}
                        {index < player.career.length - 1 && (
                          <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-border"></div>
                        )}

                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full bg-[#1e4620] dark:bg-[#3a8e3f] border-4 border-background"></div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <h3 className="text-lg font-semibold">{career.club}</h3>
                              <Badge variant="outline" className="md:ml-auto">
                                {career.dateRange}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">{career.level}</p>

                            <div className="mt-3 space-y-2">
                              {career.achievements.map((achievement, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <Trophy className="h-4 w-4 text-[#1e4620] dark:text-[#3a8e3f] mt-0.5 shrink-0" />
                                  <span>{achievement}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCareerEntry(career.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              }
            >
              <div className="space-y-6">
                {player.career.map((career, index) => (
                  <div key={career.id} className="relative pl-6 pb-6">
                    {/* Timeline connector */}
                    {index < player.career.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-border"></div>
                    )}

                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full bg-[#1e4620] dark:bg-[#3a8e3f] border-4 border-background"></div>

                    <div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold">{career.club}</h3>
                        <Badge variant="outline" className="md:ml-auto">
                          {career.dateRange}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{career.level}</p>

                      <div className="mt-3 space-y-2">
                        {career.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Trophy className="h-4 w-4 text-[#1e4620] dark:text-[#3a8e3f] mt-0.5 shrink-0" />
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </EditableSection>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-20 space-y-6">
              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Profile Completion</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">{player.profileCompletion}% Complete</span>
                      <span className="text-sm text-[#1e4620] dark:text-[#3a8e3f]">
                        {player.profileCompletion < 100 ? "In Progress" : "Complete"}
                      </span>
                    </div>
                    <Progress
                      value={player.profileCompletion}
                      className="h-2 bg-muted"
                      indicatorClassName="bg-[#1e4620] dark:bg-[#3a8e3f]"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[#1e4620] dark:text-[#3a8e3f]" />
                      <span className="text-sm">Basic Information</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[#1e4620] dark:text-[#3a8e3f]" />
                      <span className="text-sm">Performance Stats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[#1e4620] dark:text-[#3a8e3f]" />
                      <span className="text-sm">Career History</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                      <span className="text-sm">Medical Records</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                      <span className="text-sm">References</span>
                    </div>
                  </div>

                  <Button className="w-full bg-[#1e4620] hover:bg-[#2a5f2d] text-white">Complete Profile</Button>
                </CardContent>
              </Card>

              {/* Social Links */}
              <EditableSection
                title={renderSectionHeader("Social Links", privacySettings.sections.contact)}
                onSave={handleSaveSocial}
                editForm={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hudl">Hudl Profile URL</Label>
                      <Input
                        id="hudl"
                        value={socialForm.hudl}
                        onChange={(e) => setSocialForm({ ...socialForm, hudl: e.target.value })}
                        placeholder="https://www.hudl.com/profile/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="youtube">YouTube Channel URL</Label>
                      <Input
                        id="youtube"
                        value={socialForm.youtube}
                        onChange={(e) => setSocialForm({ ...socialForm, youtube: e.target.value })}
                        placeholder="https://www.youtube.com/c/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram Profile URL</Label>
                      <Input
                        id="instagram"
                        value={socialForm.instagram}
                        onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })}
                        placeholder="https://www.instagram.com/..."
                      />
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  <a
                    href={player.social.hudl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-[#ff6600] text-white p-1.5 rounded-md">
                        <span className="font-bold text-xs">HUDL</span>
                      </div>
                      <span>Hudl Profile</span>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  <a
                    href={player.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Youtube className="h-5 w-5 text-red-600" />
                      <span>YouTube Channel</span>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  <a
                    href={player.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Instagram className="h-5 w-5 text-pink-600" />
                      <span>Instagram</span>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </EditableSection>

              {/* Contact Button */}
              <Card>
                <CardContent className="p-4">
                  <Button className="w-full bg-[#1e4620] hover:bg-[#2a5f2d] text-white">Contact Player</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Privacy Settings Dialog */}
      <PrivacySettingsDialog
        open={privacyDialogOpen}
        onOpenChange={setPrivacyDialogOpen}
        privacySettings={privacySettings}
        onSave={handleSavePrivacySettings}
      />
    </div>
  )
}
