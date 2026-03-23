import { getGoogleSheetsClient } from "./google-sheets"
import { BOOKING_CRITERIA, type BookingCriteria } from "./event.config"

const BOOKING_SHEET_ID = process.env.BOOKING_SHEET_ID
const BOOKING_SHEET_NAME = process.env.BOOKING_SHEET_NAME || "Sheet1"

interface BedRow {
  rowIndex: number // 0-based index in the sheet data
  venue: string
  room: string
  bedType: string
  dateColumns: number[] // column indices for date cells
  occupied: boolean // true if any date column has a value
}

interface BookingResult {
  success: boolean
  venue?: string
  room?: string
  bedType?: string
  error?: string
}

/**
 * Parse the booking spreadsheet to extract bed information.
 *
 * Expected sheet structure:
 * - Two venue sections appear as section headers (names from event.config)
 * - Below each header: column headers with Room, Bed Type, then date columns
 * - Bed rows follow with room number, bed type, and occupant names in date columns
 * - Room numbers may be merged (only first row of a room group has the room number)
 */
function parseBookingSheet(data: string[][]): BedRow[] {
  const beds: BedRow[] = []
  let currentVenue = ""
  let dateColumnIndices: number[] = []
  let roomCol = -1
  let bedTypeCol = -1
  let lastRoom = ""
  let inDataSection = false

  // Build set of known venue names from config
  const venueNames = [...new Set(Object.values(BOOKING_CRITERIA).map((c) => c.venue.toLowerCase()))]

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    if (!row || row.length === 0) {
      // Empty row — could be section separator
      inDataSection = false
      continue
    }

    const firstCell = (row[0] || "").trim()
    const firstCellLower = firstCell.toLowerCase()

    // Detect venue section headers
    const matchedVenue = venueNames.find((v) => firstCellLower.includes(v))
    if (matchedVenue) {
      // Find the full venue name from criteria
      const criteria = Object.values(BOOKING_CRITERIA).find(
        (c) => c.venue.toLowerCase() === matchedVenue
      )
      currentVenue = criteria?.venue || firstCell
      inDataSection = false
      lastRoom = ""
      continue
    }

    if (!currentVenue) continue

    // Detect column headers row (contains "room" and date-like patterns)
    const lowerRow = row.map((c) => (c || "").trim().toLowerCase())
    const roomIdx = lowerRow.findIndex(
      (c) => c === "room" || c === "room #" || c === "room number"
    )
    const bedIdx = lowerRow.findIndex(
      (c) =>
        c === "bed type" ||
        c === "bed" ||
        c === "type" ||
        c === "bed/type"
    )

    if (roomIdx !== -1 && bedIdx !== -1) {
      roomCol = roomIdx
      bedTypeCol = bedIdx
      // Date columns are everything after bedTypeCol that looks like a date or has content
      dateColumnIndices = []
      for (let j = bedTypeCol + 1; j < row.length; j++) {
        const cell = (row[j] || "").trim()
        if (cell) {
          dateColumnIndices.push(j)
        }
      }
      inDataSection = true
      lastRoom = ""
      continue
    }

    // Parse data rows
    if (inDataSection && roomCol !== -1 && bedTypeCol !== -1) {
      let bedType = (row[bedTypeCol] || "").trim().toLowerCase()
      if (!bedType) continue // Skip rows without bed type
      // Normalize: "double (shared" → "double (shared)"
      if (bedType.includes("(") && !bedType.includes(")")) {
        bedType += ")"
      }

      // Carry forward room number from merged cells
      const roomValue = (row[roomCol] || "").trim()
      if (roomValue) {
        lastRoom = roomValue
      }
      if (!lastRoom) continue

      // Check if any date column has an occupant
      const occupied = dateColumnIndices.some((colIdx) => {
        const cell = (row[colIdx] || "").trim()
        return cell.length > 0
      })

      beds.push({
        rowIndex: i,
        venue: currentVenue,
        room: lastRoom,
        bedType,
        dateColumns: dateColumnIndices,
        occupied,
      })
    }
  }

  return beds
}

/**
 * Find the first available bed matching the given criteria
 */
function findFirstAvailableBed(
  beds: BedRow[],
  venue: string,
  bedTypes: string[],
  roomFilter?: (room: string) => boolean
): BedRow | null {
  return (
    beds.find((bed) => {
      if (bed.venue !== venue) return false
      if (!bedTypes.includes(bed.bedType)) return false
      if (bed.occupied) return false
      if (roomFilter && !roomFilter(bed.room)) return false
      return true
    }) || null
  )
}

/**
 * Write a guest name into all date columns for a given bed row
 */
async function assignGuestToBed(
  guestName: string,
  bed: BedRow,
): Promise<void> {
  const sheets = getGoogleSheetsClient()

  // Build batch update data — one value range per date column
  const data = bed.dateColumns.map((colIdx) => {
    const colLetter = columnToLetter(colIdx)
    const rowNum = bed.rowIndex + 1 // Convert to 1-indexed
    return {
      range: `${BOOKING_SHEET_NAME}!${colLetter}${rowNum}`,
      values: [[guestName]],
    }
  })

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: BOOKING_SHEET_ID!,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data,
    },
  })
}

/**
 * Convert 0-based column index to spreadsheet column letter (0→A, 25→Z, 26→AA)
 */
function columnToLetter(col: number): string {
  let letter = ""
  let c = col
  while (c >= 0) {
    letter = String.fromCharCode((c % 26) + 65) + letter
    c = Math.floor(c / 26) - 1
  }
  return letter
}

/**
 * Main entry point: assign a guest to the first available matching bed.
 * Best-effort — failures are logged but don't throw.
 */
export async function assignBooking(
  guestName: string,
  accommodationType: string
): Promise<BookingResult> {
  if (!BOOKING_SHEET_ID) {
    return { success: false, error: "BOOKING_SHEET_ID not configured" }
  }

  const criteria = BOOKING_CRITERIA[accommodationType]
  if (!criteria) {
    return {
      success: false,
      error: `Unknown accommodation type: ${accommodationType}`,
    }
  }

  try {
    const sheets = getGoogleSheetsClient()

    // Read the entire booking sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: BOOKING_SHEET_ID,
      range: BOOKING_SHEET_NAME,
    })

    const sheetData = response.data.values || []
    if (sheetData.length === 0) {
      return { success: false, error: "Booking sheet is empty" }
    }

    // Parse the sheet into bed rows
    const beds = parseBookingSheet(sheetData)

    // Find first available bed matching criteria
    const bed = findFirstAvailableBed(
      beds,
      criteria.venue,
      criteria.bedTypes,
      criteria.roomFilter
    )

    if (!bed) {
      return {
        success: false,
        error: `No available ${criteria.bedTypes.join("/")} beds in ${criteria.venue}`,
      }
    }

    // Assign the guest
    await assignGuestToBed(guestName, bed)

    console.log(
      `[Booking] Assigned ${guestName} to ${criteria.venue} Room ${bed.room} (${bed.bedType})`
    )

    return {
      success: true,
      venue: criteria.venue,
      room: bed.room,
      bedType: bed.bedType,
    }
  } catch (error) {
    console.error("[Booking] Error assigning booking:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
