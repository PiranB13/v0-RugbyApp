"use client"

import { useState } from "react"
import { Check, Globe, Lock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type PrivacyLevel = "public" | "connections" | "private"

export interface ProfilePrivacySettings {
  overallVisibility: PrivacyLevel
  sections: {
    basicInfo: PrivacyLevel
    stats: PrivacyLevel
    highlights: PrivacyLevel
    career: PrivacyLevel
    contact: PrivacyLevel
  }
  options: {
    hideFromSearch: boolean
    hideAvailabilityStatus: boolean
    anonymousViews: boolean
    notifyOnProfileViews: boolean
  }
}

interface PrivacySettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  privacySettings: ProfilePrivacySettings
  onSave: (settings: ProfilePrivacySettings) => void
}

export function PrivacySettingsDialog({ open, onOpenChange, privacySettings, onSave }: PrivacySettingsDialogProps) {
  const [settings, setSettings] = useState<ProfilePrivacySettings>(privacySettings)

  const handleSave = () => {
    onSave(settings)
    onOpenChange(false)
  }

  const updateSectionPrivacy = (section: keyof ProfilePrivacySettings["sections"], value: PrivacyLevel) => {
    setSettings({
      ...settings,
      sections: {
        ...settings.sections,
        [section]: value,
      },
    })
  }

  const updateOption = (option: keyof ProfilePrivacySettings["options"], value: boolean) => {
    setSettings({
      ...settings,
      options: {
        ...settings.options,
        [option]: value,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Privacy Settings</DialogTitle>
          <DialogDescription>
            Control who can see your profile information and how your data is shared.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="visibility" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visibility">Visibility</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
          </TabsList>

          <TabsContent value="visibility" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Profile Visibility</h3>
                <p className="text-sm text-muted-foreground">Control who can see your entire profile</p>
              </div>

              <RadioGroup
                value={settings.overallVisibility}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    overallVisibility: value as PrivacyLevel,
                  })
                }
                className="grid gap-4"
              >
                <div className="flex items-center space-x-2 rounded-md border p-4">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="flex flex-1 items-center gap-3 cursor-pointer">
                    <Globe className="h-5 w-5 text-[#1e4620] dark:text-[#3a8e3f]" />
                    <div>
                      <p className="font-medium">Public</p>
                      <p className="text-sm text-muted-foreground">Anyone can view your profile</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-md border p-4">
                  <RadioGroupItem value="connections" id="connections" />
                  <Label htmlFor="connections" className="flex flex-1 items-center gap-3 cursor-pointer">
                    <Users className="h-5 w-5 text-[#1e4620] dark:text-[#3a8e3f]" />
                    <div>
                      <p className="font-medium">Connections Only</p>
                      <p className="text-sm text-muted-foreground">Only your connections can view your profile</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-md border p-4">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="flex flex-1 items-center gap-3 cursor-pointer">
                    <Lock className="h-5 w-5 text-[#1e4620] dark:text-[#3a8e3f]" />
                    <div>
                      <p className="font-medium">Private</p>
                      <p className="text-sm text-muted-foreground">Only you can view your profile</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Section Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  Customize visibility for individual sections of your profile
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 rounded-md border p-4">
                  <div className="col-span-2">
                    <p className="font-medium">Basic Information</p>
                    <p className="text-sm text-muted-foreground">Name, position, region, skills</p>
                  </div>
                  <div className="col-span-2">
                    <Select
                      value={settings.sections.basicInfo}
                      onValueChange={(value) => updateSectionPrivacy("basicInfo", value as PrivacyLevel)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 rounded-md border p-4">
                  <div className="col-span-2">
                    <p className="font-medium">Performance Statistics</p>
                    <p className="text-sm text-muted-foreground">Tries, tackles, points, physical stats</p>
                  </div>
                  <div className="col-span-2">
                    <Select
                      value={settings.sections.stats}
                      onValueChange={(value) => updateSectionPrivacy("stats", value as PrivacyLevel)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 rounded-md border p-4">
                  <div className="col-span-2">
                    <p className="font-medium">Highlight Footage</p>
                    <p className="text-sm text-muted-foreground">Videos and match highlights</p>
                  </div>
                  <div className="col-span-2">
                    <Select
                      value={settings.sections.highlights}
                      onValueChange={(value) => updateSectionPrivacy("highlights", value as PrivacyLevel)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 rounded-md border p-4">
                  <div className="col-span-2">
                    <p className="font-medium">Career History</p>
                    <p className="text-sm text-muted-foreground">Teams, achievements, timeline</p>
                  </div>
                  <div className="col-span-2">
                    <Select
                      value={settings.sections.career}
                      onValueChange={(value) => updateSectionPrivacy("career", value as PrivacyLevel)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 rounded-md border p-4">
                  <div className="col-span-2">
                    <p className="font-medium">Contact Information</p>
                    <p className="text-sm text-muted-foreground">Social media, contact button</p>
                  </div>
                  <div className="col-span-2">
                    <Select
                      value={settings.sections.contact}
                      onValueChange={(value) => updateSectionPrivacy("contact", value as PrivacyLevel)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="options" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Privacy Options</h3>
                <p className="text-sm text-muted-foreground">Additional privacy settings for your profile</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <p className="font-medium">Hide from search results</p>
                    <p className="text-sm text-muted-foreground">
                      Your profile won't appear in search results or recommendations
                    </p>
                  </div>
                  <Switch
                    checked={settings.options.hideFromSearch}
                    onCheckedChange={(checked) => updateOption("hideFromSearch", checked)}
                  />
                </div>

                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <p className="font-medium">Hide availability status</p>
                    <p className="text-sm text-muted-foreground">
                      Don't show others whether you're available for recruitment
                    </p>
                  </div>
                  <Switch
                    checked={settings.options.hideAvailabilityStatus}
                    onCheckedChange={(checked) => updateOption("hideAvailabilityStatus", checked)}
                  />
                </div>

                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <p className="font-medium">Anonymous profile views</p>
                    <p className="text-sm text-muted-foreground">
                      View other profiles without them knowing you visited
                    </p>
                  </div>
                  <Switch
                    checked={settings.options.anonymousViews}
                    onCheckedChange={(checked) => updateOption("anonymousViews", checked)}
                  />
                </div>

                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <p className="font-medium">Profile view notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified when someone views your profile</p>
                  </div>
                  <Switch
                    checked={settings.options.notifyOnProfileViews}
                    onCheckedChange={(checked) => updateOption("notifyOnProfileViews", checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#1e4620] hover:bg-[#2a5f2d] text-white">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Helper component for section visibility selection
function Select({ value, onValueChange }: { value: string; onValueChange: (value: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onValueChange("public")}
        className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm ${
          value === "public"
            ? "bg-[#1e4620] dark:bg-[#3a8e3f] text-white"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        <Globe className="h-3 w-3" />
        {value === "public" && <Check className="h-3 w-3" />}
      </button>
      <button
        onClick={() => onValueChange("connections")}
        className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm ${
          value === "connections"
            ? "bg-[#1e4620] dark:bg-[#3a8e3f] text-white"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        <Users className="h-3 w-3" />
        {value === "connections" && <Check className="h-3 w-3" />}
      </button>
      <button
        onClick={() => onValueChange("private")}
        className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm ${
          value === "private"
            ? "bg-[#1e4620] dark:bg-[#3a8e3f] text-white"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        <Lock className="h-3 w-3" />
        {value === "private" && <Check className="h-3 w-3" />}
      </button>
    </div>
  )
}
