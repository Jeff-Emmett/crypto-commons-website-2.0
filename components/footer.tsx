export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground py-12 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="text-2xl font-mono font-bold">CCA</div>
            <p className="text-primary-foreground/80 leading-relaxed">Crypto Commons Association</p>
            <p className="text-sm text-primary-foreground/60">Founded April 2021</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <p>crypto-commons.org</p>
              <p className="text-primary-foreground/60">For inquiries about our work and mission</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Crypto Commons Association. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
