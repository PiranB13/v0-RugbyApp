import type { Metadata } from "next"
import Image from "next/image"
import { RabbitIcon as Rugby } from "lucide-react"
import SignUpForm from "@/components/sign-up-form"

export const metadata: Metadata = {
  title: "Sign Up | RugbyConnect",
  description: "Create your RugbyConnect account to connect with clubs, players, and coaches.",
}

export default function SignUpPage() {
  return (
    <div className="container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-[#1e4620] dark:bg-[#1e4620]" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Rugby className="mr-2 h-6 w-6" />
          <span>RugbyConnect</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "RugbyConnect has helped me showcase my skills and connect with clubs I never would have found otherwise."
            </p>
            <footer className="text-sm">James Wilson - Fly-half, Exeter Chiefs Academy</footer>
          </blockquote>
        </div>
        <div className="relative z-20 mt-auto">
          <Image
            src="/rugby-player-action.png"
            alt="Rugby player in action"
            width={600}
            height={400}
            className="rounded-md object-cover opacity-80"
          />
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Join the RugbyConnect community to connect with clubs, players, and coaches
            </p>
          </div>
          <SignUpForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By creating an account, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
