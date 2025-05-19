"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { PasswordStrength } from "@/components/security/password-strength"
import { toast } from "@/components/ui/use-toast"

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: "" }))
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      name: "",
      email: "",
      password: "",
      role: "",
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      valid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      valid = false
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter"
      valid = false
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter"
      valid = false
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number"
      valid = false
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character"
      valid = false
    }

    if (!formData.role) {
      newErrors.role = "Please select a role"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would create the user in the database with a "pending" status
      // For this demo, we'll just simulate sending a verification email
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsVerificationSent(true)
      toast({
        title: "Verification email sent",
        description: `We've sent a verification email to ${formData.email}. Please check your inbox and follow the instructions to verify your account.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isVerificationSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Check Your Email</h3>
          <p className="text-muted-foreground">
            We've sent a verification email to <span className="font-medium">{formData.email}</span>
          </p>
        </div>

        <div className="bg-muted/50 p-6 rounded-lg space-y-4">
          <p>Please check your inbox and click the verification link to activate your account.</p>
          <p className="text-sm text-muted-foreground">
            If you don't see the email, check your spam folder or{" "}
            <button
              className="text-[#1e4620] dark:text-[#3a8e3f] hover:underline"
              onClick={() => {
                // Resend verification email
                toast({
                  title: "Verification email resent",
                  description: "We've sent another verification email. Please check your inbox.",
                })
              }}
            >
              click here to resend
            </button>
          </p>
        </div>

        <div>
          <Link href="/signin" className="text-[#1e4620] dark:text-[#3a8e3f] hover:underline">
            Return to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Join RugbyConnect</h3>
        <p className="text-muted-foreground">Create your account to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@gmail.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.password ? "border-red-500" : ""}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={togglePasswordVisibility}
              disabled={isSubmitting}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          {formData.password && <PasswordStrength password={formData.password} showChecklist={true} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">I am a</Label>
          <Select onValueChange={handleRoleChange} disabled={isSubmitting}>
            <SelectTrigger className={errors.role ? "border-red-500" : ""}>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="player">Player</SelectItem>
              <SelectItem value="coach">Coach</SelectItem>
              <SelectItem value="club">Club</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
        </div>

        <Button type="submit" className="w-full bg-[#1e4620] hover:bg-[#2a5f2d] text-white" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Join RugbyConnect
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="text-[#1e4620] dark:text-[#3a8e3f] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
