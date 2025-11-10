import Link from "next/link"
import Image from "next/image"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/cca-logo.png"
              alt="Crypto Commons Association"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
            <div className="text-2xl font-mono font-bold tracking-tight">Crypto Commons Association</div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/#commons" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              What are Crypto Commons
            </Link>
            <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Events
            </Link>
            <Link href="/#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
