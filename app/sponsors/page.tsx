import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sponsors & Supporters</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            The Crypto Commons Association is grateful for the support of organizations and individuals who share our
            vision of building sustainable digital commons.
          </p>
        </div>
      </section>

      {/* Major Sponsors */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Major Supporters</h2>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="/images/breadcoop-logo.svg"
                  alt="BreadCoop Logo"
                  width={120}
                  height={120}
                  className="object-contain"
                />
                <div>
                  <CardTitle className="text-3xl">BreadCoop</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Worker Cooperative • $10,000 Contribution
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                BreadCoop is a worker-owned cooperative that operates on principles of democratic ownership and
                equitable distribution. As a cooperative, BreadCoop embodies the values of collective stewardship and
                shared governance that align closely with the mission of the Crypto Commons Association.
              </p>
              <p className="text-muted-foreground mb-4">
                Their cooperative model demonstrates how organizations can be structured to prioritize member wellbeing
                and collective decision-making over extractive profit models. By supporting the CCA with a generous
                $10,000 contribution, BreadCoop is helping advance research and development of digital commons
                infrastructure that can enable more cooperative, community-driven economic systems.
              </p>
              <p className="text-muted-foreground mb-4">
                This partnership represents a natural alignment between traditional cooperative economics and emerging
                blockchain-based commons governance models, showing how digital tools can amplify and extend proven
                cooperative principles.
              </p>
              <Button asChild variant="outline">
                <a
                  href="https://bread.coop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  Visit BreadCoop
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Support Our Mission</h2>
              <p className="text-lg mb-6 max-w-2xl mx-auto">
                Help us advance the development of digital commons infrastructure and research. Your support enables us
                to continue building tools and knowledge for community-driven blockchain ecosystems.
              </p>
              <Button asChild variant="secondary" size="lg">
                <a href="/#contact">Become a Supporter</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
