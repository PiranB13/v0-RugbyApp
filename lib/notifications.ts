// Check if the browser supports service workers and push notifications
export function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window
}

// Check if we're in a preview environment (like vusercontent.net)
export function isPreviewEnvironment() {
  if (typeof window === "undefined") return false
  return (
    window.location.hostname.includes("vusercontent.net") ||
    window.location.hostname.includes("vercel.app") ||
    window.location.hostname.includes("localhost")
  )
}

// Register the service worker
export async function registerServiceWorker() {
  if (!isPushNotificationSupported()) {
    return null
  }

  // Skip service worker registration in preview environments
  if (isPreviewEnvironment()) {
    console.log("Skipping service worker registration in preview environment")
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register("/service-worker.js")
    return registration
  } catch (error) {
    console.error("Service Worker registration failed:", error)
    return null
  }
}

// Request permission and subscribe to push notifications
export async function subscribeToPushNotifications(userId: string) {
  if (!isPushNotificationSupported()) {
    return { success: false, message: "Push notifications are not supported in this browser." }
  }

  // Use simplified notification flow in preview environments
  if (isPreviewEnvironment()) {
    try {
      const permission = await Notification.requestPermission()
      return {
        success: permission === "granted",
        message:
          permission === "granted"
            ? "Notification permission granted in preview mode."
            : "Notification permission denied.",
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return { success: false, message: "Failed to request notification permission." }
    }
  }

  try {
    // Request permission
    const permission = await Notification.requestPermission()
    if (permission !== "granted") {
      return { success: false, message: "Notification permission denied." }
    }

    // Register service worker
    const registration = await registerServiceWorker()
    if (!registration) {
      return { success: false, message: "Service worker registration failed." }
    }

    // Get existing subscription or create a new one
    let subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      // Get the server's public key for VAPID
      const response = await fetch("/api/notifications/public-key")
      const { publicKey } = await response.json()

      // Create a new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })
    }

    // Send the subscription to the server
    const result = await saveSubscription(subscription, userId)
    return result
  } catch (error) {
    console.error("Error subscribing to push notifications:", error)
    return { success: false, message: "Failed to subscribe to push notifications." }
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications(userId: string) {
  if (!isPushNotificationSupported()) {
    return { success: false, message: "Push notifications are not supported in this browser." }
  }

  // Handle preview environment
  if (isPreviewEnvironment()) {
    return { success: true, message: "Unsubscribed from notifications in preview mode." }
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      return { success: true, message: "No subscription found." }
    }

    // Unsubscribe on the client
    await subscription.unsubscribe()

    // Remove subscription from the server
    const result = await deleteSubscription(userId)
    return result
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error)
    return { success: false, message: "Failed to unsubscribe from push notifications." }
  }
}

// Save subscription to the server
async function saveSubscription(subscription: PushSubscription, userId: string) {
  try {
    const response = await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription,
        userId,
      }),
    })

    return await response.json()
  } catch (error) {
    console.error("Error saving subscription:", error)
    return { success: false, message: "Failed to save subscription." }
  }
}

// Delete subscription from the server
async function deleteSubscription(userId: string) {
  try {
    const response = await fetch("/api/notifications/unsubscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })

    return await response.json()
  } catch (error) {
    console.error("Error deleting subscription:", error)
    return { success: false, message: "Failed to delete subscription." }
  }
}

// Convert a base64 string to Uint8Array for the applicationServerKey
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}
