import { type NextRequest, NextResponse } from "next/server"

// In a real application, this would be stored in a database
const subscriptions: Record<string, PushSubscription> = {}

export async function POST(request: NextRequest) {
  try {
    const { subscription, userId } = await request.json()

    if (!subscription || !userId) {
      return NextResponse.json({ success: false, message: "Missing subscription or userId" }, { status: 400 })
    }

    // Store the subscription
    subscriptions[userId] = subscription

    return NextResponse.json({
      success: true,
      message: "Subscription saved successfully",
    })
  } catch (error) {
    console.error("Error saving subscription:", error)
    return NextResponse.json({ success: false, message: "Failed to save subscription" }, { status: 500 })
  }
}
