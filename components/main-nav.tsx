"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Search, MessageSquare, User, Home, Map, Info, Layers } from "lucide-react"
import { NotificationsDropdown } from "@/components/notifications/notifications-dropdown"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <div className="flex items-center justify-between w-full">
      <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
        <Link
          href="/"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <span className="flex items-center">
            <Home className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">Home</span>
          </span>
        </Link>
        <Link
          href="/about"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/about" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <span className="flex items-center">
            <Info className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">About</span>
          </span>
        </Link>
        <Link
          href="/features"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/features" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <span className="flex items-center">
            <Layers className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">Features</span>
          </span>
        </Link>
        <Link
          href="/dashboard"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <span className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">Dashboard</span>
          </span>
        </Link>
        <Link
          href="/discover"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/discover" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <span className="flex items-center">
            <Search className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">Discover</span>
          </span>
        </Link>
        <Link
          href="/search"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/search" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <span className="flex items-center">
            <Map className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">Search</span>
          </span>
        </Link>
        <Link
          href="/messages"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/messages" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <span className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">Messages</span>
          </span>
        </Link>
      </nav>

      <div className="flex items-center space-x-2">
        {/* Notifications dropdown as a separate element */}
        <NotificationsDropdown />

        {/* Profile link as a separate element */}
        <Link href="/profile">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
        </Link>
      </div>
    </div>
  )
}
