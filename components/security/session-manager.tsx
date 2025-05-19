"use client"

import { useState } from "react"
import { Laptop, Smartphone, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Session {
  id: string
  device: "mobile" | "desktop" | "tablet"
  browser: string
  location: string
  ip: string
  lastActive: string
  current: boolean
}

export function SessionManager() {
  // Mock data - in a real app, this would come from an API
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      device: "desktop",
      browser: "Chrome on Windows",
      location: "London, UK",
      ip: "192.168.1.1",
      lastActive: "Active now",
      current: true,
    },
    {
      id: "2",
      device: "mobile",
      browser: "Safari on iPhone",
      location: "Manchester, UK",
      ip: "192.168.1.2",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: "3",
      device: "desktop",
      browser: "Firefox on macOS",
      location: "Edinburgh, UK",
      ip: "192.168.1.3",
      lastActive: "3 days ago",
      current: false,
    },
  ])

  const handleTerminateSession = (sessionId: string) => {
    // In a real app, this would call an API to terminate the session
    setSessions(sessions.filter((session) => session.id !== sessionId))
  }

  const handleTerminateAllOtherSessions = () => {
    // In a real app, this would call an API to terminate all other sessions
    setSessions(sessions.filter((session) => session.current))
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Active Sessions</h3>
        <p className="text-sm text-muted-foreground">Manage your active sessions across different devices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your devices</CardTitle>
          <CardDescription>These are the devices that are currently logged into your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-muted p-2">
                      {session.device === "mobile" ? (
                        <Smartphone className="h-5 w-5" />
                      ) : (
                        <Laptop className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{session.browser}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <p>
                          {session.location} • {session.ip}
                        </p>
                      </div>
                      <div className="flex items-center mt-1">
                        <p className="text-xs text-muted-foreground">{session.lastActive}</p>
                        {session.current && (
                          <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={session.current}
                    onClick={() => handleTerminateSession(session.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Terminate session</span>
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleTerminateAllOtherSessions}
            disabled={sessions.length === 1}
          >
            Sign out from all other devices
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
