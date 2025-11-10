import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Research & Publications</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Academic work and publications by CCA members exploring the intersection of blockchain technology,
            commons-based governance, and digital public goods.
          </p>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Publications</h2>

          <div className="space-y-8">
            {/* Publication 1 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Challenges and Approaches to Scaling the Global Commons</CardTitle>
                <CardDescription className="text-base mt-2">
                  <span className="font-semibold">Authors:</span> Felix Fritsch, Jeff Emmett, Emaline Friedman, Rok
                  Kranjc, Sarah Manski, Michael Zargham, Michel Bauwens
                </CardDescription>
                <CardDescription className="text-sm">
                  Published in <em>Frontiers in Blockchain</em> • April 2021
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This paper explores the challenges of scaling commons-based approaches in the digital age, examining
                  how blockchain technology and tokenomics can support sustainable commons governance at global scales.
                  The authors analyze various models for coordinating distributed communities and aligning incentives
                  toward collective goals.
                </p>
                <Button asChild variant="outline">
                  <a
                    href="https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2021.578721/full"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    Read Full Paper
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Publication 2 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  The Commons Stack: Realigning Incentives Towards Public Goods
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  <span className="font-semibold">Case Study</span>
                </CardDescription>
                <CardDescription className="text-sm">Published on ResearchGate • December 2020</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This case study examines the Commons Stack, an open-source toolkit for creating token-based economies
                  that fund and support public goods. It explores how new coordination mechanisms can realign incentives
                  to promote sustainable funding for commons-oriented projects and communities.
                </p>
                <Button asChild variant="outline">
                  <a
                    href="https://www.researchgate.net/publication/347390484_The_Commons_Stack_Realigning_Incentives_Towards_Public_Goods_Case_Study"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    Read Full Paper
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Resources Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Resources</h2>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Commons Economy Roadmap</CardTitle>
              <CardDescription className="text-base mt-2">
                <span className="font-semibold">By:</span> Giulio Quarta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                A comprehensive roadmap exploring the development and implementation of commons-based economic systems.
                This resource maps out pathways for building regenerative economies that prioritize collective
                stewardship and shared value creation.
              </p>
              <Button asChild variant="outline">
                <a
                  href="https://www.commonseconomy.org/Featured-Projects-188ed0a0ef2080e184acd594f332093f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  View Roadmap
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Contribute to Our Research</h2>
              <p className="text-lg mb-6 max-w-2xl mx-auto">
                Are you working on research related to blockchain commons, tokenomics, or decentralized governance? We'd
                love to feature your work.
              </p>
              <Button asChild variant="secondary" size="lg">
                <a href="/#contact">Get in Touch</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
