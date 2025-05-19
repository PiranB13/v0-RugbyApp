import { UserRoundPlus, Search, Users } from "lucide-react"
import SignUpForm from "@/components/sign-up-form"
import { SiteHeader } from "@/components/site-header"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Connect Rugby Talent with Opportunity</h2>
              <p className="text-xl text-muted-foreground">
                A platform for UK amateur and semi-pro players, clubs, and coaches
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">How it works</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#1e4620] dark:bg-[#1e4620] p-3 rounded-full text-white">
                    <UserRoundPlus className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Create Profile</h4>
                    <p className="text-muted-foreground">Sign up and build your player or coach profile</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#1e4620] dark:bg-[#1e4620] p-3 rounded-full text-white">
                    <Search className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Find Clubs</h4>
                    <p className="text-muted-foreground">Discover amateur and semi-pro clubs seeking talent</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#1e4620] dark:bg-[#1e4620] p-3 rounded-full text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Get Recruited</h4>
                    <p className="text-muted-foreground">Connect with clubs and seize new opportunities</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-8 mt-8">
              <p className="text-2xl font-semibold text-center italic text-[#1e4620] dark:text-[#3a8e3f]">
                Built for Rugby
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="bg-card text-card-foreground p-8 rounded-xl border border-border">
            <SignUpForm />
          </div>
        </div>
      </main>
    </div>
  )
}
