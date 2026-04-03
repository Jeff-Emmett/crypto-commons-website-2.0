/**
 * Centralized event configuration for CoFi registration.
 *
 * All event-specific values (pricing, dates, accommodation, branding)
 * live here instead of being scattered across components and API routes.
 * To adapt this app for a new event, edit this file only.
 */

// ── Event basics ──────────────────────────────────────────────────

export const EVENT_NAME = "CoFi"
export const EVENT_FULL_NAME = "Collaborative Finance"
export const EVENT_YEAR = 2026
export const EVENT_TAGLINE = "Reimagining finance for the commons"
export const EVENT_DATES = "21–28 June 2026"
export const EVENT_LOCATION = "Commons Hub Austria (Reichenau an der Rax)"
export const EVENT_SHORT = `${EVENT_NAME} ${EVENT_YEAR}`

// ── Ticket pricing tiers (EUR) ────────────────────────────────────

interface PricingTier {
  label: string
  price: number
  /** Tier is active if today < cutoff date (ISO string, exclusive) */
  cutoff: string
}

export const PRICING_TIERS: PricingTier[] = [
  { label: "Early bird", price: 100, cutoff: "2026-03-31" },
  { label: "Regular", price: 200, cutoff: "2026-06-01" },
  { label: "Late", price: 250, cutoff: "2099-12-31" },
]

/** Returns the currently active pricing tier based on today's date */
export function getCurrentTier(): PricingTier {
  const now = new Date().toISOString().slice(0, 10)
  return PRICING_TIERS.find((t) => now < t.cutoff) ?? PRICING_TIERS[PRICING_TIERS.length - 1]
}

// ── Promo codes (map code → tier label to grant) ────────────
export const PROMO_CODES: Record<string, string> = {
  "earlybird-friends": "Early bird",
}

/** Validate a promo code and return the corresponding tier, or null */
export function getTierForPromo(code: string): PricingTier | null {
  const tierLabel = PROMO_CODES[code]
  if (!tierLabel) return null
  return PRICING_TIERS.find((t) => t.label === tierLabel) ?? null
}

/** Human-readable pricing summary for display */
export function getPricingSummary(): string {
  return PRICING_TIERS.map((t) => `€${t.price} ${t.label}`).join(" · ")
}

// ── Day pass ─────────────────────────────────────────────────────

export const DAY_PASS_PRICE = 55 // EUR per day

export interface EventDay {
  label: string
  iso: string
}

export const EVENT_DAYS: EventDay[] = [
  { label: "June 21 (Sat)", iso: "2026-06-21" },
  { label: "June 22 (Sun)", iso: "2026-06-22" },
  { label: "June 23 (Mon)", iso: "2026-06-23" },
  { label: "June 24 (Tue)", iso: "2026-06-24" },
  { label: "June 25 (Wed)", iso: "2026-06-25" },
  { label: "June 26 (Thu)", iso: "2026-06-26" },
  { label: "June 27 (Fri)", iso: "2026-06-27" },
  { label: "June 28 (Sat)", iso: "2026-06-28" },
]

// ── Processing fee ────────────────────────────────────────────────

export const PROCESSING_FEE_PERCENT = 0.02 // 2% to cover Mollie fees

// ── Accommodation ─────────────────────────────────────────────────

export interface AccommodationOption {
  id: string
  label: string
  price: number
  nightlyRate: number
  venue: string
  venueKey: string
  description?: string
}

export interface AccommodationVenue {
  key: string
  name: string
  description: string
  options: AccommodationOption[]
}

export const ACCOMMODATION_VENUES: AccommodationVenue[] = [
  {
    key: "commons-hub",
    name: "Commons Hub",
    description: "Primary event venue — shared and double rooms available.",
    options: [
      {
        id: "ch-multi",
        label: "Bed in shared room",
        price: 275,
        nightlyRate: 39,
        venue: "Commons Hub",
        venueKey: "commons-hub",
      },
      {
        id: "ch-double",
        label: "Bed in double room",
        price: 350,
        nightlyRate: 50,
        venue: "Commons Hub",
        venueKey: "commons-hub",
      },
    ],
  },
  {
    key: "herrnhof",
    name: "Herrnhof Villa",
    description: "Nearby villa with a range of room options.",
    options: [
      {
        id: "hh-living",
        label: "Bed in living room",
        price: 315,
        nightlyRate: 45,
        venue: "Herrnhof Villa",
        venueKey: "herrnhof",
      },
      {
        id: "hh-triple",
        label: "Bed in triple room",
        price: 350,
        nightlyRate: 50,
        venue: "Herrnhof Villa",
        venueKey: "herrnhof",
      },
      {
        id: "hh-twin",
        label: "Single bed in double room",
        price: 420,
        nightlyRate: 60,
        venue: "Herrnhof Villa",
        venueKey: "herrnhof",
      },
      {
        id: "hh-single",
        label: "Single room",
        price: 665,
        nightlyRate: 95,
        venue: "Herrnhof Villa",
        venueKey: "herrnhof",
      },
      {
        id: "hh-couple",
        label: "Couple room",
        price: 700,
        nightlyRate: 100,
        venue: "Herrnhof Villa",
        venueKey: "herrnhof",
      },
    ],
  },
]

/** Flat map of accommodation ID → option for quick lookup */
export const ACCOMMODATION_MAP: Record<string, AccommodationOption> = Object.fromEntries(
  ACCOMMODATION_VENUES.flatMap((v) => v.options.map((o) => [o.id, o]))
)

/** Number of nights (used in display) */
export const ACCOMMODATION_NIGHTS = 7

// ── Booking sheet criteria (maps accommodation IDs to bed search criteria) ──

export interface BookingCriteria {
  venue: string
  bedTypes: string[]
  roomFilter?: (room: string) => boolean
}

/**
 * Map accommodation option IDs to booking sheet search criteria.
 * Update this when you configure the actual booking spreadsheet.
 */
export const BOOKING_CRITERIA: Record<string, BookingCriteria> = {
  "ch-multi": {
    venue: "Commons Hub",
    bedTypes: ["bunk up", "bunk down", "single"],
  },
  "ch-double": {
    venue: "Commons Hub",
    bedTypes: ["double", "double (shared)"],
  },
  "hh-living": {
    venue: "Herrnhof Villa",
    bedTypes: ["daybed", "extra bed"],
  },
  "hh-triple": {
    venue: "Herrnhof Villa",
    bedTypes: ["single", "bunk up", "bunk down"],
  },
  "hh-twin": {
    venue: "Herrnhof Villa",
    bedTypes: ["single"],
  },
  "hh-single": {
    venue: "Herrnhof Villa",
    bedTypes: ["double"],
  },
  "hh-couple": {
    venue: "Herrnhof Villa",
    bedTypes: ["double"],
  },
}

// ── Form field toggles ────────────────────────────────────────────

export const FORM_FIELDS = {
  dietary: true,
  howHeard: true,
  crewConsent: true,
  wantFood: true,
}

// ── Email branding ────────────────────────────────────────────────

export const EMAIL_BRANDING = {
  primaryColor: "#2563eb", // blue-600
  accentColor: "#0d9488", // teal-600
  headerText: "You're In!",
  taglineColor: "#1e40af", // blue-800
  highlightBg: "#eff6ff", // blue-50
  highlightBorder: "#2563eb", // blue-600
  fromDefault: `${EVENT_NAME} Registration <cofi@rspace.online>`,
  internalNotifyDefault: "cofi.gathering@gmail.com",
}

// ── External links ────────────────────────────────────────────────

export const LINKS = {
  website: "https://www.collaborative-finance.net",
  register: "https://crypto-commons.org/cofi4-payment",
  telegram: "", // TBD — set when community channel is created
  community: "", // TBD — set when community channel is created
  contactEmail: "cofi.gathering@gmail.com",
}

// ── Payment description template ──────────────────────────────────

export function buildPaymentDescription(parts: string[]): string {
  return `${EVENT_SHORT} Registration — ${parts.join(" + ")}`
}
