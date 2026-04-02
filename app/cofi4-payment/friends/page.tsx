"use client"

import CoFiPaymentForm from "@/components/cofi-payment-form"
import { PRICING_TIERS } from "@/lib/event.config"

const EARLY_BIRD_TIER = PRICING_TIERS[0]
const PROMO_CODE = "earlybird-friends"

export default function CoFi4FriendsPage() {
  return (
    <CoFiPaymentForm
      tier={EARLY_BIRD_TIER}
      promoCode={PROMO_CODE}
      banner={
        <div className="mb-8 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-center dark:bg-emerald-950/30 dark:border-emerald-800">
          <p className="text-emerald-800 dark:text-emerald-300 font-medium">
            Special early bird pricing — €{EARLY_BIRD_TIER.price} ticket
          </p>
        </div>
      }
    />
  )
}
