import { type NextRequest, NextResponse } from "next/server"
import { getMollie } from "@/lib/mollie"
import { updatePaymentStatus } from "@/lib/google-sheets"
import { sendPaymentConfirmation, sendBookingNotification } from "@/lib/email"
import { addToListmonk } from "@/lib/listmonk"
import { assignBooking } from "@/lib/booking-sheet"

export async function POST(request: NextRequest) {
  try {
    // Mollie sends payment ID in the body as form data
    const formData = await request.formData()
    const paymentId = formData.get("id") as string

    if (!paymentId) {
      console.error("[Webhook] No payment ID received")
      return NextResponse.json({ error: "Missing payment ID" }, { status: 400 })
    }

    // Fetch the full payment from Mollie API (this is how you verify — no signature needed)
    const payment = await getMollie().payments.get(paymentId)
    const metadata = (payment.metadata || {}) as Record<string, string>

    console.log(`[Webhook] Payment ${paymentId} status: ${payment.status}`)

    if (payment.status === "paid") {
      const customerEmail = metadata.email || payment.billingAddress?.email || ""
      const amountPaid = `€${payment.amount.value}`
      const accommodationType = metadata.accommodation || "none"

      // Attempt room booking assignment (best-effort, don't fail webhook)
      let bookingResult: { success: boolean; venue?: string; room?: string; bedType?: string } = { success: false }
      if (accommodationType !== "none") {
        try {
          bookingResult = await assignBooking(metadata.name || "Unknown", accommodationType)
          if (bookingResult.success) {
            console.log(`[Webhook] Booking assigned: ${bookingResult.venue} Room ${bookingResult.room}`)
          } else {
            console.warn(`[Webhook] Booking assignment failed (non-fatal): ${(bookingResult as { error?: string }).error}`)
          }
        } catch (err) {
          console.error("[Webhook] Booking assignment error (non-fatal):", err)
        }
      }

      // Send internal notification about accommodation assignment
      if (accommodationType !== "none") {
        sendBookingNotification({
          guestName: metadata.name || "Unknown",
          guestEmail: customerEmail,
          accommodationType,
          amountPaid,
          bookingSuccess: bookingResult.success,
          venue: bookingResult.venue,
          room: bookingResult.room,
          bedType: bookingResult.bedType,
          error: (bookingResult as { error?: string }).error,
        }).catch((err) => console.error("[Webhook] Booking notification failed:", err))
      }

      // Update Google Sheet
      const updated = await updatePaymentStatus({
        name: metadata.name || "",
        email: customerEmail,
        paymentSessionId: paymentId,
        paymentStatus: "Paid",
        paymentMethod: payment.method || "unknown",
        amountPaid,
        paymentDate: new Date().toISOString(),
        accommodationVenue: bookingResult.venue || "",
        accommodationType: accommodationType !== "none" ? accommodationType : "",
      })

      if (updated) {
        console.log(`[Webhook] Google Sheet updated for ${metadata.name}`)
      } else {
        console.error(`[Webhook] Failed to update Google Sheet for ${metadata.name}`)
      }

      // Send confirmation email
      if (customerEmail) {
        await sendPaymentConfirmation({
          name: metadata.name || "",
          email: customerEmail,
          amountPaid,
          paymentMethod: payment.method || "card",
          contributions: metadata.contributions || "",
          dietary: metadata.dietary || "",
          accommodationVenue: bookingResult.success ? bookingResult.venue : undefined,
          accommodationRoom: bookingResult.success ? bookingResult.room : undefined,
        })

        // Add to Listmonk newsletter
        addToListmonk({
          email: customerEmail,
          name: metadata.name || "",
          attribs: {
            contact: metadata.contact,
            contributions: metadata.contributions,
            expectations: metadata.expectations,
          },
        }).catch((err) => console.error("[Webhook] Listmonk sync failed:", err))
      }
    } else if (payment.status === "failed" || payment.status === "canceled" || payment.status === "expired") {
      console.log(`[Webhook] Payment ${payment.status}: ${paymentId}`)

      if (metadata.name) {
        await updatePaymentStatus({
          name: metadata.name,
          paymentSessionId: paymentId,
          paymentStatus: "Failed",
          paymentDate: new Date().toISOString(),
        })
      }
    }

    // Mollie expects 200 OK
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("[Webhook] Error:", err)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
