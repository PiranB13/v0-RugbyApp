"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Bell, FileText, Lock, SettingsIcon, User, Shield } from "lucide-react"

interface SettingsNavigationProps {
  className?: string
}

export function SettingsNavigation({ className }: SettingsNavigationProps) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/settings",
      label: "General",
      icon: <SettingsIcon className="mr-2 h-4 w-4" />,
      active: pathname === "/settings",
    },
    {
      href: "/settings/profile",
      label: "Profile",
      icon: <User className="mr-2 h-4 w-4" />,
      active: pathname === "/settings/profile",
    },
    {
      href: "/settings/notifications",
      label: "Notifications",
      icon: <Bell className="mr-2 h-4 w-4" />,
      active: pathname === "/settings/notifications",
    },
    {
      href: "/settings/message-templates",
      label: "Message Templates",
      icon: <FileText className="mr-2 h-4 w-4" />,
      active: pathname === "/settings/message-templates",
    },
    {
      href: "/settings/security/overview",
      label: "Security Overview",
      icon: <Shield className="mr-2 h-4 w-4" />,
      active: pathname === "/settings/security/overview",
    },
    {
      href: "/settings/security",
      label: "Security Settings",
      icon: <Lock className="mr-2 h-4 w-4" />,
      active: pathname === "/settings/security" && pathname !== "/settings/security/overview",
    },
  ]

  return (
    <nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)}>
      {routes.map((route) => (
        <Button
          key={route.href}
          variant={route.active ? "secondary" : "ghost"}
          className={cn(
            "justify-start",
            route.active ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
          )}
          asChild
        >
          <Link href={route.href}>
            {route.icon}
            {route.label}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
