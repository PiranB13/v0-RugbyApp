import Link from "next/link"
import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">RugbyConnect Features</h1>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Platform Overview</h2>
            <p className="text-lg mb-4">
              RugbyConnect offers a comprehensive suite of tools designed specifically for the rugby community. Our
              platform connects players, coaches, and clubs, creating opportunities and fostering growth in the sport we
              all love.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Key Features</h2>

            <div className="space-y-8">
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold mb-4">Professional Profiles</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-2/3">
                    <p className="mb-4">
                      Create detailed profiles showcasing your rugby experience, skills, and achievements. Upload
                      videos, stats, and testimonials to stand out to clubs and coaches.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-[#1e4620] mr-2" />
                        <span>Customizable player and coach profiles</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-[#1e4620] mr-2" />
                        <span>Video highlights with compression technology</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-[#1e4620] mr-2" />
                        <span>Performance statistics tracking</span>
                      </li>
                    </ul>
                  </div>
                  <div className="md:w-1/3 flex justify-center items-center">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image src="/rugby-player-profile.png" alt="Profile Feature" fill className="object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold mb-4">Advanced Discovery</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-2/3">
                    <p className="mb-4">
                      Find the perfect match with our advanced search and discovery tools. Filter by position,
                      experience level, location, and more to connect with the right players or clubs.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-[#1e4620] mr-2" />
                        <span>Map-based club and player search</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-[#1e4620] mr-2" />
                        <span>Advanced filtering options</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-[#1e4620] mr-2" />
                        <span>Geolocation-based recommendations</span>
                      </li>
                    </ul>
                  </div>
                  <div className="md:w-1/3 flex justify-center items-center">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image src="/rugby-map-search.png" alt="Discovery Feature" fill className="object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center mt-12">
            <Link
              href="/signup"
              className="bg-[#1e4620] hover:bg-[#2a5f2d] px-6 py-3 rounded-md text-white transition-colors text-lg font-medium"
            >
              Join RugbyConnect Today
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
