import { NextResponse } from "next/server"

// In a real application, this would be stored securely in environment variables
const VAPID_PUBLIC_KEY = "BLBx-hP5V3FlzH8C9tQM1xgUvmJFYlcuZ8DUH_fYEQjnc-ElyKMjDgAUMQI2R-3-3OHLFt7F9RhOvHSoYcFWpSA"

export async function GET() {
  return NextResponse.json({ publicKey: VAPID_PUBLIC_KEY })
}
