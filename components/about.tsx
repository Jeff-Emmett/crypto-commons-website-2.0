import { Card } from "@/components/ui/card"

export function About() {
  return (
    <section id="about" className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About CCA</h2>
            <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                The Crypto Commons Association was founded in April 2021 as a legal entity aiming to actively promote the development of digital common goods and infrastructure in the field of distributed ledger technology.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <div className="text-6xl font-bold text-muted-foreground/20">01</div>
              <h3 className="text-xl font-semibold">Digital Common Goods</h3>
              <p className="text-muted-foreground leading-relaxed">
                Promoting freely accessible protocols that make planetary resource limits visible and generate funds for
                natural commons regeneration.
              </p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="text-6xl font-bold text-muted-foreground/20">02</div>
              <h3 className="text-xl font-semibold">Academic Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advancing scientific work and the design of an emerging interdisciplinary field around crypto commons.
              </p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="text-6xl font-bold text-muted-foreground/20">03</div>
              <h3 className="text-xl font-semibold">Public Accessibility</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ensuring low-threshold access to secure knowledge and socio-political interpretations of these
                technologies.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
