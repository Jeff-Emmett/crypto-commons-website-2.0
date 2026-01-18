import Image from "next/image"

export function Hero() {
  return (
    <section className="pt-44 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="flex-shrink-0">
            <Image
              src="/images/cca-logo.png"
              alt="Crypto Commons Association"
              width={280}
              height={280}
              className="w-48 md:w-64 lg:w-72 h-auto"
              priority
            />
          </div>
          <div className="space-y-8 flex-1">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-balance">
              Crypto Commons Association
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed text-pretty">
              Actively promoting the development of digital common goods and infrastructure in distributed ledger
              technology, their academic reception and analysis, and their broad social application.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
