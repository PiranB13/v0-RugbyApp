import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator"
import { EmailChangeForm } from "@/components/profile/email-change-form"

export const metadata: Metadata = {
  title: "Profile Settings | RugbyConnect",
  description: "Manage your profile settings",
}

export default function ProfileSettingsPage() {
  // In a real app, this would come from the authenticated user's session
  const currentUser = {
    id: "user123",
    email: "player@gmail.com",
    name: "John Smith",
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your profile information and account settings</p>
      </div>
      <Separator />

      <div className="space-y-8">
        <EmailChangeForm currentEmail={currentUser.email} userId={currentUser.id} />

        {/* Other profile settings would go here */}
      </div>
    </div>
  )
}
