"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  isPushNotificationSupported,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} from "@/lib/notifications"

interface NotificationSettingsProps {
  userId: string
}

export function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [permissionState, setPermissionState] = useState<NotificationPermission | "default">("default")
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "info"; message: string } | null>(
    null,
  )

  useEffect(() => {
    // Check if push notifications are supported
    const supported = isPushNotificationSupported()
    setIsSupported(supported)

    if (supported) {
      // Check current permission state
      setPermissionState(Notification.permission)

      // Check if the user is already subscribed
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.pushManager.getSubscription().then((subscription) => {
            setNotificationsEnabled(!!subscription)
          })
        })
        .catch((error) => {
          console.error("Error checking subscription:", error)
        })
    }
  }, [])

  const handleToggleNotifications = async () => {
    if (!isSupported) return

    setIsLoading(true)
    setStatusMessage(null)

    try {
      if (notificationsEnabled) {
        // Unsubscribe
        const result = await unsubscribeFromPushNotifications(userId)
        if (result.success) {
          setNotificationsEnabled(false)
          setStatusMessage({ type: "success", message: "Notifications disabled successfully." })
        } else {
          setStatusMessage({ type: "error", message: result.message || "Failed to disable notifications." })
        }
      } else {
        // Subscribe
        const result = await subscribeToPushNotifications(userId)
        if (result.success) {
          setNotificationsEnabled(true)
          setPermissionState("granted")
          setStatusMessage({ type: "success", message: "Notifications enabled successfully." })
        } else {
          setStatusMessage({ type: "error", message: result.message || "Failed to enable notifications." })
          // Update permission state in case it was denied
          setPermissionState(Notification.permission)
        }
      }
    } catch (error) {
      console.error("Error toggling notifications:", error)
      setStatusMessage({ type: "error", message: "An unexpected error occurred." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Configure how you want to receive notifications about new messages and updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSupported && (
          <Alert variant="destructive">
            <BellOff className="h-4 w-4" />
            <AlertTitle>Not Supported</AlertTitle>
            <AlertDescription>
              Push notifications are not supported in your browser. Try using a modern browser like Chrome, Firefox, or
              Edge.
            </AlertDescription>
          </Alert>
        )}

        {isSupported && permissionState === "denied" && (
          <Alert variant="destructive">
            <BellOff className="h-4 w-4" />
            <AlertTitle>Notifications Blocked</AlertTitle>
            <AlertDescription>
              You have blocked notifications for this site. Please update your browser settings to allow notifications.
            </AlertDescription>
          </Alert>
        )}

        {statusMessage && (
          <Alert variant={statusMessage.type === "error" ? "destructive" : "default"}>
            <Info className="h-4 w-4" />
            <AlertTitle>{statusMessage.type === "error" ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{statusMessage.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications" className="text-base">
              Push Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications about new messages even when you're not using the app
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Switch
                    id="push-notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={handleToggleNotifications}
                    disabled={!isSupported || permissionState === "denied" || isLoading}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {!isSupported
                  ? "Your browser does not support push notifications"
                  : permissionState === "denied"
                    ? "You have blocked notifications for this site"
                    : notificationsEnabled
                      ? "Disable push notifications"
                      : "Enable push notifications"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications" className="text-base">
              Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive email notifications for important messages and updates
            </p>
          </div>
          <Switch id="email-notifications" defaultChecked />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">You can change these settings at any time</p>
        <Button variant="outline" size="sm">
          Advanced Settings
        </Button>
      </CardFooter>
    </Card>
  )
}
