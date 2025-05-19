import Image from "next/image"
import { SiteHeader } from "@/components/site-header"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About RugbyConnect</h1>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg mb-4">
              RugbyConnect is dedicated to connecting the global rugby community through technology. We aim to create
              opportunities for players, coaches, and clubs at all levels of the game.
            </p>
            <p className="text-lg">
              Our platform bridges the gap between talent and opportunity in the rugby world, making it easier for
              players to showcase their abilities and for clubs to discover the right talent for their teams.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-lg mb-4">
              Founded in 2023 by a group of rugby enthusiasts with backgrounds in technology, RugbyConnect was born from
              the recognition that talented players often struggle to connect with clubs that would value their skills.
            </p>
            <p className="text-lg">
              What started as a simple idea has grown into a comprehensive platform serving the UK rugby community, with
              plans to expand globally in the coming years.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                    <Image src="/team/founder.png" alt="James Wilson" fill className="object-cover" />
                  </div>
                  <h3 className="text-xl font-semibold">James Wilson</h3>
                  <p className="text-muted-foreground">Founder & CEO</p>
                  <p className="text-center mt-4">
                    Former club rugby player with 15 years of experience in sports technology.
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                    <Image src="/team/cto.png" alt="Sarah Chen" fill className="object-cover" />
                  </div>
                  <h3 className="text-xl font-semibold">Sarah Chen</h3>
                  <p className="text-muted-foreground">CTO</p>
                  <p className="text-center mt-4">
                    Tech leader with a passion for creating platforms that connect communities.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
