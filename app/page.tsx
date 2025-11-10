import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { WhatAreCommons } from "@/components/what-are-commons"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <WhatAreCommons />
      <Footer />
    </main>
  )
}
