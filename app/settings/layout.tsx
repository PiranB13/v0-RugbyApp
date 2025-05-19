import type React from "react"
import type { Metadata } from "next"
import { SettingsNavigation } from "@/components/settings-navigation"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
}

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr]">
      <aside className="hidden w-[200px] flex-col md:flex lg:w-[250px]">
        <SettingsNavigation />
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}
