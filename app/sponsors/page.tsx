import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function SponsorsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-32">
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
            <h2 className="text-3xl font-bold mb-8">Our Supporters</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { name: "BreadCoop", logo: "/images/breadcoop-logo.svg" },
                { name: "Ledgerloops", logo: "/ledgerloops-logo-blue-circular.jpg" },
                { name: "Informal Systems", logo: "/informal-systems-logo-blue-circular.jpg" },
                { name: "EthicHub", logo: "/ethichub-logo-green-hexagon.jpg" },
                { name: "Grassroots Economics", logo: "/grassroots-economics-logo-orange-circular.jpg" },
                { name: "One Project", logo: "/one-project-logo.jpg" },
                { name: "Holochain", logo: "/holochain-logo.jpg" },
                { name: "Breadchain", logo: "/breadchain-logo.jpg" },
                { name: "Regen Network", logo: "/regen-network-logo-green-circular.jpg" },
                { name: "Namada", logo: "/namada-logo-yellow-circular.jpg" },
                { name: "Poetic Technologies", logo: "/poetic-technologies-logo-white-network.jpg" },
                { name: "Tezos", logo: "/tezos-logo-blue-t3-circular.jpg" },
                { name: "Telos", logo: "/telos-logo-purple-circular.jpg" },
              ].map((sponsor) => (
                <Card
                  key={sponsor.name}
                  className="flex flex-col items-center justify-center p-6 hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={sponsor.logo || "/placeholder.svg"}
                    alt={`${sponsor.name} Logo`}
                    width={80}
                    height={80}
                    className="object-contain mb-4"
                  />
                  <p className="text-sm font-medium text-center">{sponsor.name}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Support Our Mission</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto">
                  Help us advance the development of digital commons infrastructure and research. Your support enables
                  us to continue building tools and knowledge for community-driven blockchain ecosystems.
                </p>
                <Button asChild variant="secondary" size="lg">
                  <a href="/#contact">Become a Supporter</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
