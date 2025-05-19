"use client"

import { useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MessageStatisticsProps {
  data: {
    conversations: number
    sent: number
    received: number
    unread: number
    attachments: number
    responseRate: number
    averageResponseTime: number
    messagesByCategory: {
      recruitment: number
      training: number
      administrative: number
      general: number
    }
    messagesByType: {
      text: number
      media: number
      document: number
      event: number
      invitation: number
    }
    messagesByDay: {
      day: string
      sent: number
      received: number
    }[]
    messagesByHour: {
      hour: string
      count: number
    }[]
  }
}

export function MessageStatistics({ data }: MessageStatisticsProps) {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week")

  const categoryData = [
    { name: "Recruitment", value: data.messagesByCategory.recruitment },
    { name: "Training", value: data.messagesByCategory.training },
    { name: "Administrative", value: data.messagesByCategory.administrative },
    { name: "General", value: data.messagesByCategory.general },
  ]

  const typeData = [
    { name: "Text", value: data.messagesByType.text },
    { name: "Media", value: data.messagesByType.media },
    { name: "Document", value: data.messagesByType.document },
    { name: "Event", value: data.messagesByType.event },
    { name: "Invitation", value: data.messagesByType.invitation },
  ]

  const dailyData = data.messagesByDay.map((item) => ({
    name: item.day,
    sent: item.sent,
    received: item.received,
  }))

  const hourlyData = data.messagesByHour.map((item) => ({
    name: item.hour,
    count: item.count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Statistics</CardTitle>
        <CardDescription>Overview of message activity and distribution.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="types">Types</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="hourly">Hourly</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Conversations</CardTitle>
                </CardHeader>
                <CardContent>{data.conversations}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sent Messages</CardTitle>
                </CardHeader>
                <CardContent>{data.sent}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Received Messages</CardTitle>
                </CardHeader>
                <CardContent>{data.received}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Unread Messages</CardTitle>
                </CardHeader>
                <CardContent>{data.unread}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>{data.attachments}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Response Rate</CardTitle>
                </CardHeader>
                <CardContent>{data.responseRate}%</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Avg. Response Time</CardTitle>
                </CardHeader>
                <CardContent>{data.averageResponseTime}s</CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="categories">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="types">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="daily">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="#ffc658" />
                <Bar dataKey="received" fill="#a45de2" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="hourly">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
