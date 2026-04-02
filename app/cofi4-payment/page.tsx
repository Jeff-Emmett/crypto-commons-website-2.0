"use client"

import CoFiPaymentForm from "@/components/cofi-payment-form"
import { getCurrentTier } from "@/lib/event.config"

export default function CoFi4PaymentPage() {
  const tier = getCurrentTier()
  return <CoFiPaymentForm tier={tier} />
}
