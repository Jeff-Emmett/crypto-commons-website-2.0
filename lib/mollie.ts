import createMollieClient from "@mollie/api-client"

/** Shared lazy-initialized Mollie client singleton */
let mollieClient: ReturnType<typeof createMollieClient> | null = null

export function getMollie() {
  if (!mollieClient) {
    mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! })
  }
  return mollieClient
}
