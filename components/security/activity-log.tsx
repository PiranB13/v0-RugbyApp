"use client"

import { useState } from "react"
import { format } from "date-fns"
import { AlertCircle, LogIn, Settings, UserPlus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface ActivityEvent {
  id: string
  type: "login" | "signup" | "settings_change" | "security_alert"
  description: string
  ipAddress: string
  location: string
  timestamp: Date
}

export function SecurityActivityLog() {
  // Mock data - in a real app, this would come from an API
  const [activities] = useState<ActivityEvent[]>([
    {
      id: "1",
      type: "login",
      description: "Successful login",
      ipAddress: "192.168.1.1",
      location: "London, UK",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
      id: "2",
      type: "settings_change",
      description: "Password changed",
      ipAddress: "192.168.1.1",
      location: "London, UK",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "3",
      type: "security_alert",
      description: "Failed login attempt",
      ipAddress: "203.0.113.1",
      location: "Unknown location",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: "4",
      type: "login",
      description: "Successful login from new device",
      ipAddress: "192.168.1.2",
      location: "Manchester, UK",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
      id: "5",
      type: "signup",
      description: "Account created",
      ipAddress: "192.168.1.1",
      location: "London, UK",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    },
  ])

  const getActivityIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "login":
        return <LogIn className="h-4 w-4" />
      case "signup":
        return <UserPlus className="h-4 w-4" />
      case "settings_change":
        return <Settings className="h-4 w-4" />
      case "security_alert":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Security Activity</h3>
        <p className="text-sm text-muted-foreground">Review recent security-related activity on your account</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>A record of security events and activities on your account</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 rounded-lg border p-4">
                  <div className="mt-0.5 rounded-full bg-muted p-2">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{activity.description}</p>
                      {activity.type === "security_alert" && <Badge variant="destructive">Alert</Badge>}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      <p>
                        {activity.location} • {activity.ipAddress}
                      </p>
                      <p className="mt-1">{format(activity.timestamp, "PPpp")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
