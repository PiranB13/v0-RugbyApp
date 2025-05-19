"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ShieldAlert,
  ShieldX,
  Smartphone,
  User,
  Mail,
  Key,
  Eye,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SecurityFeature {
  id: string
  name: string
  description: string
  enabled: boolean
  critical: boolean
  icon: React.ElementType
  action: {
    text: string
    href: string
  }
}

interface SecurityScore {
  score: number
  level: "critical" | "warning" | "good" | "excellent"
  label: string
  color: string
}

export function SecurityDashboard() {
  // In a real app, this would be fetched from an API
  const [securityFeatures, setSecurityFeatures] = useState<SecurityFeature[]>([
    {
      id: "strong-password",
      name: "Strong Password",
      description: "Your password meets our strength requirements",
      enabled: true,
      critical: true,
      icon: Key,
      action: {
        text: "Change Password",
        href: "/settings/security",
      },
    },
    {
      id: "two-factor",
      name: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      enabled: false,
      critical: true,
      icon: Smartphone,
      action: {
        text: "Enable 2FA",
        href: "/settings/security",
      },
    },
    {
      id: "email-verified",
      name: "Email Verified",
      description: "Your email address has been verified",
      enabled: true,
      critical: true,
      icon: Mail,
      action: {
        text: "Manage Email",
        href: "/settings/profile",
      },
    },
    {
      id: "recovery-questions",
      name: "Recovery Questions",
      description: "Set up questions to recover your account",
      enabled: false,
      critical: false,
      icon: AlertCircle,
      action: {
        text: "Set Up Questions",
        href: "/settings/security",
      },
    },
    {
      id: "recent-password-change",
      name: "Recent Password Change",
      description: "Password changed in the last 90 days",
      enabled: true,
      critical: false,
      icon: Clock,
      action: {
        text: "Change Password",
        href: "/settings/security",
      },
    },
    {
      id: "login-alerts",
      name: "Login Alerts",
      description: "Get notified of new device logins",
      enabled: false,
      critical: false,
      icon: Eye,
      action: {
        text: "Enable Alerts",
        href: "/settings/security",
      },
    },
  ])

  const [securityScore, setSecurityScore] = useState<SecurityScore>({
    score: 0,
    level: "critical",
    label: "Critical",
    color: "bg-red-500",
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: "1",
      type: "login",
      description: "New login from Chrome on Windows",
      date: "2 days ago",
      location: "London, UK",
      ip: "192.168.1.1",
      critical: false,
    },
    {
      id: "2",
      type: "password",
      description: "Password changed successfully",
      date: "2 weeks ago",
      location: "London, UK",
      ip: "192.168.1.1",
      critical: false,
    },
    {
      id: "3",
      type: "login_attempt",
      description: "Failed login attempt",
      date: "3 weeks ago",
      location: "Paris, France",
      ip: "192.168.1.2",
      critical: true,
    },
  ])

  // Calculate security score based on enabled features
  useEffect(() => {
    const criticalFeatures = securityFeatures.filter((f) => f.critical)
    const enabledCriticalFeatures = criticalFeatures.filter((f) => f.enabled)
    const nonCriticalFeatures = securityFeatures.filter((f) => !f.critical)
    const enabledNonCriticalFeatures = nonCriticalFeatures.filter((f) => f.enabled)

    // Critical features are worth 70% of the score, non-critical 30%
    const criticalScore =
      criticalFeatures.length > 0 ? (enabledCriticalFeatures.length / criticalFeatures.length) * 70 : 0

    const nonCriticalScore =
      nonCriticalFeatures.length > 0 ? (enabledNonCriticalFeatures.length / nonCriticalFeatures.length) * 30 : 0

    const totalScore = Math.round(criticalScore + nonCriticalScore)

    let level: SecurityScore["level"] = "critical"
    let label = "Critical"
    let color = "bg-red-500"

    if (totalScore >= 90) {
      level = "excellent"
      label = "Excellent"
      color = "bg-emerald-500"
    } else if (totalScore >= 70) {
      level = "good"
      label = "Good"
      color = "bg-green-500"
    } else if (totalScore >= 40) {
      level = "warning"
      label = "Fair"
      color = "bg-amber-500"
    }

    setSecurityScore({ score: totalScore, level, label, color })
  }, [securityFeatures])

  // Toggle a security feature (for demo purposes)
  const toggleFeature = (id: string) => {
    setSecurityFeatures((features) =>
      features.map((feature) => (feature.id === id ? { ...feature, enabled: !feature.enabled } : feature)),
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Security Score Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Security Score</CardTitle>
            <CardDescription>Overall assessment of your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-3 py-4">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-muted">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-background">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-bold">{securityScore.score}%</span>
                    <span
                      className={`text-sm font-medium ${
                        securityScore.level === "critical"
                          ? "text-red-500"
                          : securityScore.level === "warning"
                            ? "text-amber-500"
                            : securityScore.level === "good"
                              ? "text-green-500"
                              : "text-emerald-500"
                      }`}
                    >
                      {securityScore.label}
                    </span>
                  </div>
                </div>
                <svg className="absolute inset-0 h-full w-full rotate-90">
                  <circle
                    className="text-muted"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="64"
                    cx="80"
                    cy="80"
                  />
                  <circle
                    className={securityScore.color}
                    strokeWidth="12"
                    strokeDasharray={`${securityScore.score * 4} 400`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="64"
                    cx="80"
                    cy="80"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-[#1e4620] hover:bg-[#2a5f2d] text-white">
              <Link href="/settings/security">Improve Security</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Security Recommendations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Recommendations</CardTitle>
            <CardDescription>Steps to improve your account security</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              {securityFeatures
                .filter((feature) => !feature.enabled)
                .slice(0, 3)
                .map((feature) => (
                  <div key={feature.id} className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {feature.critical ? (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      ) : (
                        <ShieldAlert className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium leading-none">{feature.name}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={feature.action.href}>{feature.action.text}</Link>
                    </Button>
                  </div>
                ))}

              {securityFeatures.filter((feature) => !feature.enabled).length === 0 && (
                <div className="flex items-center justify-center py-6 text-center">
                  <div className="space-y-2">
                    <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                    <p className="font-medium">All security features enabled!</p>
                    <p className="text-sm text-muted-foreground">
                      Your account has all recommended security features enabled.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/settings/security">View All Recommendations</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle>Security Features</CardTitle>
          <CardDescription>Overview of your account security features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {securityFeatures.map((feature) => (
              <Card key={feature.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-5 w-5 text-muted-foreground" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex h-6 items-center rounded-full px-2 text-xs font-medium ${
                              feature.enabled
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : feature.critical
                                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                            }`}
                          >
                            {feature.enabled ? "Enabled" : feature.critical ? "Required" : "Recommended"}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {feature.enabled
                            ? "This security feature is enabled"
                            : feature.critical
                              ? "This security feature is critical and should be enabled"
                              : "This security feature is recommended for better protection"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <h4 className="font-medium">{feature.name}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="ghost" size="sm" className="w-full justify-between" asChild>
                    <Link href={feature.action.href}>
                      {feature.action.text}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Activity</CardTitle>
          <CardDescription>Recent security events on your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 rounded-lg border p-4">
                <div
                  className={`mt-0.5 rounded-full p-1 ${
                    activity.critical
                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                      : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                  }`}
                >
                  {activity.type === "login" && <User className="h-4 w-4" />}
                  {activity.type === "password" && <Key className="h-4 w-4" />}
                  {activity.type === "login_attempt" && <ShieldX className="h-4 w-4" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{activity.description}</p>
                    <span className="text-xs text-muted-foreground">{activity.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activity.location} • IP: {activity.ip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/settings/security">View All Activity</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
