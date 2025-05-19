import type { Metadata } from "next"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { PasswordChangeForm } from "@/components/security/password-change-form"
import { Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Security Settings | RugbyConnect",
  description: "Manage your account security settings",
}

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Security Settings</h3>
          <p className="text-sm text-muted-foreground">Manage your account security preferences and settings</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/settings/security/overview">
            <Shield className="mr-2 h-4 w-4" />
            Security Overview
          </Link>
        </Button>
      </div>
      <Separator />

      <div className="space-y-8">
        <PasswordChangeForm />
        <Separator />

        {/* Other security components would go here */}
      </div>
    </div>
  )
}
