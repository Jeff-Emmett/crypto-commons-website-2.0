"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import {
  EVENT_SHORT,
  EVENT_DATES,
  EVENT_LOCATION,
  PRICING_TIERS,
  PROCESSING_FEE_PERCENT,
  ACCOMMODATION_VENUES,
  ACCOMMODATION_MAP,
  ACCOMMODATION_NIGHTS,
  LINKS,
  type PricingTier,
} from "@/lib/event.config"

interface CoFiPaymentFormProps {
  tier: PricingTier
  promoCode?: string
  banner?: React.ReactNode
  defaultIncludeAccommodation?: boolean
}

export default function CoFiPaymentForm({ tier, promoCode, banner, defaultIncludeAccommodation = true }: CoFiPaymentFormProps) {
  const [step, setStep] = useState<"form" | "payment">("form")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [includeAccommodation, setIncludeAccommodation] = useState(defaultIncludeAccommodation)

  const [selectedVenueKey, setSelectedVenueKey] = useState(ACCOMMODATION_VENUES[0]?.key || "")
  const [accommodationType, setAccommodationType] = useState(
    ACCOMMODATION_VENUES[0]?.options[0]?.id || ""
  )
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  const baseTicketPrice = tier.price

  const accommodationPrice = ACCOMMODATION_MAP[accommodationType]?.price ?? 0
  const subtotalPrice =
    baseTicketPrice +
    (includeAccommodation ? accommodationPrice : 0)
  const processingFee = Math.round(subtotalPrice * PROCESSING_FEE_PERCENT * 100) / 100
  const totalPrice = subtotalPrice + processingFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Record registration via local API
      await fetch(`/api/cofi/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      })
    } catch {
      // Non-critical — the webhook will record everything after payment
      console.warn("Pre-registration call failed (non-critical)")
    }

    setIsSubmitting(false)
    setStep("payment")
  }

  const pricingSummary = PRICING_TIERS.map(
    (t) => `€${t.price} ${t.label}${t === tier ? " (current)" : ""}`
  ).join(" · ")

  if (step === "payment") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-full">
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Complete Your Registration</h1>
              <p className="text-xl text-muted-foreground">Choose your accommodation & payment method</p>
            </div>

            {banner}

            <Card className="mb-8 border-primary/40">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Ticket */}
                  <div className="flex items-start justify-between py-4 border-b border-border">
                    <div>
                      <div className="font-medium">{EVENT_SHORT} Ticket</div>
                      <div className="text-sm text-muted-foreground">{pricingSummary}</div>
                    </div>
                    <span className="text-lg font-semibold whitespace-nowrap ml-4">€{baseTicketPrice.toFixed(2)}</span>
                  </div>

                  {/* Accommodation */}
                  <div className="py-4 border-b border-border">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="include-accommodation"
                        checked={includeAccommodation}
                        onCheckedChange={(checked) => setIncludeAccommodation(checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <Label htmlFor="include-accommodation" className="font-medium cursor-pointer">
                            Accommodation ({ACCOMMODATION_NIGHTS} nights)
                          </Label>
                          {includeAccommodation && (
                            <span className="text-lg font-semibold whitespace-nowrap ml-4">€{accommodationPrice.toFixed(2)}</span>
                          )}
                        </div>
                        {includeAccommodation ? (
                          <div className="mt-3">
                            <RadioGroup
                              value={accommodationType}
                              onValueChange={(value: string) => {
                                setAccommodationType(value)
                                const venue = ACCOMMODATION_VENUES.find((v) =>
                                  v.options.some((o) => o.id === value)
                                )
                                if (venue) setSelectedVenueKey(venue.key)
                              }}
                              className="space-y-4"
                            >
                              {ACCOMMODATION_VENUES.map((venue) => (
                                <div key={venue.key}>
                                  <p className="font-medium text-sm mb-1">{venue.name}</p>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {venue.description}
                                  </p>
                                  <div className="pl-4 border-l-2 border-primary/20 space-y-2">
                                    {venue.options.map((opt) => (
                                      <div key={opt.id} className="flex items-center space-x-2">
                                        <RadioGroupItem value={opt.id} id={opt.id} />
                                        <Label htmlFor={opt.id} className="font-normal cursor-pointer text-sm">
                                          {opt.label} — €{opt.price.toFixed(2)} (€{opt.nightlyRate}/night)
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-1">
                            I&apos;ll arrange my own accommodation
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                    Additional Note: We&apos;ll follow up closer to the event to confirm room assignments and dietary preferences.
                  </p>

                  {/* Processing fee */}
                  <div className="flex items-start justify-between py-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Payment processing fee ({(PROCESSING_FEE_PERCENT * 100).toFixed(0)}%)</div>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">€{processingFee.toFixed(2)}</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center py-4 bg-primary/10 -mx-6 px-6 mt-4">
                    <div>
                      <div className="font-bold text-lg">Total Amount</div>
                      <div className="text-sm text-muted-foreground">
                        Ticket{includeAccommodation ? " + accommodation" : ""}
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-primary">€{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Options</CardTitle>
                  <CardDescription>Choose your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form action="/api/cofi/create-checkout-session" method="POST">
                    <input type="hidden" name="registrationData" value={JSON.stringify(formData)} />
                    <input type="hidden" name="includeAccommodation" value={includeAccommodation ? "true" : "false"} />
                    <input type="hidden" name="accommodationType" value={accommodationType} />
                    {promoCode && <input type="hidden" name="promoCode" value={promoCode} />}

                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {totalPrice > 0 ? (
                          <>
                            You&apos;ll be redirected to Mollie&apos;s secure checkout where you can pay by credit card,
                            SEPA bank transfer, iDEAL, PayPal, or other methods.
                          </>
                        ) : (
                          <>No payment required — your registration will be confirmed immediately.</>
                        )}
                      </p>

                      <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setStep("form")} className="flex-1">
                          Back to Form
                        </Button>
                        <Button type="submit" className="flex-1">
                          {totalPrice > 0 ? "Proceed to Payment" : "Confirm Registration"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  All payments are processed securely through Mollie. You&apos;ll receive a confirmation email after successful
                  payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment for CoFi 4</h1>
            <p className="text-xl text-muted-foreground">{EVENT_DATES} · {EVENT_LOCATION}</p>
          </div>

          {banner}

          <Card>
            <CardHeader>
              <CardTitle>Registration Form</CardTitle>
              <CardDescription>Tell us about yourself and what you&apos;d like to bring to {EVENT_SHORT}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">What&apos;s your name? *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll send your payment confirmation and event updates here.
                  </p>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Recording registration..." : "Continue to Payment"}
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground text-center">
                  <p>
                    Questions? Contact us at{" "}
                    <a href={`mailto:${LINKS.contactEmail}`} className="text-primary hover:underline">
                      {LINKS.contactEmail}
                    </a>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
