"use client"

import { useState } from "react"
import { Check, Copy, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import QRCode from "qrcode.react"

export function TwoFactorAuth() {
  const [enabled, setEnabled] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [secretKey, setSecretKey] = useState("JBSWY3DPEHPK3PXP") // Example key, would be generated server-side
  const [copied, setCopied] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleToggle = (checked: boolean) => {
    if (checked && !verified) {
      setShowSetup(true)
    } else if (!checked && verified) {
      // Would normally show a confirmation dialog here
      setEnabled(false)
      setVerified(false)
    } else {
      setEnabled(checked)
    }
  }

  const generateNewKey = () => {
    // In a real app, this would call an API to generate a new secret key
    const newKey = "KBSWY3DPEHPK3PXQ" // Example only
    setSecretKey(newKey)
    setCopied(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secretKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const verifyCode = () => {
    // In a real app, this would validate the code against the server
    // For demo purposes, we'll accept any 6-digit code
    if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
      setVerified(true)
      setEnabled(true)
      setShowSetup(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Two-factor Authentication</h3>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account by requiring a verification code.
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={handleToggle} />
      </div>

      {showSetup && !verified && (
        <Card>
          <CardHeader>
            <CardTitle>Set up Two-factor Authentication</CardTitle>
            <CardDescription>
              Scan the QR code with an authenticator app like Google Authenticator or Authy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <QRCode
                value={`otpauth://totp/RugbyConnect:user@example.com?secret=${secretKey}&issuer=RugbyConnect`}
                size={200}
                level="H"
                includeMargin={true}
                className="bg-white p-2 rounded-md"
              />
              <div className="flex items-center space-x-2">
                <p className="text-sm font-mono bg-muted p-2 rounded">{secretKey}</p>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={generateNewKey}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={verifyCode} disabled={verificationCode.length !== 6}>
              Verify and Enable
            </Button>
          </CardFooter>
        </Card>
      )}

      {verified && enabled && (
        <div className="text-sm text-green-600 dark:text-green-400">
          Two-factor authentication is enabled and active.
        </div>
      )}
    </div>
  )
}
