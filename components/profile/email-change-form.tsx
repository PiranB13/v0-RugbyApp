"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { VerificationService } from "@/services/verification-service"

interface EmailChangeFormProps {
  currentEmail: string
  userId: string
}

export function EmailChangeForm({ currentEmail, userId }: EmailChangeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newEmail) {
      toast({
        title: "Error",
        description: "Please enter a new email address",
        variant: "destructive",
      })
      return
    }

    if (newEmail === currentEmail) {
      toast({
        title: "Error",
        description: "New email must be different from your current email",
        variant: "destructive",
      })
      return
    }

    if (!password) {
      toast({
        title: "Error",
        description: "Please enter your password to confirm this change",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would verify the password first

      // Generate verification token and send email
      const token = VerificationService.generateToken(currentEmail, "email-change", userId, newEmail)

      await VerificationService.sendVerificationEmail(newEmail, token, "email-change")

      setVerificationSent(true)
      setPassword("")

      toast({
        title: "Verification email sent",
        description: `We've sent a verification email to ${newEmail}. Please check your inbox and follow the instructions to verify your new email address.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate email change. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setVerificationSent(false)
    setNewEmail("")
    setPassword("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Address</CardTitle>
        <CardDescription>
          Update your email address. A verification email will be sent to your new address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium">Current Email</p>
            <p className="text-sm text-muted-foreground">{currentEmail}</p>
          </div>
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-100">
            Verified
          </span>
        </div>

        {verificationSent ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 dark:bg-amber-900/20 dark:border-amber-800">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 dark:text-amber-500" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800 dark:text-amber-500">Verification Pending</h4>
                  <p className="text-sm text-amber-700 mt-1 dark:text-amber-400">
                    We've sent a verification email to <span className="font-medium">{newEmail}</span>. Please check
                    your inbox and click the verification link to complete your email change.
                  </p>
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Resend verification email
                        const token = VerificationService.generateToken(currentEmail, "email-change", userId, newEmail)
                        VerificationService.sendVerificationEmail(newEmail, token, "email-change")
                        toast({
                          title: "Verification email resent",
                          description: "We've sent another verification email. Please check your inbox.",
                        })
                      }}
                    >
                      Resend Email
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCancel} className="ml-2">
                      Cancel Change
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-email">New Email Address</Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter your new email address"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Current Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-muted-foreground">
                For security, please enter your current password to confirm this change.
              </p>
            </div>
          </form>
        )}
      </CardContent>
      {!verificationSent && (
        <CardFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#1e4620] hover:bg-[#2a5f2d] text-white"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Email
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
