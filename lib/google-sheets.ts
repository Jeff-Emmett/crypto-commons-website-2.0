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
}

/**
 * Add a new registration to the Google Sheet with "Pending" status
 * Returns the row number where the registration was added
 */
export async function addRegistration(data: RegistrationData): Promise<number> {
  const sheets = getGoogleSheetsClient()

  const timestamp = new Date().toISOString()

  const values = [
    [
      timestamp,                    // A: Timestamp
      data.name,                    // B: Name
      data.email || "",             // C: Email
      "",                           // D: Contact (unused)
      "",                           // E: Contributions (unused)
      "",                           // F: Expectations (unused)
      "",                           // G: How Heard (unused)
      "",                           // H: Dietary (unused)
      "",                           // I: Crew Consent (unused)
      "Pending",                    // J: Payment Status
      "",                           // K: Payment Method
      "",                           // L: Payment Session ID
      "",                           // M: Amount Paid
      "",                           // N: Payment Date
      "",                           // O: Accommodation Venue
      "",                           // P: Accommodation Type
      "",                           // Q: Want Food (unused)
    ],
  ]

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:Q`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  })

  // Extract row number from the updated range (e.g., "Registrations!A5:N5" -> 5)
  const updatedRange = response.data.updates?.updatedRange || ""
  const match = updatedRange.match(/!A(\d+):/)
  const rowNumber = match ? parseInt(match[1], 10) : -1

  console.log(`[Google Sheets] Added registration for ${data.name} at row ${rowNumber}`)

  return rowNumber
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
      range: `${SHEET_NAME}!A:Q`,
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
    const updateRange = `${SHEET_NAME}!C${targetRowIndex}:Q${targetRowIndex}`
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
      range: `${SHEET_NAME}!A1:Q1`,
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
        ],
      ]

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:Q1`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: headers },
      })

      console.log("[Google Sheets] Initialized sheet with headers")
    }
  } catch (error) {
    console.error("[Google Sheets] Error initializing headers:", error)
  }
}
