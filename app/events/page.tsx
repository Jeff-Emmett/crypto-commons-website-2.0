import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function EventsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-20">
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-8 h-8 text-accent" />
              <h1 className="text-4xl md:text-5xl font-bold text-balance">Events</h1>
            </div>
            <p className="text-lg text-muted-foreground mb-16 text-pretty">
              Join us at upcoming gatherings, workshops, and conferences focused on crypto commons, distributed
              governance, and building digital public infrastructure.
            </p>

            <div className="space-y-8">
              {/* Featured Event */}
              <Card className="p-8 border-2 border-accent">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-accent text-accent-foreground rounded-lg px-4 py-2 text-center min-w-[80px]">
                    <div className="text-2xl font-bold">CCG</div>
                    <div className="text-sm">Annual</div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">Crypto Commons Gathering</h2>
                    <p className="text-muted-foreground mb-4">
                      Our flagship event bringing together researchers, developers, and practitioners to explore the
                      intersection of blockchain technology and commons-based governance.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button asChild>
                        <a
                          href="https://crypto-commons.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          Learn More
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Upcoming Events Section */}
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
                <Card className="p-6">
                  <p className="text-muted-foreground">
                    More events will be announced soon. Follow us to stay updated on upcoming workshops, meetups, and
                    conferences.
                  </p>
                </Card>
              </div>

              {/* Past Events Section */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Past Events</h2>
                <div className="space-y-4">
                  <Card className="p-6 hover:border-accent/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Previous Crypto Commons Gatherings</h3>
                        <p className="text-sm text-muted-foreground">Archive of past CCG events and their outcomes</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href="https://crypto-commons.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 whitespace-nowrap"
                        >
                          View Archive
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
