"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Plus, Save, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define types for our club data
interface Coach {
  id: number
  name: string
  role: string
  photo: string
  qualifications: string
  experience: string
}

interface Opportunity {
  id: number
  position: string
  description: string
  requirements: string
  commitment: string
  deadline: string
}

interface MediaItem {
  id: number
  type: string
  title: string
  thumbnail: string
  url: string
}

interface LeagueTableRow {
  position: number
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  points: number
}

interface Fixture {
  date: string
  opponent: string
  location: string
  competition: string
}

interface ClubContact {
  email: string
  phone: string
  address: string
  social: {
    twitter: string
    facebook: string
    instagram: string
    youtube: string
  }
}

interface ClubData {
  id: string
  name: string
  logo: string
  region: string
  level: string
  isRecruiting: boolean
  founded: string
  homeGround: string
  colors: string
  website: string
  description: string
  philosophy: string
  achievements: string[]
  coachingStaff: Coach[]
  opportunities: Opportunity[]
  media: MediaItem[]
  leaguePosition: number
  leagueTable: LeagueTableRow[]
  upcomingFixtures: Fixture[]
  contact: ClubContact
}

interface ClubProfileEditFormProps {
  club: ClubData
  onSave: (updatedClub: ClubData) => void
  onCancel: () => void
}

export function ClubProfileEditForm({ club, onSave, onCancel }: ClubProfileEditFormProps) {
  const [formData, setFormData] = useState<ClubData>({ ...club })
  const [newAchievement, setNewAchievement] = useState("")
  const [newCoach, setNewCoach] = useState<Omit<Coach, "id">>({
    name: "",
    role: "",
    photo: "/placeholder.svg?height=100&width=100",
    qualifications: "",
    experience: "",
  })
  const [newOpportunity, setNewOpportunity] = useState<Omit<Opportunity, "id">>({
    position: "",
    description: "",
    requirements: "",
    commitment: "",
    deadline: "",
  })
  const [newMedia, setNewMedia] = useState<Omit<MediaItem, "id">>({
    type: "video",
    title: "",
    thumbnail: "/placeholder.svg?height=180&width=320",
    url: "",
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState("basic")

  // Handle basic info changes
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  // Add a new achievement
  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, newAchievement],
      })
      setNewAchievement("")
    }
  }

  // Remove an achievement
  const handleRemoveAchievement = (index: number) => {
    const updatedAchievements = [...formData.achievements]
    updatedAchievements.splice(index, 1)
    setFormData({
      ...formData,
      achievements: updatedAchievements,
    })
  }

  // Add a new coach
  const handleAddCoach = () => {
    if (newCoach.name && newCoach.role) {
      const newId = Math.max(0, ...formData.coachingStaff.map((coach) => coach.id)) + 1
      setFormData({
        ...formData,
        coachingStaff: [
          ...formData.coachingStaff,
          {
            ...newCoach,
            id: newId,
          },
        ],
      })
      setNewCoach({
        name: "",
        role: "",
        photo: "/placeholder.svg?height=100&width=100",
        qualifications: "",
        experience: "",
      })
    }
  }

  // Remove a coach
  const handleRemoveCoach = (id: number) => {
    setFormData({
      ...formData,
      coachingStaff: formData.coachingStaff.filter((coach) => coach.id !== id),
    })
  }

  // Update coach information
  const handleCoachChange = (id: number, field: keyof Coach, value: string) => {
    setFormData({
      ...formData,
      coachingStaff: formData.coachingStaff.map((coach) => (coach.id === id ? { ...coach, [field]: value } : coach)),
    })
  }

  // Add a new opportunity
  const handleAddOpportunity = () => {
    if (newOpportunity.position && newOpportunity.description) {
      const newId = Math.max(0, ...formData.opportunities.map((opp) => opp.id)) + 1
      setFormData({
        ...formData,
        opportunities: [
          ...formData.opportunities,
          {
            ...newOpportunity,
            id: newId,
          },
        ],
      })
      setNewOpportunity({
        position: "",
        description: "",
        requirements: "",
        commitment: "",
        deadline: "",
      })
    }
  }

  // Remove an opportunity
  const handleRemoveOpportunity = (id: number) => {
    setFormData({
      ...formData,
      opportunities: formData.opportunities.filter((opp) => opp.id !== id),
    })
  }

  // Update opportunity information
  const handleOpportunityChange = (id: number, field: keyof Opportunity, value: string) => {
    setFormData({
      ...formData,
      opportunities: formData.opportunities.map((opp) => (opp.id === id ? { ...opp, [field]: value } : opp)),
    })
  }

  // Add a new media item
  const handleAddMedia = () => {
    if (newMedia.title && newMedia.url) {
      const newId = Math.max(0, ...formData.media.map((item) => item.id)) + 1
      setFormData({
        ...formData,
        media: [
          ...formData.media,
          {
            ...newMedia,
            id: newId,
          },
        ],
      })
      setNewMedia({
        type: "video",
        title: "",
        thumbnail: "/placeholder.svg?height=180&width=320",
        url: "",
      })
    }
  }

  // Remove a media item
  const handleRemoveMedia = (id: number) => {
    setFormData({
      ...formData,
      media: formData.media.filter((item) => item.id !== id),
    })
  }

  // Update contact information
  const handleContactChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        [field]: value,
      },
    })
  }

  // Update social media links
  const handleSocialChange = (platform: string, value: string) => {
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        social: {
          ...formData.contact.social,
          [platform]: value,
        },
      },
    })
  }

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0])
      // In a real app, you would upload this file to your server/storage
      // For now, we'll just create a temporary URL to display the image
      const tempUrl = URL.createObjectURL(e.target.files[0])
      setFormData({
        ...formData,
        logo: tempUrl,
      })
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would handle file uploads here
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#1e4620] text-white p-6 rounded-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-lg overflow-hidden flex items-center justify-center p-2 relative group">
              <Image
                src={formData.logo || "/placeholder.svg"}
                alt={formData.name}
                width={120}
                height={120}
                className="object-contain"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-white" />
                  <span className="sr-only">Upload logo</span>
                </label>
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Club Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleBasicInfoChange}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="region" className="text-white">
                    Region
                  </Label>
                  <Input
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleBasicInfoChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="level" className="text-white">
                    Competition Level
                  </Label>
                  <Input
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleBasicInfoChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">Actively Recruiting</span>
                <Switch
                  checked={formData.isRecruiting}
                  onCheckedChange={(checked) => handleSwitchChange("isRecruiting", checked)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="coaches">Coaching Staff</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Club Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="founded">Founded</Label>
                  <Input id="founded" name="founded" value={formData.founded} onChange={handleBasicInfoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homeGround">Home Ground</Label>
                  <Input
                    id="homeGround"
                    name="homeGround"
                    value={formData.homeGround}
                    onChange={handleBasicInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="colors">Club Colors</Label>
                  <Input id="colors" name="colors" value={formData.colors} onChange={handleBasicInfoChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" value={formData.website} onChange={handleBasicInfoChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Club Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleBasicInfoChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="philosophy">Team Philosophy</Label>
                <Textarea
                  id="philosophy"
                  name="philosophy"
                  value={formData.philosophy}
                  onChange={handleBasicInfoChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Club Achievements</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      placeholder="Add new achievement"
                      className="w-64"
                    />
                    <Button type="button" onClick={handleAddAchievement} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 mt-2">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                      <span>{achievement}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAchievement(index)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-background/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coaching Staff Tab */}
        <TabsContent value="coaches" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Coaching Staff</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing coaches */}
              <div className="space-y-4">
                {formData.coachingStaff.map((coach) => (
                  <div key={coach.id} className="flex gap-4 bg-muted/30 p-4 rounded-lg">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted">
                      <Image src={coach.photo || "/placeholder.svg"} alt={coach.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`coach-name-${coach.id}`}>Name</Label>
                        <Input
                          id={`coach-name-${coach.id}`}
                          value={coach.name}
                          onChange={(e) => handleCoachChange(coach.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`coach-role-${coach.id}`}>Role</Label>
                        <Input
                          id={`coach-role-${coach.id}`}
                          value={coach.role}
                          onChange={(e) => handleCoachChange(coach.id, "role", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`coach-qualifications-${coach.id}`}>Qualifications</Label>
                        <Input
                          id={`coach-qualifications-${coach.id}`}
                          value={coach.qualifications}
                          onChange={(e) => handleCoachChange(coach.id, "qualifications", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`coach-experience-${coach.id}`}>Experience</Label>
                        <Input
                          id={`coach-experience-${coach.id}`}
                          value={coach.experience}
                          onChange={(e) => handleCoachChange(coach.id, "experience", e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCoach(coach.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add new coach */}
              <Card className="border-dashed">
                <CardHeader>
                  <h3 className="text-lg font-medium">Add New Coach</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-coach-name">Name</Label>
                      <Input
                        id="new-coach-name"
                        value={newCoach.name}
                        onChange={(e) => setNewCoach({ ...newCoach, name: e.target.value })}
                        placeholder="Coach name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-coach-role">Role</Label>
                      <Input
                        id="new-coach-role"
                        value={newCoach.role}
                        onChange={(e) => setNewCoach({ ...newCoach, role: e.target.value })}
                        placeholder="e.g., Assistant Coach - Backs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-coach-qualifications">Qualifications</Label>
                      <Input
                        id="new-coach-qualifications"
                        value={newCoach.qualifications}
                        onChange={(e) => setNewCoach({ ...newCoach, qualifications: e.target.value })}
                        placeholder="e.g., RFU Level 3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-coach-experience">Experience</Label>
                      <Input
                        id="new-coach-experience"
                        value={newCoach.experience}
                        onChange={(e) => setNewCoach({ ...newCoach, experience: e.target.value })}
                        placeholder="e.g., 8 years coaching experience"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Coach photo"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <label htmlFor="coach-photo-upload" className="cursor-pointer">
                          <Upload className="h-6 w-6 text-white" />
                          <span className="sr-only">Upload photo</span>
                        </label>
                        <input
                          id="coach-photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          // In a real app, you would handle file upload here
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="button" onClick={handleAddCoach} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Coach
                  </Button>
                </CardFooter>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Open Positions</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing opportunities */}
              <div className="space-y-4">
                {formData.opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Label htmlFor={`opportunity-position-${opportunity.id}`}>Position</Label>
                        <Input
                          id={`opportunity-position-${opportunity.id}`}
                          value={opportunity.position}
                          onChange={(e) => handleOpportunityChange(opportunity.id, "position", e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOpportunity(opportunity.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`opportunity-description-${opportunity.id}`}>Description</Label>
                      <Textarea
                        id={`opportunity-description-${opportunity.id}`}
                        value={opportunity.description}
                        onChange={(e) => handleOpportunityChange(opportunity.id, "description", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`opportunity-requirements-${opportunity.id}`}>Requirements</Label>
                        <Input
                          id={`opportunity-requirements-${opportunity.id}`}
                          value={opportunity.requirements}
                          onChange={(e) => handleOpportunityChange(opportunity.id, "requirements", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`opportunity-commitment-${opportunity.id}`}>Commitment</Label>
                        <Input
                          id={`opportunity-commitment-${opportunity.id}`}
                          value={opportunity.commitment}
                          onChange={(e) => handleOpportunityChange(opportunity.id, "commitment", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`opportunity-deadline-${opportunity.id}`}>Deadline</Label>
                        <Input
                          id={`opportunity-deadline-${opportunity.id}`}
                          value={opportunity.deadline}
                          onChange={(e) => handleOpportunityChange(opportunity.id, "deadline", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add new opportunity */}
              <Card className="border-dashed">
                <CardHeader>
                  <h3 className="text-lg font-medium">Add New Position</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-opportunity-position">Position</Label>
                    <Input
                      id="new-opportunity-position"
                      value={newOpportunity.position}
                      onChange={(e) => setNewOpportunity({ ...newOpportunity, position: e.target.value })}
                      placeholder="e.g., Scrum-half"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-opportunity-description">Description</Label>
                    <Textarea
                      id="new-opportunity-description"
                      value={newOpportunity.description}
                      onChange={(e) => setNewOpportunity({ ...newOpportunity, description: e.target.value })}
                      placeholder="Describe the position and requirements"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-opportunity-requirements">Requirements</Label>
                      <Input
                        id="new-opportunity-requirements"
                        value={newOpportunity.requirements}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, requirements: e.target.value })}
                        placeholder="e.g., Fast service, tactical kicking"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-opportunity-commitment">Commitment</Label>
                      <Input
                        id="new-opportunity-commitment"
                        value={newOpportunity.commitment}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, commitment: e.target.value })}
                        placeholder="e.g., Training twice weekly"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-opportunity-deadline">Deadline</Label>
                      <Input
                        id="new-opportunity-deadline"
                        value={newOpportunity.deadline}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, deadline: e.target.value })}
                        placeholder="e.g., August 30, 2023"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="button" onClick={handleAddOpportunity} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Position
                  </Button>
                </CardFooter>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Media Gallery</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing media */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.media.map((item) => (
                  <div key={item.id} className="group relative">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                      <Image
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => handleRemoveMedia(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 space-y-2">
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const updatedMedia = formData.media.map((m) =>
                            m.id === item.id ? { ...m, title: e.target.value } : m,
                          )
                          setFormData({ ...formData, media: updatedMedia })
                        }}
                        placeholder="Video title"
                      />
                      <Input
                        value={item.url}
                        onChange={(e) => {
                          const updatedMedia = formData.media.map((m) =>
                            m.id === item.id ? { ...m, url: e.target.value } : m,
                          )
                          setFormData({ ...formData, media: updatedMedia })
                        }}
                        placeholder="Video URL"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add new media */}
              <Card className="border-dashed">
                <CardHeader>
                  <h3 className="text-lg font-medium">Add New Media</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-media-title">Title</Label>
                    <Input
                      id="new-media-title"
                      value={newMedia.title}
                      onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                      placeholder="e.g., Season Highlights"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-media-url">Video URL</Label>
                    <Input
                      id="new-media-url"
                      value={newMedia.url}
                      onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                      placeholder="e.g., https://youtube.com/watch?v=..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Thumbnail</Label>
                    <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP (max 2MB)</p>
                        <Input
                          type="file"
                          className="hidden"
                          // In a real app, you would handle file upload here
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="button" onClick={handleAddMedia} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Media
                  </Button>
                </CardFooter>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Contact Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  value={formData.contact.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone</Label>
                <Input
                  id="contact-phone"
                  value={formData.contact.phone}
                  onChange={(e) => handleContactChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-address">Address</Label>
                <Textarea
                  id="contact-address"
                  value={formData.contact.address}
                  onChange={(e) => handleContactChange("address", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="social-twitter">Twitter</Label>
                    <Input
                      id="social-twitter"
                      value={formData.contact.social.twitter}
                      onChange={(e) => handleSocialChange("twitter", e.target.value)}
                      placeholder="https://twitter.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="social-facebook">Facebook</Label>
                    <Input
                      id="social-facebook"
                      value={formData.contact.social.facebook}
                      onChange={(e) => handleSocialChange("facebook", e.target.value)}
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="social-instagram">Instagram</Label>
                    <Input
                      id="social-instagram"
                      value={formData.contact.social.instagram}
                      onChange={(e) => handleSocialChange("instagram", e.target.value)}
                      placeholder="https://instagram.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="social-youtube">YouTube</Label>
                    <Input
                      id="social-youtube"
                      value={formData.contact.social.youtube}
                      onChange={(e) => handleSocialChange("youtube", e.target.value)}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1e4620] hover:bg-[#2a5f2d] text-white">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>
    </form>
  )
}
