"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle } from "lucide-react"

interface PasswordStrengthProps {
  password: string
  showChecklist?: boolean
}

export function PasswordStrength({ password, showChecklist = false }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [checks, setChecks] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  useEffect(() => {
    if (!password) {
      setStrength(0)
      setFeedback("")
      setChecks({
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
      })
      return
    }

    // Update checks
    const updatedChecks = {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    }
    setChecks(updatedChecks)

    // Calculate password strength
    let score = 0

    // Length check
    if (updatedChecks.hasMinLength) score += 20
    if (password.length >= 12) score += 10

    // Character variety checks
    if (updatedChecks.hasUppercase) score += 15
    if (updatedChecks.hasLowercase) score += 15
    if (updatedChecks.hasNumber) score += 15
    if (updatedChecks.hasSpecialChar) score += 25

    // Penalize common patterns
    if (/^[A-Za-z]+$/.test(password)) score -= 10 // Only letters
    if (/^[0-9]+$/.test(password)) score -= 15 // Only numbers
    if (/(.)\1{2,}/.test(password)) score -= 10 // Repeated characters

    // Ensure score is between 0-100
    score = Math.max(0, Math.min(100, score))

    setStrength(score)

    // Set feedback based on score
    if (score < 30) {
      setFeedback("Very weak - Please choose a stronger password")
    } else if (score < 50) {
      setFeedback("Weak - Add numbers and special characters")
    } else if (score < 70) {
      setFeedback("Moderate - Consider a longer password")
    } else if (score < 90) {
      setFeedback("Strong - Good password choice")
    } else {
      setFeedback("Very strong - Excellent password")
    }
  }, [password])

  const getStrengthColor = () => {
    if (strength < 30) return "bg-red-500"
    if (strength < 50) return "bg-orange-500"
    if (strength < 70) return "bg-yellow-500"
    if (strength < 90) return "bg-green-500"
    return "bg-emerald-500"
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span>Password strength:</span>
        <span
          className={
            strength < 30
              ? "text-red-500"
              : strength < 50
                ? "text-orange-500"
                : strength < 70
                  ? "text-yellow-500"
                  : strength < 90
                    ? "text-green-500"
                    : "text-emerald-500"
          }
        >
          {strength < 30
            ? "Very weak"
            : strength < 50
              ? "Weak"
              : strength < 70
                ? "Moderate"
                : strength < 90
                  ? "Strong"
                  : "Very strong"}
        </span>
      </div>
      <Progress value={strength} className="h-2" indicatorClassName={getStrengthColor()} />
      {feedback && <p className="text-xs text-muted-foreground">{feedback}</p>}

      {showChecklist && (
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium mb-1">Password requirements:</p>
          <div className="grid grid-cols-1 gap-1">
            <div className="flex items-center gap-2 text-xs">
              {checks.hasMinLength ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-red-500" />
              )}
              <span>At least 8 characters</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {checks.hasUppercase ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-red-500" />
              )}
              <span>At least one uppercase letter</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {checks.hasLowercase ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-red-500" />
              )}
              <span>At least one lowercase letter</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {checks.hasNumber ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-red-500" />
              )}
              <span>At least one number</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {checks.hasSpecialChar ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-red-500" />
              )}
              <span>At least one special character</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
