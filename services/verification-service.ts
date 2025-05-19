// This is a mock service - in a real application, this would interact with a database
// and send actual emails through an email service

// Mock database of verification tokens
const verificationTokens: Record<
  string,
  {
    email: string
    token: string
    expires: Date
    type: "new-account" | "email-change"
    userId?: string
    newEmail?: string
  }
> = {}

export const VerificationService = {
  // Generate a verification token
  generateToken: (email: string, type: "new-account" | "email-change", userId?: string, newEmail?: string) => {
    // In a real app, use a secure random token generator
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Set expiration to 24 hours from now
    const expires = new Date()
    expires.setHours(expires.getHours() + 24)

    // Store the token
    verificationTokens[token] = {
      email,
      token,
      expires,
      type,
      userId,
      newEmail,
    }

    return token
  },

  // Verify a token
  verifyToken: (token: string) => {
    const record = verificationTokens[token]

    if (!record) {
      return { valid: false, message: "Invalid verification token" }
    }

    if (new Date() > record.expires) {
      delete verificationTokens[token]
      return { valid: false, message: "Verification token has expired" }
    }

    return {
      valid: true,
      email: record.email,
      type: record.type,
      userId: record.userId,
      newEmail: record.newEmail,
    }
  },

  // Consume a token (mark as used)
  consumeToken: (token: string) => {
    const record = verificationTokens[token]

    if (record) {
      delete verificationTokens[token]
      return true
    }

    return false
  },

  // Send verification email (mock implementation)
  sendVerificationEmail: (email: string, token: string, type: "new-account" | "email-change") => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const verificationUrl = `${baseUrl}/verify-email?token=${token}`

    console.log(`Sending verification email to ${email}`)
    console.log(`Verification URL: ${verificationUrl}`)
    console.log(`Email type: ${type}`)

    // In a real app, this would send an actual email
    return Promise.resolve({
      success: true,
      verificationUrl,
    })
  },
}
