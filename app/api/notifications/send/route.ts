import { type NextRequest, NextResponse } from "next/server"
import webpush from "web-push"

// In a real application, these would be stored securely in environment variables
const VAPID_PUBLIC_KEY = "BLBx-hP5V3FlzH8C9tQM1xgUvmJFYlcuZ8DUH_fYEQjnc-ElyKMjDgAUMQI2R-3-3OHLFt7F9RhOvHSoYcFWpSA"
const VAPID_PRIVATE_KEY = "your-private-key-here"

// Set VAPID details
webpush.setVapidDetails("mailto:support@rugbyconnect.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

// In a real application, this would access the same database as the subscribe route
const subscriptions: Record<string, PushSubscription> = {}

export async function POST(request: NextRequest) {
  try {
    const { userId, notification } = await request.json()

    if (!userId || !notification) {
      return NextResponse.json({ success: false, message: "Missing userId or notification data" }, { status: 400 })
    }

    const subscription = subscriptions[userId]

    if (!subscription) {
      return NextResponse.json({ success: false, message: "No subscription found for this user" }, { status: 404 })
    }

    // Send the notification
    await webpush.sendNotification(subscription, JSON.stringify(notification))

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
    })
  } catch (error) {
    console.error("Error sending notification:", error)

    // Handle expired subscriptions
    if (error instanceof webpush.WebPushError && error.statusCode === 410) {
      // The subscription has expired or is no longer valid
      const { userId } = await request.json()
      delete subscriptions[userId]

      return NextResponse.json({ success: false, message: "Subscription has expired", expired: true }, { status: 410 })
    }

    return NextResponse.json({ success: false, message: "Failed to send notification" }, { status: 500 })
  }
}
