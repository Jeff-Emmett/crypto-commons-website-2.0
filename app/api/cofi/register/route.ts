import { type NextRequest, NextResponse } from "next/server"
import { addRegistration, initializeSheetHeaders } from "@/lib/google-sheets"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, email } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Initialize headers if needed (first registration)
    await initializeSheetHeaders()

    // Add registration to Google Sheet
    const rowNumber = await addRegistration({
      name,
      email,
    })

    console.log(`[Register API] Registration added for ${name} at row ${rowNumber}`)

    return NextResponse.json({
      success: true,
      message: "Registration recorded",
      rowNumber,
    })
  } catch (error) {
    console.error("[Register API] Error:", error)
    return NextResponse.json(
      { error: "Failed to record registration" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Use POST to submit registration" },
    { status: 405 }
  )
}
