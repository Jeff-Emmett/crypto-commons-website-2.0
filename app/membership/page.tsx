import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function MembershipPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-32">
        {/* Hero Section */}
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">CCA Membership in Bread Cooperative</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Understanding our cooperative membership and shared values
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                  <Image
                    src="/images/breadcoop-logo.svg"
                    alt="BreadCoop Logo"
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                  <div>
                    <h2 className="text-3xl font-bold mb-4">About Bread Cooperative</h2>
                    <p className="text-muted-foreground mb-4">
                      BreadCoop is a worker-owned cooperative that operates on principles of democratic ownership and
                      equitable distribution. As a cooperative, BreadCoop embodies the values of collective stewardship
                      and shared governance that align closely with the mission of the Crypto Commons Association.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Our Membership</h3>
                    <p className="text-muted-foreground">
                      The Crypto Commons Association is a proud member of Bread Cooperative. This membership represents
                      a natural alignment between traditional cooperative economics and emerging blockchain-based
                      commons governance models. Through this membership, we participate in a network of organizations
                      committed to building alternative economic systems based on cooperation rather than extraction.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Shared Values</h3>
                    <p className="text-muted-foreground mb-4">
                      BreadCoop's cooperative model demonstrates how organizations can be structured to prioritize
                      member wellbeing and collective decision-making over extractive profit models. These principles
                      resonate deeply with our work on digital commons:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Democratic governance and shared decision-making</li>
                      <li>Equitable distribution of resources and value</li>
                      <li>Collective ownership and stewardship</li>
                      <li>Commitment to community wellbeing over individual profit</li>
                      <li>Transparency and accountability in operations</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Supporting Our Mission</h3>
                    <p className="text-muted-foreground">
                      Bread Cooperative has generously supported the CCA with a $10,000 contribution, helping advance
                      research and development of digital commons infrastructure. This support enables more cooperative,
                      community-driven economic systems and shows how digital tools can amplify and extend proven
                      cooperative principles into the blockchain space.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button asChild variant="default" size="lg">
                      <a
                        href="https://bread.coop"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        Learn More About BreadCoop
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
