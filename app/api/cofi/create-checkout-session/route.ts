import { type NextRequest, NextResponse } from "next/server"
import { getMollie } from "@/lib/mollie"
import {
  getCurrentTier,
  getTierForPromo,
  ACCOMMODATION_MAP,
  PROCESSING_FEE_PERCENT,
  EVENT_SHORT,
  DAY_PASS_PRICE,
  buildPaymentDescription,
} from "@/lib/event.config"
import { updatePaymentStatus } from "@/lib/google-sheets"
import { sendPaymentConfirmation, sendBookingNotification } from "@/lib/email"
import { addToListmonk } from "@/lib/listmonk"
import { assignBooking } from "@/lib/booking-sheet"

// Public base URL
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://crypto-commons.org"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const registrationDataStr = formData.get("registrationData") as string
    const registrationData = registrationDataStr ? JSON.parse(registrationDataStr) : null
    const isDayPass = formData.get("isDayPass") === "true"

    let subtotal: number
    const descriptionParts: string[] = []
    const metadata: Record<string, string> = {}

    if (registrationData) {
      metadata.name = registrationData.name || ""
      metadata.email = registrationData.email || ""
    }

    if (isDayPass) {
      // Day pass pricing
      const dayPassDays = (formData.get("dayPassDays") as string) || ""
      const days = dayPassDays.split(",").filter(Boolean)
      if (days.length === 0) {
        return NextResponse.json({ error: "No days selected" }, { status: 400 })
      }
      subtotal = days.length * DAY_PASS_PRICE
      descriptionParts.push(`Day Pass (${days.length} day${days.length !== 1 ? "s" : ""} × €${DAY_PASS_PRICE})`)
      metadata.accommodation = "none"
      metadata.dayPass = "true"
      metadata.dayPassDays = dayPassDays
    } else {
      // Regular ticket pricing
      const includeAccommodation = formData.get("includeAccommodation") === "true"
      const accommodationType = (formData.get("accommodationType") as string) || ""
      const promoCode = (formData.get("promoCode") as string) || ""
      const promoTier = promoCode ? getTierForPromo(promoCode) : null
      const tier = promoTier ?? getCurrentTier()
      subtotal = tier.price
      descriptionParts.push(`${EVENT_SHORT} Ticket (€${tier.price})`)

      if (includeAccommodation) {
        const accom = ACCOMMODATION_MAP[accommodationType]
        if (accom) {
          subtotal += accom.price
          descriptionParts.push(`${accom.label} (€${accom.price.toFixed(2)})`)
        }
      }

      metadata.accommodation = includeAccommodation ? accommodationType : "none"
    }

    // Add processing fee on top
    const processingFee = Math.round(subtotal * PROCESSING_FEE_PERCENT * 100) / 100
    const total = subtotal + processingFee
    descriptionParts.push(`Processing fee (€${processingFee.toFixed(2)})`)

    // €0 path — sponsor/comp registrations skip Mollie entirely.
    if (total === 0) {
      const sessionId = `sponsor-${Date.now()}`
      const amountPaid = "€0.00"
      const accommodation = metadata.accommodation || "none"

      let bookingResult: { success: boolean; venue?: string; room?: string; bedType?: string; error?: string } = { success: false }
      if (accommodation !== "none") {
        try {
          bookingResult = await assignBooking(metadata.name || "Unknown", accommodation)
        } catch (err) {
          console.error("[Checkout €0] Booking assignment error (non-fatal):", err)
        }
      }

      if (accommodation !== "none") {
        sendBookingNotification({
          guestName: metadata.name || "Unknown",
          guestEmail: metadata.email || "",
          accommodationType: accommodation,
          amountPaid,
          bookingSuccess: bookingResult.success,
          venue: bookingResult.venue,
          room: bookingResult.room,
          bedType: bookingResult.bedType,
          error: bookingResult.error,
        }).catch((err) => console.error("[Checkout €0] Booking notification failed:", err))
      }

      await updatePaymentStatus({
        name: metadata.name || "",
        email: metadata.email || "",
        paymentSessionId: sessionId,
        paymentStatus: "Sponsor",
        paymentMethod: "none",
        amountPaid,
        paymentDate: new Date().toISOString(),
        accommodationVenue: bookingResult.venue || "",
        accommodationType: accommodation !== "none" ? accommodation : "",
      }).catch((err) => console.error("[Checkout €0] Sheet update failed:", err))

      if (metadata.email) {
        await sendPaymentConfirmation({
          name: metadata.name || "",
          email: metadata.email,
          amountPaid,
          paymentMethod: "sponsor",
          contributions: metadata.contributions || "",
          dietary: metadata.dietary || "",
          accommodationVenue: bookingResult.success ? bookingResult.venue : undefined,
          accommodationRoom: bookingResult.success ? bookingResult.room : undefined,
        }).catch((err) => console.error("[Checkout €0] Confirmation email failed:", err))

        addToListmonk({
          email: metadata.email,
          name: metadata.name || "",
          attribs: {
            contact: metadata.contact,
            contributions: metadata.contributions,
            expectations: metadata.expectations,
          },
        }).catch((err) => console.error("[Checkout €0] Listmonk sync failed:", err))
      }

      return new Response(null, {
        status: 303,
        headers: { Location: `${BASE_URL}/cofi4-payment/success` },
      })
    }

    const payment = await getMollie().payments.create({
      amount: {
        value: total.toFixed(2),
        currency: "EUR",
      },
      description: buildPaymentDescription(descriptionParts),
      redirectUrl: `${BASE_URL}/cofi4-payment/success`,
      webhookUrl: `${BASE_URL}/api/cofi/webhook`,
      metadata,
    })

    // Redirect to Mollie checkout
    return new Response(null, {
      status: 303,
      headers: { Location: payment.getCheckoutUrl()! },
    })
  } catch (err) {
    console.error("Error creating Mollie payment:", err)
    return NextResponse.json({ error: "Error creating payment" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "This is an API endpoint. Use POST to create a checkout session." },
    { status: 405 },
  )
}
