"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import {
  EVENT_SHORT,
  EVENT_DATES,
  EVENT_LOCATION,
  EVENT_DAYS,
  DAY_PASS_PRICE,
  PROCESSING_FEE_PERCENT,
  LINKS,
} from "@/lib/event.config"

export default function DayPassPage() {
  const [step, setStep] = useState<"form" | "payment">("form")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [selectedDays, setSelectedDays] = useState<string[]>([])

  const dayCount = selectedDays.length
  const subtotal = dayCount * DAY_PASS_PRICE
  const processingFee = Math.round(subtotal * PROCESSING_FEE_PERCENT * 100) / 100
  const totalPrice = subtotal + processingFee

  const toggleDay = (iso: string) => {
    setSelectedDays((prev) =>
      prev.includes(iso) ? prev.filter((d) => d !== iso) : [...prev, iso]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      await fetch("/api/cofi/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      })
    } catch {
      console.warn("Pre-registration call failed (non-critical)")
    }

    setIsSubmitting(false)
    setStep("payment")
  }

  if (step === "payment") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-full">
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Day Pass</h1>
              <p className="text-xl text-muted-foreground">Select the days you&apos;d like to attend</p>
            </div>

            <Card className="mb-8 border-primary/40">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Day selection */}
                  <div className="py-4 border-b border-border">
                    <p className="font-medium mb-3">Choose your days (€{DAY_PASS_PRICE}/day)</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {EVENT_DAYS.map((day) => (
                        <div key={day.iso} className="flex items-center space-x-2">
                          <Checkbox
                            id={day.iso}
                            checked={selectedDays.includes(day.iso)}
                            onCheckedChange={() => toggleDay(day.iso)}
                          />
                          <Label htmlFor={day.iso} className="font-normal cursor-pointer text-sm">
                            {day.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price breakdown */}
                  {dayCount > 0 && (
                    <>
                      <div className="flex justify-between py-3">
                        <span className="text-sm text-muted-foreground">
                          {dayCount} day{dayCount !== 1 ? "s" : ""} × €{DAY_PASS_PRICE}
                        </span>
                        <span className="text-sm">€{subtotal.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between py-3">
                        <span className="text-sm text-muted-foreground">
                          Processing fee ({(PROCESSING_FEE_PERCENT * 100).toFixed(0)}%)
                        </span>
                        <span className="text-sm text-muted-foreground">€{processingFee.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center py-4 bg-primary/10 -mx-6 px-6 mt-4">
                        <div>
                          <div className="font-bold text-lg">Total Amount</div>
                          <div className="text-sm text-muted-foreground">Day pass — no accommodation</div>
                        </div>
                        <span className="text-2xl font-bold text-primary">€{totalPrice.toFixed(2)}</span>
                      </div>
                    </>
                  )}

                  {dayCount === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Please select at least one day to continue.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                  <CardDescription>You&apos;ll be redirected to Mollie&apos;s secure checkout</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form action="/api/cofi/create-checkout-session" method="POST">
                    <input type="hidden" name="registrationData" value={JSON.stringify(formData)} />
                    <input type="hidden" name="isDayPass" value="true" />
                    <input type="hidden" name="dayPassDays" value={selectedDays.sort().join(",")} />

                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep("form")} className="flex-1">
                        Back
                      </Button>
                      <Button type="submit" className="flex-1" disabled={dayCount === 0}>
                        Proceed to Payment
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="text-center text-sm text-muted-foreground">
                <p>All payments are processed securely through Mollie.</p>
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">CoFi 4 — Day Pass</h1>
            <p className="text-xl text-muted-foreground">{EVENT_DATES} · {EVENT_LOCATION}</p>
            <p className="text-lg text-muted-foreground mt-2">€{DAY_PASS_PRICE} per day · No accommodation</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
              <CardDescription>Tell us who you are, then pick your days</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll send your confirmation here.
                  </p>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Continue to Day Selection"}
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground text-center">
                  <p>
                    Questions?{" "}
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
