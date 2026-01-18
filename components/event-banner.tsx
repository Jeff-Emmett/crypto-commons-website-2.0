import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function EventBanner() {
  return (
    <div className="bg-primary text-primary-foreground">
      <Link
        href="https://cryptocommonsgather.ing"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-center gap-3 text-center">
            <Sparkles className="h-5 w-5 animate-pulse hidden sm:block" />
            <span className="font-semibold text-sm sm:text-base">
              <span className="hidden sm:inline">Join us at the </span>
              <span className="font-bold">Crypto Commons Gathering 2026</span>
              <span className="hidden md:inline"> — Building the future of digital commons together</span>
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </div>
  )
}
