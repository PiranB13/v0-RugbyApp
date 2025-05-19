import type { Metadata } from "next"
import { SecurityDashboard } from "@/components/security/security-dashboard"

export const metadata: Metadata = {
  title: "Security Overview | RugbyConnect",
  description: "View and manage your account security status",
}

export default function SecurityOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security Overview</h3>
        <p className="text-sm text-muted-foreground">
          View the current security status of your account and get recommendations for improvement
        </p>
      </div>

      <SecurityDashboard />
    </div>
  )
}
