"use server"

import { revalidatePath } from "next/cache"

// In a real app, this would interact with a database
export async function sendMessageNotification(
  recipientId: string,
  senderId: string,
  senderName: string,
  messageContent: string,
  conversationId: string,
) {
  try {
    // Prepare the notification payload
    const notification = {
      title: `New message from ${senderName}`,
      body: messageContent.length > 100 ? messageContent.substring(0, 97) + "..." : messageContent,
      icon: "/logo.png",
      badge: "/badge.png",
      url: `/messages?conversation=${conversationId}`,
      actions: [
        {
          action: "view",
          title: "View Message",
        },
        {
          action: "reply",
          title: "Reply",
        },
      ],
    }

    // Send the notification via the API route
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/notifications/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: recipientId,
          notification,
        }),
      },
    )

    const result = await response.json()

    // If the subscription has expired, we should handle that
    if (response.status === 410) {
      console.log(`Subscription for user ${recipientId} has expired`)
      // In a real app, you might want to update the user's subscription status
    }

    // Revalidate the messages page to show the new message
    revalidatePath("/messages")

    return result
  } catch (error) {
    console.error("Error sending message notification:", error)
    return { success: false, message: "Failed to send notification" }
  }
}
