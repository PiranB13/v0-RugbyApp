"use client"

import { useEffect, useState } from "react"
import { isPushNotificationSupported, registerServiceWorker, isPreviewEnvironment } from "@/lib/notifications"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function NotificationInitializer() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [serviceWorkerRegistered, setServiceWorkerRegistered] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Check if we're in a preview environment
    setIsPreview(isPreviewEnvironment())

    // Check if push notifications are supported
    if (!isPushNotificationSupported()) return

    // Register service worker (will be skipped in preview environments)
    const registerSW = async () => {
      const registration = await registerServiceWorker()
      if (registration) {
        setServiceWorkerRegistered(true)

        // Check if we should show the permission prompt
        if (Notification.permission === "default") {
          // Check if the user has been on the site for at least 30 seconds
          // This is to avoid immediately prompting new users
          setTimeout(() => {
            // Also check if they've interacted with the site
            if (document.hasFocus()) {
              setShowPrompt(true)
            }
          }, 30000) // 30 seconds
        }
      } else if (isPreviewEnvironment() && Notification.permission === "default") {
        // In preview environments, we can still show the prompt for demo purposes
        // but with a shorter delay
        setTimeout(() => {
          if (document.hasFocus()) {
            setShowPrompt(true)
          }
        }, 5000) // 5 seconds for preview
      }
    }

    registerSW()
  }, [])

  const handleEnableNotifications = async () => {
    try {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        // Show a test notification
        if (isPreview) {
          // In preview environments, use the basic Notification API
          new Notification("Notifications Enabled (Preview Mode)", {
            body: "This is a preview of notifications. Service workers are disabled in this environment.",
            icon: "/logo.png",
          })
        } else if (serviceWorkerRegistered) {
          // In production with service worker
          new Notification("Notifications Enabled", {
            body: "You will now receive notifications for new messages on RugbyConnect",
            icon: "/logo.png",
          })
        }
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
    } finally {
      setShowPrompt(false)
    }
  }

  if (!showPrompt) return null

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-[#1e4620] dark:text-[#3a8e3f]" />
            Enable Notifications
            {isPreview && <span className="ml-2 text-xs text-muted-foreground">(Preview Mode)</span>}
          </DialogTitle>
          <DialogDescription>
            Stay updated with new messages and opportunities from clubs and coaches.
            {isPreview && (
              <p className="mt-2 text-xs text-amber-600">
                Note: Full notification functionality is limited in preview environments.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">RugbyConnect can notify you when:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>You receive new messages</li>
            <li>Clubs respond to your applications</li>
            <li>New opportunities match your profile</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            You can change your notification preferences at any time in your settings.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowPrompt(false)}>
            Not Now
          </Button>
          <Button onClick={handleEnableNotifications} className="bg-[#1e4620] hover:bg-[#2a5f2d] text-white">
            Enable Notifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
