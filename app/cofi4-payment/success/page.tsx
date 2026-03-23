import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import {
  EVENT_SHORT,
  EVENT_FULL_NAME,
  EVENT_DATES,
  EVENT_LOCATION,
  LINKS,
} from "@/lib/event.config"

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Welcome to {EVENT_SHORT}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            You've successfully registered for {EVENT_SHORT}. Check your email for confirmation details and next steps.
          </p>
          <div className="space-y-2">
            <h3 className="font-semibold">What's Next?</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Join our community channels</li>
              <li>• Watch for pre-event communications</li>
              <li>• Start preparing your contributions</li>
              <li>• Get ready for an amazing experience</li>
            </ul>
          </div>
          <div className="text-center text-xs text-muted-foreground pt-2">
            <p>{EVENT_FULL_NAME} · {EVENT_DATES} · {EVENT_LOCATION}</p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button asChild className="flex-1">
              <Link href="/">Back to Website</Link>
            </Button>
            {LINKS.telegram && (
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <a href={LINKS.telegram}>Join Community</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
