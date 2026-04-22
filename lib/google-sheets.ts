import { google } from "googleapis"

// Initialize Google Sheets API
export function getGoogleSheetsClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}")

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  return google.sheets({ version: "v4", auth })
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID!
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || "Registrations"

export interface RegistrationData {
  name: string
  email?: string
}

export interface PaymentUpdateData {
  email?: string
  name?: string
  paymentSessionId: string
  paymentStatus: "Paid" | "Failed"
  paymentMethod?: string
  amountPaid?: string
  paymentDate?: string
  accommodationVenue?: string
  accommodationType?: string
  dayPassDays?: string
}

/**
 * Add a new registration to the Google Sheet with "Pending" status, or
 * update an existing Pending row matched by email. Dedups form re-submits.
 */
export async function addRegistration(data: RegistrationData): Promise<number> {
  const sheets = getGoogleSheetsClient()
  const timestamp = new Date().toISOString()
  const email = (data.email || "").toLowerCase().trim()

  const row = [
    timestamp, data.name, data.email || "",
    "", "", "", "", "", "",
    "Pending",
    "", "", "", "", "", "", "", "",
  ]

  if (email) {
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:R`,
    })
    const rows = existing.data.values || []
    for (let i = rows.length - 1; i >= 1; i--) {
      const r = rows[i]
      const rowEmail = (r[2] || "").toLowerCase().trim()
      const rowStatus = (r[9] || "").trim()
      if (rowEmail === email && rowStatus === "Pending") {
        const rowNumber = i + 1
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!A${rowNumber}:R${rowNumber}`,
          valueInputOption: "USER_ENTERED",
          requestBody: { values: [row] },
        })
        console.log(`[Google Sheets] Updated existing Pending registration for ${data.name} (${email}) at row ${rowNumber}`)
        return rowNumber
      }
    }
  }

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:R`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  })

  const updatedRange = response.data.updates?.updatedRange || ""
  const match = updatedRange.match(/!A(\d+):/)
  const rowNumber = match ? parseInt(match[1], 10) : -1

  console.log(`[Google Sheets] Added registration for ${data.name} at row ${rowNumber}`)
  return rowNumber
}

/**
 * Check whether a payment session ID is already recorded against a Paid row —
 * used for webhook idempotency.
 */
export async function isPaymentAlreadyProcessed(sessionId: string): Promise<boolean> {
  if (!sessionId) return false
  const sheets = getGoogleSheetsClient()
  try {
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!J:L`,
    })
    const rows = resp.data.values || []
    for (let i = 1; i < rows.length; i++) {
      const status = (rows[i][0] || "").trim()
      const savedId = (rows[i][2] || "").trim()
      if (status === "Paid" && savedId && savedId.includes(sessionId)) return true
    }
  } catch (err) {
    console.error("[Google Sheets] isPaymentAlreadyProcessed error:", err)
  }
  return false
}

/**
 * Update payment status for a registration
 * Finds the row by name (since email might not be available until payment)
 */
export async function updatePaymentStatus(data: PaymentUpdateData): Promise<boolean> {
  const sheets = getGoogleSheetsClient()

  try {
    // First, get all rows to find the matching registration
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:R`,
    })

    const rows = response.data.values || []

    // Find the row that matches (by name and has "Pending" status)
    // Start from index 1 to skip header row
    let targetRowIndex = -1
    for (let i = rows.length - 1; i >= 1; i--) {
      const row = rows[i]
      const rowName = row[1] // Column B: Name
      const rowStatus = row[9] // Column J: Payment Status

      // Match by name and pending status (most recent first)
      if (rowName === data.name && rowStatus === "Pending") {
        targetRowIndex = i + 1 // Convert to 1-indexed row number
        break
      }
    }

    if (targetRowIndex === -1) {
      console.error(`[Google Sheets] Could not find pending registration for ${data.name}`)
      return false
    }

    // Update the row with payment information
    const existingRow = rows[targetRowIndex - 1]
    const updateRange = `${SHEET_NAME}!C${targetRowIndex}:R${targetRowIndex}`
    const updateValues = [
      [
        data.email || existingRow[2] || "",                // C: Email (from Mollie or existing)
        existingRow[3],                                    // D: Contact (preserve)
        existingRow[4],                                    // E: Contributions (preserve)
        existingRow[5],                                    // F: Expectations (preserve)
        existingRow[6],                                    // G: How Heard (preserve)
        existingRow[7],                                    // H: Dietary (preserve)
        existingRow[8],                                    // I: Crew Consent (preserve)
        data.paymentStatus,                                // J: Payment Status
        data.paymentMethod || "",                          // K: Payment Method
        data.paymentSessionId,                             // L: Payment Session ID
        data.amountPaid || "",                             // M: Amount Paid
        data.paymentDate || new Date().toISOString(),      // N: Payment Date
        data.accommodationVenue || "",                     // O: Accommodation Venue
        data.accommodationType || "",                      // P: Accommodation Type
        existingRow[16] || "",                             // Q: Want Food (preserve)
        data.dayPassDays || existingRow[17] || "",         // R: Day Pass Days
      ],
    ]

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: updateRange,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: updateValues },
    })

    console.log(`[Google Sheets] Updated payment status to ${data.paymentStatus} for ${data.name} at row ${targetRowIndex}`)
    return true
  } catch (error) {
    console.error("[Google Sheets] Error updating payment status:", error)
    return false
  }
}

/**
 * Initialize the sheet with headers if it's empty
 */
export async function initializeSheetHeaders(): Promise<void> {
  const sheets = getGoogleSheetsClient()

  try {
    // Check if first row has data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:R1`,
    })

    if (!response.data.values || response.data.values.length === 0) {
      // Add headers
      const headers = [
        [
          "Timestamp",
          "Name",
          "Email",
          "Contact",
          "Contributions",
          "Expectations",
          "How Heard",
          "Dietary",
          "Crew Consent",
          "Payment Status",
          "Payment Method",
          "Payment Session ID",
          "Amount Paid",
          "Payment Date",
          "Accommodation Venue",
          "Accommodation Type",
          "Want Food",
          "Day Pass Days",
        ],
      ]

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:R1`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: headers },
      })

      console.log("[Google Sheets] Initialized sheet with headers")
    }
  } catch (error) {
    console.error("[Google Sheets] Error initializing headers:", error)
  }
}
