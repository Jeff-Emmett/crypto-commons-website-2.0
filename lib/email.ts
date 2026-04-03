import nodemailer from "nodemailer"
import {
  EVENT_SHORT,
  EVENT_FULL_NAME,
  EVENT_DATES,
  EVENT_LOCATION,
  EMAIL_BRANDING,
  LINKS,
} from "./event.config"

// Lazy-initialized SMTP transport (Mailcow)
let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "mail.rmail.online",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "cofi@rspace.online",
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
    })
  }
  return transporter
}

const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_BRANDING.fromDefault
const INTERNAL_NOTIFY_EMAIL =
  process.env.INTERNAL_NOTIFY_EMAIL || EMAIL_BRANDING.internalNotifyDefault

interface BookingNotificationData {
  guestName: string
  guestEmail: string
  accommodationType: string
  amountPaid: string
  bookingSuccess: boolean
  venue?: string
  room?: string
  bedType?: string
  error?: string
}

export async function sendBookingNotification(
  data: BookingNotificationData
): Promise<boolean> {
  const transport = getTransporter()
  if (!transport) {
    console.log("[Email] SMTP not configured, skipping booking notification")
    return false
  }

  const statusColor = data.bookingSuccess ? "#16a34a" : "#dc2626"
  const statusLabel = data.bookingSuccess ? "ASSIGNED" : "FAILED"

  const flags: string[] = []
  if (!data.bookingSuccess) {
    flags.push(`Booking assignment failed: ${data.error || "unknown reason"}`)
  }
  if (!data.guestEmail) {
    flags.push("No email address on file for this guest")
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2 style="margin-bottom: 4px;">Accommodation Update: ${data.guestName}</h2>
      <p style="margin-top: 0; color: ${statusColor}; font-weight: bold;">${statusLabel}</p>

      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 4px 0;"><strong>Guest:</strong></td><td>${data.guestName}</td></tr>
        <tr><td style="padding: 4px 0;"><strong>Email:</strong></td><td>${data.guestEmail || "N/A"}</td></tr>
        <tr><td style="padding: 4px 0;"><strong>Paid:</strong></td><td>${data.amountPaid}</td></tr>
        <tr><td style="padding: 4px 0;"><strong>Requested:</strong></td><td>${data.accommodationType}</td></tr>
        ${data.bookingSuccess ? `
        <tr><td style="padding: 4px 0;"><strong>Assigned Venue:</strong></td><td>${data.venue}</td></tr>
        <tr><td style="padding: 4px 0;"><strong>Room:</strong></td><td>${data.room}</td></tr>
        <tr><td style="padding: 4px 0;"><strong>Bed Type:</strong></td><td>${data.bedType}</td></tr>
        ` : ""}
      </table>

      ${
        flags.length > 0
          ? `<div style="background: #fef2f2; padding: 12px 16px; border-radius: 6px; border-left: 3px solid #dc2626; margin: 16px 0;">
        <strong style="color: #dc2626;">Flags:</strong>
        <ul style="margin: 4px 0 0 0; padding-left: 20px;">${flags.map((f) => `<li>${f}</li>`).join("")}</ul>
      </div>`
          : `<p style="color: #16a34a;">No issues detected.</p>`
      }

      <p style="font-size: 12px; color: #666; margin-top: 24px;">Automated notification from ${EVENT_SHORT} registration system</p>
    </div>
  `

  try {
    const info = await transport.sendMail({
      from: EMAIL_FROM,
      to: INTERNAL_NOTIFY_EMAIL,
      subject: `[${EVENT_SHORT} Booking] ${statusLabel}: ${data.guestName} — ${data.accommodationType}`,
      html,
    })
    console.log(`[Email] Booking notification sent to ${INTERNAL_NOTIFY_EMAIL} (${info.messageId})`)
    return true
  } catch (error) {
    console.error("[Email] Failed to send booking notification:", error)
    return false
  }
}

interface PaymentConfirmationData {
  name: string
  email: string
  amountPaid: string
  paymentMethod: string
  contributions: string
  dietary: string
  accommodationVenue?: string
  accommodationRoom?: string
  dayPassDays?: string
}

export async function sendPaymentConfirmation(
  data: PaymentConfirmationData
): Promise<boolean> {
  const transport = getTransporter()
  if (!transport) {
    console.log("[Email] SMTP not configured, skipping confirmation email")
    return false
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h1 style="color: ${EMAIL_BRANDING.primaryColor}; margin-bottom: 8px;">${EMAIL_BRANDING.headerText}</h1>
      <p style="font-size: 15px; color: ${EMAIL_BRANDING.taglineColor}; margin-top: 0; margin-bottom: 28px; font-style: italic;">${EVENT_FULL_NAME} ${EVENT_DATES}</p>

      <p>Dear ${data.name},</p>

      <p>Your payment of <strong>${data.amountPaid}</strong> has been confirmed. You are now registered for <strong>${EVENT_SHORT}</strong>, ${EVENT_DATES} in ${EVENT_LOCATION}.</p>

      <div style="background: ${EMAIL_BRANDING.highlightBg}; padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 3px solid ${EMAIL_BRANDING.highlightBorder};">
        <h3 style="margin-top: 0; color: ${EMAIL_BRANDING.taglineColor};">Registration Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0;"><strong>Amount:</strong></td>
            <td style="padding: 4px 0;">${data.amountPaid}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Payment:</strong></td>
            <td style="padding: 4px 0;">${data.paymentMethod}</td>
          </tr>
          ${data.dietary ? `<tr><td style="padding: 4px 0;"><strong>Dietary:</strong></td><td style="padding: 4px 0;">${data.dietary}</td></tr>` : ""}
          ${data.accommodationVenue ? `<tr><td style="padding: 4px 0;"><strong>Accommodation:</strong></td><td style="padding: 4px 0;">${data.accommodationVenue}${data.accommodationRoom ? `, Room ${data.accommodationRoom}` : ""}</td></tr>` : ""}
          ${data.dayPassDays ? `<tr><td style="padding: 4px 0;"><strong>Days attending:</strong></td><td style="padding: 4px 0;">${data.dayPassDays.split(",").map((d: string) => { const dt = new Date(d + "T12:00:00Z"); return dt.toLocaleDateString("en-GB", { month: "long", day: "numeric", weekday: "short" }); }).join(", ")}</td></tr>` : ""}
        </table>
      </div>

      <h3 style="color: ${EMAIL_BRANDING.taglineColor};">What's Next?</h3>
      <ul style="line-height: 1.8;">
        <li>Join the <a href="${LINKS.telegram}" style="color: ${EMAIL_BRANDING.primaryColor};">${EVENT_SHORT} community</a> to connect with other participants</li>
        <li>We'll follow up with further details on logistics and schedule</li>
      </ul>

      <p style="margin-top: 32px;">
        See you there,<br>
        <strong>The ${EVENT_SHORT} Team</strong>
      </p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 32px 0;">
      <p style="font-size: 12px; color: #666;">
        You received this email because you registered at ${LINKS.website.replace("https://", "")}.<br>
        <a href="${LINKS.website}">${LINKS.website.replace("https://", "")}</a>
      </p>
    </div>
  `

  try {
    const info = await transport.sendMail({
      from: EMAIL_FROM,
      to: data.email,
      bcc: INTERNAL_NOTIFY_EMAIL,
      subject: `Registration Confirmed - ${EVENT_SHORT}`,
      html,
    })
    console.log(
      `[Email] Payment confirmation sent to ${data.email} (${info.messageId})`
    )
    return true
  } catch (error) {
    console.error("[Email] Failed to send payment confirmation:", error)
    return false
  }
}
