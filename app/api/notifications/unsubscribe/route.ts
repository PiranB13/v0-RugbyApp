import { type NextRequest, NextResponse } from "next/server"

// In a real application, this would access the same database as the subscribe route
const subscriptions: Record<string, PushSubscription> = {}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 })
    }

    // Remove the subscription
    delete subscriptions[userId]

    return NextResponse.json({
      success: true,
      message: "Subscription removed successfully",
    })
  } catch (error) {
    console.error("Error removing subscription:", error)
    return NextResponse.json({ success: false, message: "Failed to remove subscription" }, { status: 500 })
  }
}
