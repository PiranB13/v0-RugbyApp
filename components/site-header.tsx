import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-[#1e4620] dark:text-[#3a8e3f]">Rugby</span>Connect
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/about" className="text-foreground hover:text-muted-foreground transition-colors">
            About us
          </Link>
          <Link href="/features" className="text-foreground hover:text-muted-foreground transition-colors">
            Features
          </Link>
          <Link
            href="/signin"
            className="bg-[#1e4620] hover:bg-[#2a5f2d] px-4 py-2 rounded-md text-white transition-colors"
          >
            Sign In
          </Link>
          <ThemeToggle />
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button className="text-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu - hidden by default */}
      <div className="md:hidden hidden mt-4 py-4 border-t border-border">
        <div className="flex flex-col space-y-4">
          <Link href="/about" className="text-foreground hover:text-muted-foreground transition-colors">
            About us
          </Link>
          <Link href="/features" className="text-foreground hover:text-muted-foreground transition-colors">
            Features
          </Link>
          <Link
            href="/signin"
            className="bg-[#1e4620] hover:bg-[#2a5f2d] px-4 py-2 rounded-md text-white transition-colors inline-block text-center"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  )
}
