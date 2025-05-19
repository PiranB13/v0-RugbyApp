import { NotificationSettings } from "@/components/notification-settings"

export default function NotificationsSettingsPage() {
  // In a real app, you would get the user ID from the session
  const userId = "player1"

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Notification Settings</h1>
      <p className="text-muted-foreground mb-8">
        Manage how you receive notifications from RugbyConnect. We'll always notify you about important updates related
        to your account.
      </p>

      <div className="space-y-8">
        <NotificationSettings userId={userId} />

        <div className="bg-muted/30 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">About Push Notifications</h2>
          <p className="mb-4">
            Push notifications allow RugbyConnect to send you alerts even when you're not using the app. This helps you
            stay updated on:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>New messages from clubs and coaches</li>
            <li>Updates on opportunities you've expressed interest in</li>
            <li>Important announcements from clubs you follow</li>
            <li>Reminders about upcoming trials or events</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            You can change your notification preferences or disable them completely at any time.
          </p>
        </div>
      </div>
    </div>
  )
}
