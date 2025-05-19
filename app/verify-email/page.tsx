"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { VerificationService } from "@/services/verification-service"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [verificationType, setVerificationType] = useState<"new-account" | "email-change" | null>(null)

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link. No token provided.")
      return
    }

    const verifyToken = async () => {
      try {
        const result = VerificationService.verifyToken(token)

        if (result.valid) {
          // In a real app, this would update the user's email verification status in the database
          VerificationService.consumeToken(token)
          setStatus("success")
          setVerificationType(result.type)

          if (result.type === "new-account") {
            setMessage("Your email has been verified successfully. Your account is now active.")
          } else {
            setMessage(`Your email change to ${result.newEmail} has been verified successfully.`)
          }
        } else {
          setStatus("error")
          setMessage(result.message)
        }
      } catch (error) {
        setStatus("error")
        setMessage("An error occurred during verification. Please try again.")
      }
    }

    verifyToken()
  }, [searchParams])

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {status === "loading" ? "Verifying your email address..." : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-16 w-16 text-[#1e4620] animate-spin" />
              <p>Verifying your email address...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-xl font-medium">Verification Successful</p>
              <p>{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="text-xl font-medium">Verification Failed</p>
              <p>{message}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => router.push(status === "success" ? "/dashboard" : "/")}
            className="bg-[#1e4620] hover:bg-[#2a5f2d] text-white"
          >
            {status === "success"
              ? verificationType === "new-account"
                ? "Go to Dashboard"
                : "Return to Profile"
              : "Return to Home"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
