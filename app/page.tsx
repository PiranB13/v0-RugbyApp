import { UserRoundPlus, Search, Handshake } from "lucide-react"
import SignUpForm from "@/components/sign-up-form"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              <span className="text-[#1e4620]">Rugby</span>Connect
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#about" className="text-white hover:text-gray-300 transition-colors">
              About us
            </a>
            <a href="#features" className="text-white hover:text-gray-300 transition-colors">
              Features
            </a>
            <a
              href="/signin"
              className="bg-[#1e4620] hover:bg-[#2a5f2d] px-4 py-2 rounded-md text-white transition-colors"
            >
              Sign In
            </a>
          </nav>
          <button className="md:hidden text-white">
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

        {/* Mobile menu - hidden by default */}
        <div className="md:hidden hidden mt-4 py-4 border-t border-zinc-800">
          <div className="flex flex-col space-y-4">
            <a href="#about" className="text-white hover:text-gray-300 transition-colors">
              About us
            </a>
            <a href="#features" className="text-white hover:text-gray-300 transition-colors">
              Features
            </a>
            <a
              href="/signin"
              className="bg-[#1e4620] hover:bg-[#2a5f2d] px-4 py-2 rounded-md text-white transition-colors inline-block text-center"
            >
              Sign In
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Connect Rugby Talent with Opportunity</h2>
              <p className="text-xl text-gray-300">
                A platform for UK amateur and semi-pro players, clubs, and coaches
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">How it works</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#1e4620] p-3 rounded-full">
                    <UserRoundPlus className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Create Profile</h4>
                    <p className="text-gray-300">Sign up and build your player or coach profile</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#1e4620] p-3 rounded-full">
                    <Search className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Find Clubs</h4>
                    <p className="text-gray-300">Discover amateur and semi-pro clubs seeking talent</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#1e4620] p-3 rounded-full">
                    <Handshake className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Get Recruited</h4>
                    <p className="text-gray-300">Connect with clubs and seize new opportunities</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-zinc-800 pt-8 mt-8">
              <p className="text-2xl font-semibold text-center italic text-[#3a8e3f]">Built for Rugby</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800">
            <SignUpForm />
          </div>
        </div>
      </main>
    </div>
  )
}
