"use client"

import CoFiPaymentForm from "@/components/cofi-payment-form"
import { PRICING_TIERS } from "@/lib/event.config"

const SPONSOR_TIER = PRICING_TIERS.find((t) => t.label === "Sponsor")!
const PROMO_CODE = "weloveoursponsors"

export default function CoFi4SponsorsPage() {
  return (
    <CoFiPaymentForm
      tier={SPONSOR_TIER}
      promoCode={PROMO_CODE}
      defaultIncludeAccommodation={false}
      banner={
        <div className="mb-8 p-4 rounded-lg bg-amber-50 border border-amber-200 text-center dark:bg-amber-950/30 dark:border-amber-800">
          <p className="text-amber-900 dark:text-amber-300 font-medium">
            Sponsor complimentary registration — no payment required 🙏
          </p>
          <p className="text-sm text-amber-800/80 dark:text-amber-300/80 mt-1">
            Thank you for supporting CoFi 2026. Accommodation is opt-in; tick the box if you&apos;d like a bed on-site.
          </p>
        </div>
      }
    />
  )
}
