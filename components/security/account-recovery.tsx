"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

// Mock data - in a real app, this would come from an API
const MOCK_SECURITY_QUESTIONS = [
  {
    id: "1",
    question: "What was the name of your first pet?",
  },
  {
    id: "2",
    question: "In what city were you born?",
  },
  {
    id: "3",
    question: "What was your childhood nickname?",
  },
]

export function AccountRecovery() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call to verify email
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStep(2)
    } catch (error) {
      setError("Failed to verify email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleSecurityQuestionsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if all questions are answered
    const allAnswered = MOCK_SECURITY_QUESTIONS.every((q) => answers[q.id]?.trim())
    if (!allAnswered) {
      setError("Please answer all security questions")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call to verify answers
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStep(3)
    } catch (error) {
      setError("Incorrect answers. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newPassword) {
      setError("Please enter a new password")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now log in with your new password.",
      })

      // In a real app, redirect to login page
      // router.push("/signin")
    } catch (error) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Account Recovery</CardTitle>
        <CardDescription>
          {step === 1 && "Enter your email to start the account recovery process"}
          {step === 2 && "Answer your security questions to verify your identity"}
          {step === 3 && "Create a new password for your account"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={isLoading}
              />
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSecurityQuestionsSubmit} className="space-y-6">
            {MOCK_SECURITY_QUESTIONS.map((question) => (
              <div key={question.id} className="space-y-2">
                <Label htmlFor={`question-${question.id}`}>{question.question}</Label>
                <Input
                  id={`question-${question.id}`}
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Your answer"
                  disabled={isLoading}
                />
              </div>
            ))}
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={isLoading}
              />
            </div>
          </form>
        )}
      </CardContent>

      <CardFooter>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1e4620] hover:bg-[#2a5f2d] text-white"
          onClick={(e) => {
            if (step === 1) handleEmailSubmit(e)
            else if (step === 2) handleSecurityQuestionsSubmit(e)
            else if (step === 3) handlePasswordSubmit(e)
          }}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {step === 1 && "Continue"}
          {step === 2 && "Verify Answers"}
          {step === 3 && "Reset Password"}
        </Button>
      </CardFooter>
    </Card>
  )
}
